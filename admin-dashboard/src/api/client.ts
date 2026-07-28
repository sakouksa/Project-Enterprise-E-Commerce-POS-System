import axios, { type AxiosRequestConfig } from 'axios'
import { notification } from 'antd'
import { useAuthStore } from '@/stores/authStore'

const getBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  if (import.meta.env.DEV) {
    return '/api/v1'
  }
  const hostname = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : '127.0.0.1'
  return `http://${hostname}:8001/api/v1`
}

export const API_BASE_URL = getBaseURL()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
  timeout: 30000,
})

// Notification Debouncer to prevent duplicate toast popups
const keyTimeMap = new Map<string, number>()
let globalLastNotificationTime = 0

const notifyOnce = (key: string, type: 'warning' | 'error' | 'info', title: string, desc: string) => {
  const now = Date.now()
  const lastKeyTime = keyTimeMap.get(key) || 0

  // Deduplicate identical error key within 5 seconds
  if (now - lastKeyTime < 5000) {
    return
  }

  // Global throttle: prevent showing more than 1 error toast within 1.5 seconds to avoid toast stacking
  if (now - globalLastNotificationTime < 1500) {
    return
  }

  keyTimeMap.set(key, now)
  globalLastNotificationTime = now

  notification[type]({
    key: `api_notification_${key}`,
    title: title,
    description: desc,
    placement: 'topRight',
    duration: 4,
    style: {
      borderRadius: '16px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    },
  })
}

// Queue mechanism for handling simultaneous 401 refresh requests
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// ─── Request Interceptor ──────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState()
    const token = state.accessToken || state.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const lang = localStorage.getItem('enterprise-pos-lang') || 'en'
    config.headers['Accept-Language'] = lang
    config.headers['X-Device-Name'] = 'Web Admin Dashboard'
    config.headers['X-Browser-Name'] = navigator.userAgent.includes('Chrome')
      ? 'Chrome'
      : navigator.userAgent.includes('Firefox')
      ? 'Firefox'
      : 'Web Browser'

    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // If request specifies silent handling (e.g. background polling), skip toast notification
    if ((originalRequest as any)?.silent) {
      return Promise.reject(error)
    }

    // If network error / offline
    if (!error.response) {
      if (!navigator.onLine) {
        notifyOnce('network', 'error', 'No Internet Connection', 'No internet connection. Please check your network.')
      } else if (error.code === 'ECONNABORTED') {
        notifyOnce('timeout', 'error', 'Request Timeout', 'The request timed out. Please try again.')
      } else {
        notifyOnce('server', 'error', 'Server Connection Error', 'Unable to connect to backend system server.')
      }
      return Promise.reject(error)
    }

    const status = error.response.status
    const isAuthRoute = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')

    // Handle 401 Unauthorized with Automatic Token Refresh
    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true
      const refreshToken = useAuthStore.getState().refreshToken

      if (!refreshToken) {
        isRefreshing = false
        useAuthStore.getState().logout()
        notifyOnce('session', 'error', 'Session Expired', 'Your session has expired. Please sign in again.')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token: newRefreshToken, user } = refreshResponse.data.data

        useAuthStore.getState().setAuth(user, access_token, newRefreshToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }

        processQueue(null, access_token)
        isRefreshing = false

        return api(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        isRefreshing = false
        useAuthStore.getState().logout()

        notifyOnce('session', 'error', 'Session Expired', 'Your session has expired. Please sign in again.')

        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshErr)
      }
    }

    // Handle 403 Forbidden with debounced notification
    if (status === 403) {
      const serverMsg = error.response?.data?.message || 'Access restricted for current user role.'
      notifyOnce('403', 'warning', '🔒 Security Access Control', serverMsg)
    }

    // Handle 429 Too Many Requests
    if (status === 429) {
      notifyOnce('429', 'warning', 'Too Many Requests', 'Too many requests. Please wait before trying again.')
    }

    // Handle 5xx Server Error
    if (status >= 500) {
      if (status === 503) {
        notifyOnce('503', 'info', 'Maintenance Mode', 'The system is currently undergoing scheduled maintenance.')
      } else {
        const msg = error.response?.data?.message || 'Unexpected server error encountered.'
        notifyOnce('500', 'error', 'Server Error', msg)
      }
    }

    return Promise.reject(error)
  }
)

export default api
