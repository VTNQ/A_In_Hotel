const StatCard = ({ icon, label, value, color }: any) => (
  <div
    className="bg-white dark:bg-[#1F2937] 
    dark:border dark:border-gray-700
    p-5 rounded-xl shadow transition-colors"
  >
    <div
      className="flex items-center gap-2 
      text-sm text-gray-500 dark:text-gray-400 mb-1"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>

    <p className={`text-2xl font-bold ${color}`}>
      {value}
    </p>
  </div>
);

export default StatCard;