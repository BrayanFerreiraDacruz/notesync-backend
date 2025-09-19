import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Grid3X3,
  List,
  Clock,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { eventService } from '../services/eventService'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // 'day', 'week', 'month'
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [currentDate, view])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const startDate = getViewStartDate()
      const endDate = getViewEndDate()
      
      const result = await eventService.getEvents(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )

      if (result.success) {
        setEvents(result.events || [])
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getViewStartDate = () => {
    const date = new Date(currentDate)
    switch (view) {
      case 'day':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      case 'week':
        const dayOfWeek = date.getDay()
        const startOfWeek = new Date(date)
        startOfWeek.setDate(date.getDate() - dayOfWeek)
        return startOfWeek
      case 'month':
        return new Date(date.getFullYear(), date.getMonth(), 1)
      default:
        return date
    }
  }

  const getViewEndDate = () => {
    const date = new Date(currentDate)
    switch (view) {
      case 'day':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      case 'week':
        const dayOfWeek = date.getDay()
        const endOfWeek = new Date(date)
        endOfWeek.setDate(date.getDate() + (6 - dayOfWeek))
        return endOfWeek
      case 'month':
        return new Date(date.getFullYear(), date.getMonth() + 1, 0)
      default:
        return date
    }
  }

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + direction)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7))
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction)
        break
    }
    setCurrentDate(newDate)
  }

  const formatDateHeader = () => {
    const options = {
      year: 'numeric',
      month: 'long',
      ...(view === 'day' && { day: 'numeric' })
    }
    return currentDate.toLocaleDateString('pt-BR', options)
  }

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateStr)
  }

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: 'bg-blue-500',
      task: 'bg-green-500',
      reminder: 'bg-yellow-500',
      event: 'bg-purple-500',
      default: 'bg-gray-500'
    }
    return colors[type] || colors.default
  }

  const renderMonthView = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startOfCalendar = new Date(startOfMonth)
    startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay())
    
    const days = []
    const current = new Date(startOfCalendar)
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Week days header */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-slate-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isToday = day.toDateString() === new Date().toDateString()
            const dayEvents = getEventsForDate(day)

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`min-h-[120px] p-2 border-r border-b border-slate-100 cursor-pointer transition-colors ${
                  isCurrentMonth ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 text-slate-400'
                } ${isToday ? 'bg-emerald-50 border-emerald-200' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isToday ? 'text-emerald-600' : isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const startOfWeek = getViewStartDate()
    const days = []
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-7 border-b border-slate-200">
          {days.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString()
            const dayEvents = getEventsForDate(day)

            return (
              <div key={index} className={`p-4 border-r border-slate-100 ${isToday ? 'bg-emerald-50' : ''}`}>
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-slate-600">{weekDays[index]}</div>
                  <div className={`text-lg font-bold ${isToday ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {day.getDate()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-2 rounded-lg text-white text-sm cursor-pointer ${getEventTypeColor(event.type)}`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-90 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.time || '00:00'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            {currentDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="flex border-b border-slate-100">
              <div className="w-20 p-3 text-sm text-slate-500 border-r border-slate-100">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 p-3 min-h-[60px]">
                {dayEvents
                  .filter(event => {
                    const eventHour = event.time ? parseInt(event.time.split(':')[0]) : 0
                    return eventHour === hour
                  })
                  .map(event => (
                    <motion.div
                      key={event.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-lg text-white mb-2 cursor-pointer ${getEventTypeColor(event.type)}`}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm opacity-90">{event.description}</div>
                      {event.location && (
                        <div className="text-xs opacity-80 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendário</h1>
          <p className="text-slate-600">Visualize e gerencie seus eventos</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>

          <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate(-1)}
                  className="border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <h2 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
                  {formatDateHeader()}
                </h2>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate(1)}
                  className="border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="border-slate-200"
              >
                Hoje
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={view} onValueChange={setView}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Dia</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-slate-600">Carregando eventos...</span>
              </div>
            </div>
          ) : (
            <>
              {view === 'month' && renderMonthView()}
              {view === 'week' && renderWeekView()}
              {view === 'day' && renderDayView()}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Event Details Modal would go here */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">
              Eventos de {selectedDate.toLocaleDateString('pt-BR')}
            </h3>
            
            <div className="space-y-3 mb-4">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-slate-600">{event.description}</div>
                  <Badge className={`mt-2 ${getEventTypeColor(event.type)} text-white`}>
                    {event.type || 'evento'}
                  </Badge>
                </div>
              ))}
              
              {getEventsForDate(selectedDate).length === 0 && (
                <p className="text-slate-500 text-center py-4">
                  Nenhum evento neste dia
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedDate(null)}
              >
                Fechar
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Evento
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Calendar

