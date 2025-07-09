import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format, addWeeks, subWeeks, startOfWeek, addDays } from "date-fns";

// Generate schedule data for 7 days from startDate (Sunday to Saturday)
const generateWeekData = (startDate) => {
    const week = [];
    const colors = ["bg-red-300", "bg-orange-300", "bg-blue-400", "bg-pink-300", "bg-yellow-300"];

    for (let i = 0; i < 7; i++) {
        const date = addDays(startDate, i);
        week.push({
            day: format(date, "EEE"),
            date: format(date, "d"),
            label:
                i === 1 ? "Check progress of students" :
                    i === 2 ? "Surprise test" :
                        i === 3 ? "Assignment 1 Deadline" :
                            i === 5 ? "Assignment 2 Deadline" : "",
            color: colors[i] || "",
        });
    }

    return week;
};

export default function ScheduleCard() {
    // Start from the current week's Sunday
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

    const handlePrev = () => setWeekStart(prev => subWeeks(prev, 1));
    const handleNext = () => setWeekStart(prev => addWeeks(prev, 1));

    const weekData = generateWeekData(weekStart);

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg">My Schedule</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ChevronLeft className="cursor-pointer" onClick={handlePrev} />
                    <span>
                        {format(weekStart, "LLL d")} - {format(addDays(weekStart, 6), "LLL d, yyyy")}
                    </span>
                    <ChevronRight className="cursor-pointer" onClick={handleNext} />
                </div>
            </CardHeader>

            <CardContent className="grid grid-cols-7 text-center gap-1">
                {weekData.map((d, i) => (
                    <div
                        key={i}
                        className="border rounded p-1 h-[100px] flex flex-col justify-between items-center text-xs"
                    >
                        <p className="font-medium">{d.day}</p>
                        <p>{d.date}</p>
                        {d.label && (
                            <div
                                className={`text-[10px] px-1 py-0.5 rounded text-black ${d.color}`}
                            >
                                {d.label}
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
