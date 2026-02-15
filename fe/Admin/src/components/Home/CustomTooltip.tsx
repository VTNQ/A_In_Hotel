const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;

    return (
      <div className="bg-white px-4 py-3 rounded-2xl shadow-lg border border-gray-100">
        <p className="text-gray-400 text-sm mb-1">
          Total Revenue
        </p>
        <p className="text-[#32416B] font-semibold text-lg">
          {value.toLocaleString()} đ
        </p>
      </div>
    );
  }

  return null;
};
export default CustomTooltip;