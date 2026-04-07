import api from '../config/axiosGlobal'
import type { AuthTokens, User } from '../types/api.types'

export const authService = {
  async login(email: string, password: string): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>('/auth/token/', { email, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/accounts/profile/me/')
    return data
  },

  async refreshToken(refresh: string): Promise<AuthTokens> {
    const { data } = await api.post<AuthTokens>('/auth/token/refresh/', { refresh })
    localStorage.setItem('access_token', data.access)
    return data
  },

  logout(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  },
}
