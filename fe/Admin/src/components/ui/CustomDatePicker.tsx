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
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <>
      {/* Input field */}
      <div
        ref={inputRef}
        onClick={() => {
          computePosition();
          setIsOpen(!isOpen);
        }}
        className="border border-gray-300 p-2 rounded-xl bg-white cursor-pointer text-[15px]"
      >
        {value ? (
          value.toISOString().split("T")[0]
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <Portal>
          <div
            ref={popupRef}
            className="
              fixed z-[999999]
              bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]
              w-[320px] h-[360px] p-5
            "
            style={{ top: popupPos.top, left: popupPos.left }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="text-[16px] bg-transparent outline-none"
                >
                  {monthNames.map((m, i) => (
                    <option key={i} value={i}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="text-[16px] bg-transparent outline-none"
                >
                  {Array.from(
                    { length: 70 },
                    (_, i) => today.getFullYear() - i
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="w-7 h-7 rounded hover:bg-gray-200 flex items-center justify-center"
                >
                  ❮
                </button>
                <button
                  onClick={nextMonth}
                  className="w-7 h-7 rounded hover:bg-gray-200 flex items-center justify-center"
                >
                  ❯
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-gray-500 text-[14px] mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={i}></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const d = normalizeDate(new Date(year, month, day));
                const disabled = min ? d < min : false;

                return (
                  <div
                    key={day}
                    onClick={() => !disabled && selectDay(day)}
                    className={`
        h-10 w-10 flex items-center justify-center rounded-lg
        text-[15px] transition
        ${
          disabled
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-700 cursor-pointer hover:bg-purple-100"
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
