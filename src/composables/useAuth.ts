import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'

export const useAuth = () => {
  const authStore = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()

  const loginUser = async (credentials: { email: string; password: string }) => {
    const result = await authStore.login(credentials)
    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Successfully signed in. Welcome back!',
      })
      router.push('/dashboard')
    } else {
      toast({
        title: 'Sign in failed',
        description: result.error || 'Please check your credentials and try again.',
        variant: 'destructive',
      })
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
      toast({
        title: 'Account created!',
        description: 'Your account has been created successfully. Welcome!',
      })
      router.push('/dashboard')
    } else {
      toast({
        title: 'Registration failed',
        description: result.error || 'Please check your information and try again.',
        variant: 'destructive',
      })
    }
    return result
  }

  const logoutUser = async () => {
    await authStore.logout()
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out. See you next time!',
    })
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
