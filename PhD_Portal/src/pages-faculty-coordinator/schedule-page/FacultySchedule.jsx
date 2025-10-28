import React, { useState } from "react"
import {
  format,
  startOfWeek,
  addDays,
  subWeeks,
  addWeeks,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval
} from "date-fns"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Users } from "lucide-react"

const getCurrentWeekDates = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 })
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i))
}

const getMonthDates = (date) => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 })
  const end = endOfMonth(date)
  const totalDays = eachDayOfInterval({
    start,
    end: addDays(end, 6 - (end.getDay() % 7))
  })
  return totalDays
}

const colorClasses = [
  "bg-blue-400",
  "bg-green-400",
  "bg-orange-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-yellow-400"
]

export default function FacultySchedule() {
  const [mode, setMode] = useState("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Sample events data for Faculty Coordinator
  const events = [
    {
      date: "2025-06-16",
      title: "Department Meeting",
      type: "meeting",
      guide: "All"
    },
    {
      date: "2025-06-17",
      title: "PhD Progress Review Committee",
      type: "review",
      guide: "Dr. Smith, Dr. Johnson"
    },
    {
      date: "2025-06-17",
      title: "New Student Orientation",
      type: "event",
      guide: "All"
    },
    {
      date: "2025-06-18",
      title: "Guide Assignment Review",
      type: "meeting",
      guide: "Dr. Williams"
    },
    {
      date: "2025-06-18",
      title: "Research Ethics Committee",
      type: "meeting",
      guide: "All Guides"
    },
    {
      date: "2025-06-18",
      title: "Thesis Defense - John Doe",
      type: "defense",
      guide: "Dr. Smith"
    },
    {
      date: "2025-06-18",
      title: "Budget Planning Session",
      type: "meeting",
      guide: "Admin"
    },
    {
      date: "2025-06-20",
      title: "Monthly Report Submission",
      type: "deadline",
      guide: "All Guides"
    },
    {
      date: "2025-06-21",
      title: "Faculty Development Workshop",
      type: "workshop",
      guide: "All"
    },
    {
      date: "2025-06-22",
      title: "Student Grievance Meeting",
      type: "meeting",
      guide: "All"
    }
  ]

  const formattedEvents = events.reduce((acc, event) => {
    const key = event.date
    if (!acc[key]) acc[key] = []
    acc[key].push(event)
    return acc
  }, {})

  const weekDates = getCurrentWeekDates(currentDate)
  const monthDates = getMonthDates(currentDate)
  const displayDates = mode === "week" ? weekDates : monthDates

  const navigate = (dir) => {
    const step = mode === "week" ? 1 : 1
    const newDate =
      dir === "prev"
        ? mode === "week"
          ? subWeeks(currentDate, step)
          : addDays(currentDate, -30)
        : mode === "week"
        ? addWeeks(currentDate, step)
        : addDays(currentDate, 30)
    setCurrentDate(newDate)
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const getEventTypeBadge = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-purple-100 text-purple-800"
      case "event":
        return "bg-green-100 text-green-800"
      case "defense":
        return "bg-red-100 text-red-800"
      case "deadline":
        return "bg-orange-100 text-orange-800"
      case "workshop":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 font-[Marcellus]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Department Schedule
        </h1>
        <p className="text-gray-600">
          View and manage department-wide events and meetings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold">
                {
                  events.filter((e) => {
                    const eventDate = new Date(e.date)
                    return weekDates.some(
                      (d) => format(d, "yyyy-MM-dd") === format(eventDate, "yyyy-MM-dd")
                    )
                  }).length
                }
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-[#B7202E]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold">
                {
                  events.filter((e) => new Date(e.date) > new Date()).length
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Calendar View</h2>
            <div className="flex gap-2">
              <Button
                className="cursor-pointer"
                variant={mode === "week" ? "default" : "outline"}
                onClick={() => setMode("week")}
              >
                Week
              </Button>
              <Button
                className="cursor-pointer"
                variant={mode === "month" ? "default" : "outline"}
                onClick={() => setMode("month")}
              >
                Month
              </Button>
              <Button
                className="cursor-pointer bg-[#B7202E] hover:bg-[#911C27] text-white"
                disabled
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center mb-4 gap-4">
            <Button
              className="cursor-pointer bg-[#B7202E] hover:bg-[#911C27]"
              size="icon"
              onClick={() => navigate("prev")}
            >
              ←
            </Button>
            <h3 className="text-xl font-medium w-1/5 text-center">
              {mode === "week"
                ? `${format(weekDates[0], "MMM d")} - ${format(
                    weekDates[6],
                    "MMM d, yyyy"
                  )}`
                : format(currentDate, "MMMM yyyy")}
            </h3>
            <Button
              className="cursor-pointer bg-[#B7202E] hover:bg-[#911C27]"
              size="icon"
              onClick={() => navigate("next")}
            >
              →
            </Button>
          </div>

          {/* Calendar Grid */}
          <div
            className={`grid ${
              mode === "week" ? "grid-cols-7" : "grid-cols-7"
            } border text-[16px]`}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="border p-2 text-center font-semibold bg-muted"
              >
                {day}
              </div>
            ))}

            {displayDates.map((date, index) => {
              const dayEvents =
                formattedEvents[format(date, "yyyy-MM-dd")] || []
              const showDate = format(date, "d")

              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div
                      className={`border p-2 h-32 cursor-pointer hover:bg-gray-50 transition-colors ${
                        mode === "month" &&
                        format(date, "M") !== format(currentDate, "M")
                          ? "bg-gray-100 text-gray-400"
                          : ""
                      }`}
                      onClick={() => handleDateClick(date)}
                    >
                      <div className="font-semibold mb-1">{showDate}</div>
                      <div className="space-y-1 overflow-y-auto max-h-20">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={`text-xs p-1 rounded text-white truncate ${
                              colorClasses[i % colorClasses.length]
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-600 font-semibold">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="font-[Marcellus]">
                    <div>
                      <h3 className="text-xl font-bold mb-4">
                        {format(date, "MMMM d, yyyy")}
                      </h3>
                      {dayEvents.length === 0 ? (
                        <p className="text-gray-500">No events scheduled</p>
                      ) : (
                        <div className="space-y-3">
                          {dayEvents.map((event, i) => (
                            <Card key={i} className="border-l-4 border-l-[#B7202E]">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {event.title}
                                  </h4>
                                  <Badge
                                    className={getEventTypeBadge(event.type)}
                                  >
                                    {event.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users className="h-4 w-4" />
                                  <span>{event.guide}</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events List */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events
              .filter((e) => new Date(e.date) >= new Date())
              .slice(0, 5)
              .map((event, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">
                        {event.title}
                      </h4>
                      <Badge className={getEventTypeBadge(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(event.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.guide}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
