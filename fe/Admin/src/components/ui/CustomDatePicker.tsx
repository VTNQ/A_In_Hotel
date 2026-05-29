import { useState, useRef, useEffect } from "react";
import { Portal } from "./Portal";
import type { CustomDatePickerProps } from "../../type";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
}: CustomDatePickerProps) {
  const normalizeDate = (d: Date) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  const today = normalizeDate(new Date());
  const min = minDate ? normalizeDate(minDate) : null;

  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [year, setYear] = useState(value?.getFullYear() ?? today.getFullYear());

  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  const inputRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        inputRef.current &&
        popupRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        !popupRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fixed popup height để tránh lệch UI
  const POPUP_HEIGHT = 360;
  const GAP = 8;

  // Position popup
  const computePosition = () => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();
    const screenHeight = window.innerHeight;

    const openUp = screenHeight - rect.bottom < POPUP_HEIGHT + GAP;

    setPopupPos({
      top: openUp ? rect.top - POPUP_HEIGHT - GAP : rect.bottom + GAP,
      left: rect.left,
    });
  };

  // Calendar logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const selectDay = (day: number) => {
    const d = normalizeDate(new Date(year, month, day));

    if (min && d < min) return;

    d.setHours(12, 0, 0, 0);

    onChange(d);
    setIsOpen(false);
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <>
      {/* INPUT FIELD */}
      <div
        ref={inputRef}
        onClick={() => {
          computePosition();
          setIsOpen(!isOpen);
        }}
        className="
          border border-gray-300 dark:border-gray-600
          p-2 rounded-xl
          bg-white dark:bg-[#111827]
          text-gray-800 dark:text-gray-100
          cursor-pointer text-[15px]
          transition
        "
      >
        {value ? (
          value.toISOString().split("T")[0]
        ) : (
          <span className="text-gray-400 dark:text-gray-500">
            {placeholder}
          </span>
        )}
      </div>

      {isOpen && (
        <Portal>
          <div
            ref={popupRef}
            className="
              fixed z-[999999]
              w-[320px] h-[360px] p-5
              rounded-3xl
              bg-white dark:bg-[#111827]
              border border-gray-200 dark:border-gray-700
              shadow-[0_8px_30px_rgba(0,0,0,0.12)]
            "
            style={{ top: popupPos.top, left: popupPos.left }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="
                    text-[16px]
                    bg-transparent
                    text-gray-800 dark:text-gray-100
                    outline-none
                  "
                >
                  {monthNames.map((m, i) => (
                    <option
                      key={i}
                      value={i}
                      className="dark:bg-[#111827]"
                    >
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="
                    text-[16px]
                    bg-transparent
                    text-gray-800 dark:text-gray-100
                    outline-none
                  "
                >
                  {Array.from(
                    { length: 70 },
                    (_, i) => today.getFullYear() - i,
                  ).map((y) => (
                    <option
                      key={y}
                      value={y}
                      className="dark:bg-[#111827]"
                    >
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="
                    w-7 h-7 rounded
                    flex items-center justify-center
                    text-gray-700 dark:text-gray-200
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    transition
                  "
                >
                  ❮
                </button>

                <button
                  onClick={nextMonth}
                  className="
                    w-7 h-7 rounded
                    flex items-center justify-center
                    text-gray-700 dark:text-gray-200
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    transition
                  "
                >
                  ❯
                </button>
              </div>
            </div>

            {/* WEEKDAYS */}
            <div
              className="
                grid grid-cols-7 text-center
                text-[14px]
                text-gray-500 dark:text-gray-400
                mb-2
              "
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* DAYS */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={i}></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;

                const d = normalizeDate(new Date(year, month, day));

                const disabled = min ? d < min : false;

                const selected =
                  value &&
                  normalizeDate(value).getTime() === d.getTime();

                return (
                  <div
                    key={day}
                    onClick={() => !disabled && selectDay(day)}
                    className={`
                      h-10 w-10 flex items-center justify-center rounded-lg
                      text-[15px] transition
                      ${
                        selected
                          ? "bg-[#42578E] text-white"
                          : disabled
                            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-purple-100 dark:hover:bg-[#1F2937]"
                      }
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}