import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const loginUser = async (credentials: { email: string; password: string }) => {
    const result = await authStore.login(credentials)
    if (result.success) {
      router.push('/dashboard')
    }
    return result
  }

  const registerUser = async (credentials: {
    first_name: string
    last_name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    const result = await authStore.register(credentials)
    if (result.success) {
      router.push('/dashboard')
    }
    return result
  }

  const logoutUser = async () => {
    await authStore.logout()
    router.push('/login')
  }

  return {
    user: authStore.user,
    loading: authStore.loading,
    error: authStore.error,
    isAuthenticated: authStore.isAuthenticated,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
  }
}
