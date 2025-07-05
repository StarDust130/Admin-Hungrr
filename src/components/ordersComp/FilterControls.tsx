import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimeRange } from "./types";


interface FilterControlsProps {
  timeRange: TimeRange | undefined;
  date: Date | undefined;
  onTimeRangeChange: (range: TimeRange) => void;
  onDateChange: (date: Date | undefined) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  timeRange,
  date,
  onTimeRangeChange,
  onDateChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and review all your cafe&apos;s orders.
        </p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          {(["today", "week", "month"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "ghost"}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
            >
              <span className="capitalize">{range}</span>
            </Button>
          ))}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
