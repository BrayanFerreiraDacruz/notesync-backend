import { authService } from './authService'

const API_BASE_URL = 'https://backend-u287.onrender.com/api'

class EventService {
  async getEvents(startDate, endDate) {
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)

      const response = await fetch(`${API_BASE_URL}/events?${params}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          events: data.events || []
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || 'Erro ao carregar eventos'
        }
      }
    } catch (error) {
      console.error('Get events error:', error)
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      }
    }
  }

  async createEvent(eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          event: data.event
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || 'Erro ao criar evento'
        }
      }
    } catch (error) {
      console.error('Create event error:', error)
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      }
    }
  }

  async updateEvent(eventId, eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          event: data.event
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || 'Erro ao atualizar evento'
        }
      }
    } catch (error) {
      console.error('Update event error:', error)
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      }
    }
  }

  async deleteEvent(eventId) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      })

      if (response.ok) {
        return {
          success: true
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || 'Erro ao deletar evento'
        }
      }
    } catch (error) {
      console.error('Delete event error:', error)
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      }
    }
  }

  async getEventById(eventId) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          event: data.event
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || 'Erro ao carregar evento'
        }
      }
    } catch (error) {
      console.error('Get event error:', error)
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      }
    }
  }

  async searchEvents(query) {
    try {
      const params = new URLSearchParams({ q: query })
      const response = await fetch(`${API_BASE_URL}/events/search?${params}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          events: data.events || []
        }
      } else {
        const errorData = await response.json()
        return {
          success: false,
          error: errorData.message || 'Erro ao buscar eventos'
        }
      }
    } catch (error) {
      console.error('Search events error:', error)
      return {
        success: false,
        error: 'Erro de conexão com o servidor'
      }
    }
  }
}

export const eventService = new EventService()

