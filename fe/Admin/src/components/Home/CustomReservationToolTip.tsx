const CustomReservationToolTip = ({ active, payload, label }: any) => {
 if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
      <p className="text-sm text-gray-500 mb-2">{label}</p>

      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-medium text-gray-700">
            {item.value} Rooms
          </span>
        </div>
      ))}
    </div>
  );
};
export default CustomReservationToolTip;