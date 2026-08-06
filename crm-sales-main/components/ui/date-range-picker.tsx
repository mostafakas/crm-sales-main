"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  date?: DateRange;
  setDate?: (date?: DateRange) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({ 
  date, 
  setDate, 
  placeholder = "dd/mm/yyyy - dd/mm/yyyy", 
  className 
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id="date"
              variant={"ghost"}
              className={cn(
                "w-full h-[40px] px-[16px] justify-between text-left font-bold bg-[#edf2f7] hover:bg-[#e2e8f0] rounded-[8px] border-none text-[12px] font-janna shadow-none",
                !date && "text-[#707070]",
                date && "text-[#343434]"
              )}
            >
              <div className="flex items-center gap-2">
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(date.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>{placeholder}</span>
                )}
              </div>
              <CalendarIcon className="size-[12px] text-[#707070]" strokeWidth={3} />
            </Button>
          }
        />
        <PopoverContent 
          className="w-auto p-0 border-none bg-transparent shadow-none" 
          align="start"
          sideOffset={4}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
