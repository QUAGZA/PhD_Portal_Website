import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { getGuideSchedule } from "@/services/guideDashboardService"

const eventColors = {
  check: "bg-amber-100 text-amber-800 border-amber-200",
  test: "bg-blue-100 text-blue-800 border-blue-200",
  deadline: "bg-red-100 text-red-800 border-red-200",
  other: "bg-gray-100 text-gray-800 border-gray-200",
}

// Helper function to get the start of the week (Sunday)
const getStartOfWeek = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

// Helper function to format week range
const formatWeekRange = (startDate) => {
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)

  const startStr = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  const endStr = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return `${startStr} - ${endStr}`
}

export function GuideSchedule() {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()))
  const [scheduleEvents, setScheduleEvents] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchScheduleEvents()
  }, [currentWeekStart])

  const fetchScheduleEvents = async () => {
    try {
      setLoading(true)
      const weekStartISO = currentWeekStart.toISOString().split('T')[0]
      const data = await getGuideSchedule(weekStartISO)
      setScheduleEvents(data.events || {})
    } catch (error) {
      console.error('Error fetching schedule:', error)
      setScheduleEvents({})
    } finally {
      setLoading(false)
    }
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getStartOfWeek(new Date()))
  }

  // Generate week days
  const weekDays = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart)
    date.setDate(currentWeekStart.getDate() + i)

    const dateKey = date.toISOString().split('T')[0] // Format: YYYY-MM-DD
    const dayEvents = scheduleEvents[dateKey] || []

    weekDays.push({
      day: dayNames[i],
      date: date.getDate(),
      fullDate: date,
      events: dayEvents,
      isToday: date.toDateString() === new Date().toDateString()
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pt-4 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5 text-red-500" />
          My Schedule
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent border-gray-300 hover:bg-gray-50"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2"
            onClick={goToCurrentWeek}
          >
            {formatWeekRange(currentWeekStart)}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent border-gray-300 hover:bg-gray-50"
            onClick={goToNextWeek}
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`border rounded-lg p-2 min-h-28 transition-colors cursor-pointer ${
                day.isToday
                  ? 'border-red-300 bg-red-50 hover:bg-red-100'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="text-center mb-2">
                <p className={`text-xs font-medium ${
                  day.isToday ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {day.day}
                </p>
                <p className={`text-lg font-bold ${
                  day.isToday ? 'text-red-700' : 'text-gray-900'
                }`}>
                  {day.date}
                </p>
              </div>
              <div className="space-y-1">
                {day.events.map((evt) => (
                  <Badge
                    key={evt.id}
                    className={`text-xs w-full justify-center border ${eventColors[evt.type]} py-1`}
                    variant="outline"
                  >
                    {evt.title}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}