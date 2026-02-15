const BookingPlatformToolTip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const percent = ((data.value / data.payload.total) * 100).toFixed(1);

  return (
    <div className="bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: data.color }}
        />
        <span className="text-sm font-medium text-gray-700">
          {data.name}
        </span>
      </div>

      <div className="text-base font-semibold text-gray-900">
        {data.value.toLocaleString()} bookings
      </div>

      <div className="text-xs text-gray-400 mt-1">
        {percent}% of total
      </div>
    </div>
  );
};
export default BookingPlatformToolTip;