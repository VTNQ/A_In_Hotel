import { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function SimpleDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(value ? new Date(value) : new Date());
  const ref = useRef<HTMLDivElement | null>(null);


  // Close popup when clicked outside
  useEffect(() => {
    const handler = (e:any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const month = current.getMonth();
  const year = current.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectDay = (d:any) => {
    const date = new Date(year, month, d);
    onChange(format(date, "yyyy-MM-dd"));
    setShow(false);
  };

  const prevMonth = () => {
    setCurrent(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrent(new Date(year, month + 1, 1));
  };

  return (
    <div className="relative flex-1 h-full" ref={ref}>
      {/* TRIGGER */}
      <div
        className="flex items-center justify-between w-full h-full px-3 cursor-pointer text-sm"
        onClick={() => setShow(!show)}
      >
        <span className={value ? "" : "text-gray-400"}>
          {value || "Select date"}
        </span>
        <CalendarIcon className="w-5 h-5 text-blue-500" />
      </div>

      {/* POPUP */}
      {show && (
        <div
          className="absolute top-[110%] left-0 bg-white shadow-xl rounded-xl p-4 w-64 z-50"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <button onClick={prevMonth}>⬆</button>

            <span className="font-medium">
              {current.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <button onClick={nextMonth}>⬇</button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 text-center text-gray-500 text-sm mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
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
              const isSelected = value === format(new Date(year, month, day), "yyyy-MM-dd");

              return (
                <div
                  key={day}
                  onClick={() => selectDay(day)}
                  className={`
                    h-8 flex items-center justify-center rounded cursor-pointer
                    ${isSelected ? "bg-blue-600 text-white" : "hover:bg-blue-100"}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between text-sm mt-3">
            <button
              onClick={() => onChange("")}
              className="text-blue-600 hover:underline"
            >
              Clear
            </button>

            <button
              onClick={() => onChange(format(new Date(), "yyyy-MM-dd"))}
              className="text-blue-600 hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
