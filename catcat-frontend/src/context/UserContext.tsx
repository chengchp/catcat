'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authApi, getToken, setToken as setApiToken, clearToken as clearApiToken, type User } from '@/lib/api'

interface UserContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: { username: string; password: string; nickname?: string; email?: string }) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isLoggedIn = !!user || !!getToken()

  const checkAuth = useCallback(async () => {
    try {
      const token = getToken()
      if (!token) {
        setUser(null)
        return
      }

      const response = await authApi.getCurrentUser()
      if (response.success) {
        setUser(response.data)
      } else {
        setUser(null)
        clearApiToken()
      }
    } catch {
      setUser(null)
      clearApiToken()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password)
    if (response.success) {
      setApiToken(response.data.token)
      await checkAuth()
    } else {
      throw new Error('登录失败')
    }
  }

  const register = async (data: { username: string; password: string; nickname?: string; email?: string }) => {
    const response = await authApi.register(data)
    if (response.success) {
      // 注册后自动登录
      await login(data.username, data.password)
    } else {
      throw new Error('注册失败')
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      clearApiToken()
      setUser(null)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
