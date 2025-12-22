const Month = ({
  month,
  value,
  onSelect,
  isSame,
  isInRange,
}: any) => {
  const year = month.getFullYear();
  const m = month.getMonth();
  const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

  const firstDay = new Date(year, m, 1).getDay();
  const totalDays = new Date(year, m + 1, 0).getDate();

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++)
    days.push(new Date(year, m, d));

  return (
    <div>
      {/* Week days */}
      <div className="grid grid-cols-7 text-xs text-gray-400 mb-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) =>
          d ? (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className={`h-9 text-sm rounded-full flex items-center justify-center
                ${
                  isSame(value.start, d) ||
                  isSame(value.end, d)
                    ? "bg-blue-600 text-white"
                    : isInRange(d)
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
            >
              {d.getDate()}
            </button>
          ) : (
            <div key={i} />
          )
        )}
      </div>
    </div>
  );
};
export default Month;