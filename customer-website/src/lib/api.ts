import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1/store',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ─── Request Interceptor ─────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('customer_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Session ID for guest cart
  const sessionId = localStorage.getItem('session_id') || generateSessionId()
  config.headers['X-Session-ID'] = sessionId

  // Language & currency
  const lang     = localStorage.getItem('language')  || 'en'
  const currency  = localStorage.getItem('currency')  || 'USD'
  config.headers['Accept-Language'] = lang
  config.headers['X-Currency']      = currency

  return config
})

// ─── Response Interceptor ────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    return Promise.reject(error)
  }
)

function generateSessionId(): string {
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  localStorage.setItem('session_id', id)
  return id
}

export default api
