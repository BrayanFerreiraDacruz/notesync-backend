import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('noteaqui_token')
      if (token) {
        const userData = await authService.validateToken(token)
        if (userData) {
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('noteaqui_token')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('noteaqui_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      
      if (response.success) {
        localStorage.setItem('noteaqui_token', response.token)
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Erro de conexão. Tente novamente.' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)
      
      if (response.success) {
        localStorage.setItem('noteaqui_token', response.token)
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return { success: false, error: 'Erro de conexão. Tente novamente.' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('noteaqui_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

