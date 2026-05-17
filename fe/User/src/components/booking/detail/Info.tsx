export default function Info({ title, main, sub }: any) {
  return (
    <div>
      <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">{title}</p>
      <p className="font-bold text-slate-800 dark:text-slate-100">{main}</p>
      {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
