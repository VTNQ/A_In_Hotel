// components/ui/CalendarUI.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CalendarUIProps } from "../../type/common";

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: (Date | null)[] = [];

  const startOffset = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < startOffset; i++) days.push(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export default function CalendarUI({
  selectedDates = [],
  disabledDates = [],
  onSelect,
}: CalendarUIProps) {
  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [direction, setDirection] = useState<1 | -1>(1);

  const changeMonth = (dir: 1 | -1) => {
    setDirection(dir);
    setCurrent(
      new Date(current.getFullYear(), current.getMonth() + dir, 1)
    );
  };

  const nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, 1);

  const renderMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = getMonthDays(year, month);

    return (
      <div className="flex-1">
        <h3 className="text-center font-medium mb-3">
          Tháng {month + 1} {year}
        </h3>

        <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
          {WEEK_DAYS.map((d) => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (!d) return <div key={i} />;

            const value = formatDate(d);
            const selected = selectedDates.includes(value);
            const disabled = disabledDates.includes(value);

            return (
              <button
                key={value}
                disabled={disabled}
                onClick={() => onSelect(value)}
                className={`
                  h-9 w-9 mx-auto rounded-full text-sm transition
                  ${
                    selected
                      ? "border border-blue-500 text-blue-600"
                      : "hover:bg-gray-100"
                  }
                  ${disabled ? "opacity-30 cursor-not-allowed" : ""}
                `}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 overflow-hidden">
      {/* NAV */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* MONTHS WITH ANIMATION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.toISOString()}
          initial={{ x: direction === 1 ? 80 : -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === 1 ? -80 : 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex gap-6"
        >
          {renderMonth(current)}
          {renderMonth(nextMonth)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
