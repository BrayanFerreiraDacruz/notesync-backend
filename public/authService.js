const API_BASE_URL = 'https://backend-u287.onrender.com/api'

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          token: data.token,
          user: data.user
        }
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao fazer login'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      }
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          token: data.token,
          user: data.user
        }
      } else {
        return {
          success: false,
          error: data.message || 'Erro ao criar conta'
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      }
    }
  }

  async validateToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.user
      } else {
        return null
      }
    } catch (error) {
      console.error('Token validation error:', error)
      return null
    }
  }

  async refreshToken() {
    try {
      const token = localStorage.getItem('noteaqui_token')
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('noteaqui_token', data.token)
        return data.token
      } else {
        localStorage.removeItem('noteaqui_token')
        return null
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      localStorage.removeItem('noteaqui_token')
      return null
    }
  }

  getAuthHeaders() {
    const token = localStorage.getItem('noteaqui_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }
}

export const authService = new AuthService()

