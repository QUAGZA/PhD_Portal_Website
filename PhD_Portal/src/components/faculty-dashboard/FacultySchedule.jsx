import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function FacultySchedule() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day
    return new Date(today.setDate(diff))
  })

  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const weekDates = getWeekDates()
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">My Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToPreviousWeek}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={goToNextWeek}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const isToday = new Date().toDateString() === date.toDateString()
            return (
              <div
                key={index}
                className={`text-center p-3 rounded-lg border transition-all ${
                  isToday
                    ? "bg-red-50 border-red-500"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="text-xs text-gray-600 font-medium mb-1">
                  {days[index]}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isToday ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {date.getDate()}
                </div>
                <div className="mt-2 space-y-1">
                  {/* Placeholder for events - will be populated with real data */}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          No events scheduled for this week
        </div>
      </CardContent>
    </Card>
  )
}
