export default function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm mb-4">
      <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
