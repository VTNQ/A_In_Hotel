export default function GuestRow({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 text-primary p-2.5 rounded-xl">{icon}</div>
      <div>
        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">{label}</p>
        <p className="font-bold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  );
}
