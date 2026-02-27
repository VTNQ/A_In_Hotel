import type { CalendarRangeProps } from "@/type/booking.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Month from "./Month";
import { isBefore, startOfToday } from "date-fns";

const CalendarRange = ({ value, onChange }: CalendarRangeProps) => {
  const { t } = useTranslation();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [baseMonth, setBaseMonth] = useState(
    new Date(today.getFullYear(), today.getMonth()),
  );
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
 return (
  <div className="bg-white rounded-xl p-3 sm:p-4">
    {/* HEADER */}
    <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
      <h3 className="font-semibold">
        {t("bookingDateTime.selectDates")}
      </h3>

      <div className="flex items-center gap-3">
        {nights > 0 && (
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
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

    {/* MONTH NAVIGATION */}
    <div className="flex justify-between items-center mb-4">
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
        className="disabled:opacity-30"
      >
        <ChevronLeft />
      </button>

      {/* MOBILE TITLE */}
      <div className="sm:hidden text-sm font-medium text-center">
        {baseMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* DESKTOP TITLES */}
      <div className="hidden sm:flex gap-24 font-medium text-sm">
        <span>
          {baseMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <span>
          {new Date(
            baseMonth.getFullYear(),
            baseMonth.getMonth() + 1,
          ).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <button
        onClick={() =>
          setBaseMonth(
            new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1),
          )
        }
      >
        <ChevronRight />
      </button>
    </div>

    {/* CALENDARS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
      <Month
        month={baseMonth}
        value={value}
        onSelect={handleSelect}
        isSame={isSame}
        isInRange={isInRange}
        isDisabled={isBeforeToday}
      />

      {/* Desktop only second month */}
      <div className="hidden sm:block">
        <Month
          month={new Date(
            baseMonth.getFullYear(),
            baseMonth.getMonth() + 1,
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
