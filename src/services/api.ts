import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL
if (!baseURL) {
  throw new Error('VITE_API_BASE_URL environment variable is required')
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // This header prevents Sanctum from treating requests as "stateful"
    'X-Requested-With': 'XMLHttpRequest',
  },
  // DON'T set withCredentials: true for cross-domain token auth
  withCredentials: false,
})

// Request interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      // Use Vue Router instead of window.location if available
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
