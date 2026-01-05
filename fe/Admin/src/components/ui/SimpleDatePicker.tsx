import { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function SimpleDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(
    value ? new Date(value) : new Date()
  );
  const ref = useRef<HTMLDivElement | null>(null);

  // Close when click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weekDays =
    i18n.language.startsWith("vi")
      ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
      : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const selectDay = (day: number) => {
    const d = new Date(year, month, day);
    onChange(format(d, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* INPUT */}
      <div
        onClick={() => setOpen(!open)}
        className="
          h-[46px]
          flex items-center justify-between
          px-3
          border border-[#C2C4C5]
          rounded-lg
          bg-white
          cursor-pointer
          hover:border-blue-500
          transition
        "
      >
        <span
          className={`
            text-sm truncate
            ${value ? "text-gray-800" : "text-gray-400"}
          `}
        >
          {value || t("booking.selectDate")}
        </span>

        <CalendarIcon className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
      </div>

      {/* CALENDAR */}
      {open && (
        <div className="absolute top-[110%] left-0 z-50 w-64 bg-white rounded-xl shadow-xl p-4">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setCurrent(new Date(year, month - 1, 1))}
              className="px-2"
            >
              ‹
            </button>

            <span className="text-sm font-medium">
              {current.toLocaleString(i18n.language, {
                month: "long",
                year: "numeric",
              })}
            </span>

            <button
              onClick={() => setCurrent(new Date(year, month + 1, 1))}
              className="px-2"
            >
              ›
            </button>
          </div>

          {/* WEEK DAYS */}
          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
            {weekDays.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={i} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected =
                value ===
                format(new Date(year, month, day), "yyyy-MM-dd");

              return (
                <div
                  key={day}
                  onClick={() => selectDay(day)}
                  className={`
                    h-8 flex items-center justify-center rounded cursor-pointer text-sm
                    ${
                      selected
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-100"
                    }
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between mt-3 text-sm">
            <button
              onClick={() => onChange("")}
              className="text-blue-600 hover:underline"
            >
              {t("booking.clear")}
            </button>

            <button
              onClick={() => onChange(format(new Date(), "yyyy-MM-dd"))}
              className="text-blue-600 hover:underline"
            >
              {t("booking.today")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
