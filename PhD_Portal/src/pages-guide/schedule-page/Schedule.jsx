import React, { useState } from "react";
import { format, startOfWeek, addDays, subWeeks, addWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useRequireAuth from "../../hooks/useRequireAuth";

const getCurrentWeekDates = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

const getMonthDates = (date) => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = endOfMonth(date);
  const totalDays = eachDayOfInterval({ start, end: addDays(end, 6 - (end.getDay() % 7)) });
  return totalDays;
};

const colorClasses = [
  "bg-blue-400",
  "bg-green-400",
  "bg-orange-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-yellow-400"
];

export default function Schedule() {
  useRequireAuth(["guide", "admin"]);

  const [mode, setMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample events data
  
  const events = [
    { date: "2025-06-16", title: "Check progress of students" },
    { date: "2025-06-17", title: "Surprise test" },
    { date: "2025-06-17", title: "Check papers" },
    { date: "2025-06-18", title: "Assignment 1 Deadline" },
    { date: "2025-06-18", title: "Review Meeting" },
    { date: "2025-06-18", title: "Surprise Test" },
    { date: "2025-06-18", title: "Research Sync" },
    { date: "2025-06-20", title: "Assignment 2 Deadline" }
  ];

  const formattedEvents = events.reduce((acc, event) => {
    const key = event.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  const weekDates = getCurrentWeekDates(currentDate);
  const monthDates = getMonthDates(currentDate);
  const displayDates = mode === "week" ? weekDates : monthDates;

  const navigate = (dir) => {
    const step = mode === "week" ? 1 : 1;
    const newDate = dir === "prev"
      ? mode === "week" ? subWeeks(currentDate, step) : addDays(currentDate, -30)
      : mode === "week" ? addWeeks(currentDate, step) : addDays(currentDate, 30);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">My Schedule</h2>
        <div className="flex gap-2">
          <Button className="cursor-pointer" variant={mode === "week" ? "default" : "outline"} onClick={() => setMode("week")}>Week</Button>
          <Button className="cursor-pointer" variant={mode === "month" ? "default" : "outline"} onClick={() => setMode("month")}>Month</Button>
          <Button className="cursor-pointer" variant="secondary">+ Add</Button>
        </div>
      </div>

      <div className="flex items-center justify-center mb-4 gap-4">
        <Button className="cursor-pointer bg-[#B7202E] hover:bg-[#911C27]" size="icon" onClick={() => navigate("prev")}>←</Button>
        <h3 className="text-xl font-medium w-1/5 text-center">
          {mode === "week"
            ? `${format(weekDates[0], "MMM d")} - ${format(weekDates[6], "MMM d, yyyy")}`
            : format(currentDate, "MMMM yyyy")}
        </h3>
        <Button className="cursor-pointer bg-[#B7202E] hover:bg-[#911C27]" size="icon" onClick={() => navigate("next")}>→</Button>
      </div>

      {/* Calendar Grid */}
      <div className={`grid ${mode === "week" ? "grid-cols-7" : "grid-cols-7"} border text-[16px]`}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="border p-2 text-center font-semibold bg-muted">
            {day}
          </div>
        ))}

        {displayDates.map((date, index) => {
          const dayEvents = formattedEvents[format(date, "yyyy-MM-dd")] || [];
          const showDate = format(date, "d");

          return (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div
                  onClick={() => handleDateClick(date)}
                  className={`border h-[180px] p-1 cursor-pointer overflow-hidden relative ${
                    mode === "month" && !isSameMonth(date, currentDate) ? "bg-muted text-muted-foreground" : ""
                  } hover:bg-accent`}
                >
                  <div className="text-sm font-medium">{showDate}</div>

                  {/* Render Events */}
                  {mode === "week" && (
                    <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map((event, i) => (
                            <div
                            key={i}
                            className={`rounded px-1 py-0.5 text-white truncate ${colorClasses[i % colorClasses.length]}`}
                            >
                            {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 2 && (
                            <div className="text-xs text-blue-600 font-medium">
                            +{dayEvents.length - 2} more
                            </div>
                        )}
                    </div>
                  )}

                  {mode === "month" && (
                    <div className="mt-1 space-y-0.5 text-sm">
                      {dayEvents.slice(0, 2).map((event, i) => (
                        <div
                          key={i}
                          className={`rounded px-1 py-0.5 text-white truncate ${colorClasses[i % colorClasses.length]}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-blue-600 font-medium">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </DialogTrigger>

              {/* Dialog Popup for that day */}
              <DialogContent className="w-[400px]">
                <h2 className="text-xl font-semibold mb-2">
                  Events on {format(date, "MMM d, yyyy")}
                </h2>
                <ul className="space-y-2">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((e, i) => (
                      <li key={i} className={`p-2 rounded text-white ${colorClasses[i % colorClasses.length]}`}>
                        {e.title}
                      </li>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No events scheduled.</p>
                  )}
                </ul>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
