"use client";

import { useEffect, useState } from "react";
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
} from "date-fns";
import clsx from "clsx";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  date: string; // ISO format
  title: string;
}

export default function MonthlyCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const thisDayEvents = events.filter((event) =>
        isSameDay(new Date(event.date), day)
      );
      formattedDate = format(day, "d");

      const dayBox = (
        <div
          key={day.toString()}
          className={clsx(
            "border h-24 p-1 text-sm relative transition-colors",
            isSameMonth(day, monthStart)
              ? "bg-white"
              : "bg-gray-100 text-gray-400"
          )}
        >
          <span className="absolute top-1 left-1">{formattedDate}</span>
          {thisDayEvents.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-pointer absolute bottom-2 left-2 w-fit max-w-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{thisDayEvents[0].title}</p>
                      {thisDayEvents.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          +{thisDayEvents.length - 1} more
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <h4 className="font-semibold mb-2">Events</h4>
                <ul className="space-y-1">
                  {thisDayEvents.map((e) => (
                    <li key={e.id} className="text-sm">
                      <span className="font-medium">{e.title}</span>
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(e.date), "PPpp")}
                      </span>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          )}
        </div>
      );

      days.push(dayBox);
      day = addDays(day, 1);
    }

    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((prev) => addDays(prev, -30))}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth((prev) => addDays(prev, 30))}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 mb-2 text-center font-semibold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      {rows}
    </div>
  );
}
