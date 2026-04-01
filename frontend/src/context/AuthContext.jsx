import { createContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('equipath_token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me')
      if (response.data.success) {
        setUser(response.data.data.user)
        setProfile(response.data.data.profile)
      }
    } catch (err) {
      localStorage.removeItem('equipath_token')
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (email, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/login', { email, password })
      if (response.data.success) {
        localStorage.setItem('equipath_token', response.data.data.token)
        setUser(response.data.data.user)
        await fetchUser() // Fetch full profile
        return response.data.data.user
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const register = useCallback(async (data) => {
    try {
      setError(null)
      const response = await api.post('/auth/register', data)
      if (response.data.success) {
        localStorage.setItem('equipath_token', response.data.data.token)
        setUser(response.data.data.user)
        await fetchUser()
        return response.data.data.user
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed'
      setError(msg)
      throw new Error(msg)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('equipath_token')
    setUser(null)
    setProfile(null)
  }, [])

  const value = {
    user,
    profile,
    loading,
    error,
    login,
    register,
    logout,
    fetchUser,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
