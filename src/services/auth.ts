import api from './api'
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/login', credentials)
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/register', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/logout')
  },

  async me(): Promise<User> {
    const response = await api.get('/me')
    return response.data
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/refresh')
    return response.data
  },
}
