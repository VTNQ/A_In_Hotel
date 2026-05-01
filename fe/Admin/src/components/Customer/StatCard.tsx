const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);
export default StatCard;