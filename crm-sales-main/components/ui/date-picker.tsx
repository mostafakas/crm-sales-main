"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ date, setDate, placeholder = "dd/mm/yyyy", className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"ghost"}
            className={cn(
              "w-full h-10 px-4 justify-between text-left font-bold bg-secondary hover:bg-secondary/80 rounded-[8px] border-none text-sm font-janna shadow-none",
              !date && "text-muted-foreground",
              date && "text-foreground",
              className
            )}
          >
            {date ? format(date, "dd/MM/yyyy") : placeholder}
            <CalendarIcon className="size-3 text-muted-foreground" strokeWidth={3} />
          </Button>

        }
      />
      <PopoverContent
        className="w-(--anchor-width) min-w-[238px] p-0 border-none bg-transparent shadow-none"
        align="start"
        sideOffset={4}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
