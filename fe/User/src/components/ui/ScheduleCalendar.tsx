import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = [
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

const ScheduleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const monthRef = useRef<HTMLDivElement | null>(null);
  const yearRef = useRef<HTMLDivElement | null>(null);
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // 👉 close dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!monthRef.current?.contains(e.target)) setOpenMonth(false);
      if (!yearRef.current?.contains(e.target)) setOpenYear(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 👉 tính calendar
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // 👉 change month/year
  const handleMonthChange = (m: any) => {
    setCurrentDate(new Date(year, m, 1));
  };

  const handleYearChange = (y: any) => {
    setCurrentDate(new Date(y, month, 1));
  };

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  const years = Array.from({ length: 12 }, (_, i) => year - 6 + i);

  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <Calendar size={20} />

          {/* MONTH */}
          <div className="relative" ref={monthRef}>
            <button
              onClick={() => setOpenMonth(!openMonth)}
              className="px-3 py-1.5 border border-outline-variant rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              {months[month]}
            </button>

            {openMonth && (
              <div className="absolute mt-2 w-40 bg-white border border-outline-variant rounded-lg shadow z-20">
                {months.map((m, i) => (
                  <div
                    key={m}
                    onClick={() => {
                      handleMonthChange(i);
                      setOpenMonth(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
                    ${i === month && "bg-gray-100 font-semibold"}`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* YEAR */}
          <div className="relative" ref={yearRef}>
            <button
              onClick={() => setOpenYear(!openYear)}
              className="px-3 py-1.5 border border-outline-variant rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              {year}
            </button>

            {openYear && (
              <div className="absolute mt-2 w-24 max-h-60 overflow-y-auto bg-white border border-outline-variant rounded-lg shadow z-20">
                {years.map((y) => (
                  <div
                    key={y}
                    onClick={() => {
                      handleYearChange(y);
                      setOpenYear(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
                    ${y === year && "bg-gray-100 font-semibold"}`}
                  >
                    {y}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 border border-outline-variant rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 border border-outline-variant rounded-lg hover:bg-gray-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-400">
        {days.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const isSelected = selectedDate === day;

          return (
            <div
              key={index}
              onClick={() => day && setSelectedDate(day)}
              className={`h-12 flex items-center justify-center rounded-lg text-sm
                ${!day && "invisible"}
                ${
                  isSelected
                    ? "bg-black text-white font-semibold"
                    : "hover:bg-gray-100 cursor-pointer"
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
