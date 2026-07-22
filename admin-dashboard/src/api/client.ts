import axios, { type AxiosRequestConfig } from 'axios'
import { notification } from 'antd'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8001/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
  timeout: 30000,
})

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

    // If network error / offline
    if (!error.response) {
      if (!navigator.onLine || error.code === 'ERR_NETWORK') {
        notification.error({
          message: 'No Internet Connection',
          description: 'No internet connection. Please check your network.',
          placement: 'topRight',
        })
      } else if (error.code === 'ECONNABORTED') {
        notification.error({
          message: 'Request Timeout',
          description: 'The request timed out. Please try again.',
          placement: 'topRight',
        })
      } else {
        notification.error({
          message: 'Server Error',
          description: 'Unable to connect to server.',
          placement: 'topRight',
        })
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
        notification.error({
          message: 'Session Expired',
          description: 'Your session has expired. Please sign in again.',
          placement: 'topRight',
        })
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      try {
        const refreshResponse = await axios.post('http://127.0.0.1:8001/api/v1/auth/refresh', {
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

        notification.error({
          message: 'Session Expired',
          description: 'Your session has expired. Please sign in again.',
          placement: 'topRight',
        })

        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshErr)
      }
    }

    // Handle 403 Forbidden
    if (status === 403) {
      notification.warning({
        message: 'Access Denied',
        description: error.response?.data?.message || 'You do not have permission.',
        placement: 'topRight',
      })
    }

    // Handle 429 Too Many Requests
    if (status === 429) {
      notification.warning({
        message: 'Too Many Requests',
        description: error.response?.data?.message || 'Too many requests. Please wait before trying again.',
        placement: 'topRight',
      })
    }

    // Handle 500 Server Error
    if (status === 500) {
      notification.error({
        message: 'Server Error',
        description: 'Unexpected server error.',
        placement: 'topRight',
      })
    }

    // Handle 503 Maintenance Mode
    if (status === 503) {
      notification.info({
        message: 'Maintenance Mode',
        description: 'The system is currently under maintenance.',
        placement: 'topRight',
      })
    }

    return Promise.reject(error)
  }
)

export default api
