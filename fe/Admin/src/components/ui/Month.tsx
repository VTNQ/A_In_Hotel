import {
  addDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const Month = ({ month, value, onSelect, isSame, isInRange,  isDisabled }: any) => {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  const days: Date[] = [];
  let current = start;

  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return (
    <div>
      {/* Week header */}
      <div className="grid grid-cols-7 mb-2 text-xs text-gray-400 text-center">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-1 text-sm">
        {days.map((day) => {
          const disabled = isDisabled(day);
          const isStart = isSame(value.start, day);
          const isEnd = isSame(value.end, day);
          const inRange = isInRange(day);
          const isCurrentMonth = day.getMonth() === month.getMonth();

          return (
            <button
              key={day.toISOString()}
              disabled={disabled}
              onClick={() => onSelect(day)}
              className={`
                h-9 w-9 mx-auto rounded-full flex items-center justify-center
                transition
                ${!isCurrentMonth ? "text-gray-300" : ""}
                ${
                  disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-100"
                }
                ${inRange ? "bg-blue-50" : ""}
                ${isStart || isEnd ? "bg-blue-500 text-white" : ""}
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default Month;
