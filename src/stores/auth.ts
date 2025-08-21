import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setAuth = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      error.value = null

      const response = await authService.login(credentials)
      setAuth(response.user, response.token)

      return { success: true }
    } catch (err: unknown) {
      // Enhanced error handling to extract the message from API response
      const errorResponse = err as {
        response?: {
          data?: {
            message?: string
            errors?: Record<string, string[]>
          }
          status?: number
        }
      }

      const errorMessage =
        errorResponse?.response?.data?.message ||
        (err instanceof Error ? err.message : null) ||
        `Request failed with status ${errorResponse?.response?.status || 'unknown'}`

      error.value = errorMessage
      return {
        success: false,
        error: error.value,
        errors: errorResponse?.response?.data?.errors,
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    try {
      loading.value = true
      error.value = null

      const response = await authService.register(credentials)
      setAuth(response.user, response.token)

      return { success: true }
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } }
      }
      const errorMessage = errorResponse?.response?.data?.message || 'Registration failed'

      error.value = errorMessage
      return {
        success: false,
        error: error.value,
        errors: errorResponse?.response?.data?.errors,
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    initAuth,
    clearAuth,
  }
})
