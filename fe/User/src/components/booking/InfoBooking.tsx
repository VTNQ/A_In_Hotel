const InfoBooking = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div>
    <p className="text-xs uppercase text-slate-400 font-bold flex items-center gap-2">
      {icon} {label}
    </p>
    <p className="font-semibold">{value}</p>
  </div>
);
export default InfoBooking;