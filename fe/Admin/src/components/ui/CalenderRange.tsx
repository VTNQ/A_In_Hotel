import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Month from "./Month";
import type { CalendarRangeProps } from "../../type/booking.types";
import { isBefore, startOfToday } from 'date-fns';

const CalendarRange = ({ value, onChange }: CalendarRangeProps) => {
  const { t } = useTranslation();

  /* =======================
     TODAY (00:00)
  ======================= */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* =======================
     BASE MONTH
  ======================= */
  const [baseMonth, setBaseMonth] = useState(
    new Date(today.getFullYear(), today.getMonth()),
  );

  /* =======================
     HELPERS
  ======================= */
  const toDateString = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;

  const isBeforeToday = (d: Date) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSame = (val?: string, d?: Date) =>
    val && d && val === toDateString(d);

  const isInRange = (d: Date) => {
    if (!value.start || !value.end) return false;
    const v = toDateString(d);
    return v > value.start && v < value.end;
  };

  /* =======================
     SELECT DATE
  ======================= */
  const handleSelect = (d: Date) => {
     if (isBefore(d, startOfToday())) return;

    const selected = toDateString(d);

  if (!value.start || value.end) {
    onChange({ start: selected, end: undefined });
    return;
  }

  if (selected < value.start) {
    onChange({ start: selected, end: undefined });
    return;
  }

  onChange({ start: value.start, end: selected });
  };

  /* =======================
     CLEAR
  ======================= */
  const clearDates = () => {
    onChange({ start: undefined, end: undefined });
  };

  /* =======================
     NIGHTS
  ======================= */
  const nights =
    value.start && value.end
      ? Math.ceil(
          (new Date(value.end).getTime() - new Date(value.start).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="w-full bg-white rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-gray-200 pb-4 mb-5">
        <h3 className="font-semibold text-gray-800">{t("bookingDateTime.selectDates")}</h3>

        <div className="flex items-center gap-3">
          {nights > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
              {t("bookingDateTime.totalNights", { count: nights })}
            </span>
          )}

          {(value.start || value.end) && (
            <button
              onClick={clearDates}
              className="text-xs text-red-500 hover:underline"
            >
              {t("bookingDateTime.clear")}
            </button>
          )}
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          disabled={
            baseMonth.getFullYear() === today.getFullYear() &&
            baseMonth.getMonth() === today.getMonth()
          }
          onClick={() =>
            setBaseMonth(
              new Date(baseMonth.getFullYear(), baseMonth.getMonth() - 1),
            )
          }
           className="disabled:opacity-30 p-2"
        >
          <ChevronLeft />
        </button>

        <div className="flex flex-col sm:flex-row sm:gap-20 text-sm font-medium text-center">
          <span>
            {baseMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
           <span className="hidden sm:block">
            {new Date(
              baseMonth.getFullYear(),
              baseMonth.getMonth() + 1
            ).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <button
          onClick={() =>
            setBaseMonth(
              new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1)
            )
          }
          className="p-2"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
        <Month
          month={baseMonth}
          value={value}
          onSelect={handleSelect}
          isSame={isSame}
          isInRange={isInRange}
          isDisabled={isBeforeToday}
        />

        <div className="hidden sm:block">
          <Month
            month={new Date(
              baseMonth.getFullYear(),
              baseMonth.getMonth() + 1
            )}
            value={value}
            onSelect={handleSelect}
            isSame={isSame}
            isInRange={isInRange}
            isDisabled={isBeforeToday}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarRange;
