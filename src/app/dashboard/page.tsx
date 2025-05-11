"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PenToolIcon as Tool,
  ClipboardCheck,
  WrenchIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
} from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Record } from "@/interfaces/record";

// Type definitions based on your actual data structure
type ScheduleType = "MAINTENANCE" | "INSPECTION" | "CORRECTIVE";

interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Schedule {
  id: string;
  asset_id: string;
  date: string; // ISO string timestamp
  type: ScheduleType;
  notes?: string;
  created_at: string;
  updated_at: string;
  asset: Asset;
  Record: Record[]; // Adjust this type as needed
}

// Type colors
const typeColors = {
  MAINTENANCE: "bg-amber-100 text-amber-800 border-amber-300",
  INSPECTION: "bg-blue-100 text-blue-800 border-blue-300",
  CORRECTIVE: "bg-rose-100 text-rose-800 border-rose-300",
};

// Type icons
const typeIcons = {
  MAINTENANCE: <Tool className="h-3 w-3 mr-1" />,
  INSPECTION: <ClipboardCheck className="h-3 w-3 mr-1" />,
  CORRECTIVE: <WrenchIcon className="h-3 w-3 mr-1" />,
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch schedules when the month changes
  useEffect(() => {
    const getSchedules = async () => {
      setLoading(true);
      try {
        // Replace this with your actual API call
        const res = await fetch("/api/schedule");
        const data = await res.json();

        setSchedules(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    getSchedules();
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create array of week rows with day cells
  const weeks: Date[][] = [];
  let days: Date[] = [];

  // Get the day of the week for the first day of the month (0-6)
  const startDay = monthStart.getDay();

  // Add empty cells for days before the first of the month
  for (let i = 0; i < startDay; i++) {
    days.push(new Date(0)); // placeholder for empty cells
  }

  // Add all days of the month
  daysInMonth.forEach((day) => {
    days.push(day);
    if (days.length === 7) {
      weeks.push(days);
      days = [];
    }
  });

  // Add empty cells for days after the last day of the month
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(new Date(0)); // placeholder for empty cells
    }
    weeks.push(days);
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Get schedules for a specific day
  const getSchedulesForDay = (day: Date) => {
    return schedules.filter((schedule) => {
      const scheduleDate = parseISO(schedule.date);
      return isSameDay(scheduleDate, day);
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">Asset Schedule Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-bold px-4">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm">Maintenance</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Inspection</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
              <span className="text-sm">Corrective</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-[500px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}

              {weeks.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  const isValidDay = day.getTime() !== 0;
                  const isCurrentMonth =
                    isValidDay && isSameMonth(day, currentMonth);
                  const daySchedules = isValidDay
                    ? getSchedulesForDay(day)
                    : [];
                  const hasSchedules = daySchedules.length > 0;

                  return (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`
                        min-h-[100px] border rounded-md p-2 relative
                        ${
                          isCurrentMonth
                            ? "bg-white"
                            : "bg-gray-50 text-gray-400"
                        }
                        ${isValidDay ? "" : "border-transparent"}
                        ${
                          hasSchedules
                            ? "ring-1 ring-offset-1 ring-gray-200"
                            : ""
                        }
                      `}
                    >
                      {isValidDay && (
                        <>
                          <div className="text-right font-medium mb-1">
                            {format(day, "d")}
                          </div>

                          {/* Schedule indicators */}
                          {hasSchedules && (
                            <div className="absolute top-1 left-1 flex space-x-1">
                              {daySchedules.some(
                                (s) => s.type === "MAINTENANCE"
                              ) && (
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                              )}
                              {daySchedules.some(
                                (s) => s.type === "INSPECTION"
                              ) && (
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              )}
                              {daySchedules.some(
                                (s) => s.type === "CORRECTIVE"
                              ) && (
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                              )}
                            </div>
                          )}

                          {/* Schedule items */}
                          <div className="space-y-1 mt-1 max-h-[70px] overflow-y-auto">
                            {daySchedules.slice(0, 2).map((schedule) => (
                              <TooltipProvider key={schedule.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`
                                        text-xs px-2 py-1 rounded-md border flex items-center truncate cursor-pointer
                                        ${typeColors[schedule.type]}
                                      `}
                                    >
                                      {typeIcons[schedule.type]}
                                      <span className="truncate">
                                        {schedule.asset.name}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-xs"
                                  >
                                    <div className="space-y-1">
                                      <p className="font-bold">
                                        {schedule.type}
                                      </p>
                                      <p className="text-sm">
                                        Asset: {schedule.asset.name}
                                      </p>
                                      <p className="text-sm">
                                        Type: {schedule.asset.type}
                                      </p>
                                      <p className="text-sm">
                                        Location: {schedule.asset.location}
                                      </p>
                                      <p className="text-sm">
                                        Notes: {schedule.notes || "No notes"}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {format(
                                          parseISO(schedule.date),
                                          "MMM d, yyyy h:mm a"
                                        )}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}

                            {/* Show indicator for more schedules */}
                            {daySchedules.length > 2 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="text-xs text-center bg-gray-100 rounded-md py-1 cursor-pointer">
                                      +{daySchedules.length - 2} more
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-xs"
                                  >
                                    <div className="space-y-2">
                                      {daySchedules.slice(2).map((schedule) => (
                                        <div
                                          key={schedule.id}
                                          className="border-b pb-1 last:border-b-0"
                                        >
                                          <p className="font-bold flex items-center">
                                            {typeIcons[schedule.type]}
                                            {schedule.type}
                                          </p>
                                          <p className="text-sm">
                                            Asset: {schedule.asset.name}
                                          </p>
                                          <p className="text-sm">
                                            Notes:{" "}
                                            {schedule.notes || "No notes"}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {format(
                                              parseISO(schedule.date),
                                              "MMM d, yyyy h:mm a"
                                            )}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
