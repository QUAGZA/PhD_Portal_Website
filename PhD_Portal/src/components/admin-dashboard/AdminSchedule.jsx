import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight, Clock, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export function AdminSchedule({ events }) {
  // Show only first 3 events in dashboard
  const displayEvents = events?.slice(0, 3) || []

  const getEventTypeColor = (type) => {
    const colors = {
      Meeting: "bg-blue-100 text-blue-800",
      Defense: "bg-green-100 text-green-800",
      Review: "bg-orange-100 text-orange-800",
      Committee: "bg-purple-100 text-purple-800"
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="shadow-md border-gray-200">
      <CardHeader className="bg-white border-b border-gray-200 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#B7202E]" />
            Upcoming Schedule
          </CardTitle>
          <div className="flex items-center gap-2">
            {events && events.length > 3 && (
              <Link
                to="/admin/schedule"
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                View All
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 font-medium">No Scheduled Events</p>
              <p className="text-xs text-gray-400 mt-1">Events will appear here</p>
            </div>
          ) : (
            displayEvents.map((event) => (
              <div
                key={event._id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                  <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
