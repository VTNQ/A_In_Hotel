

const Toggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="text-sm font-medium text-[#253150] dark:text-slate-100">{label}</p>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8EEFF]
          dark:focus:ring-[#42578E]/40
          ${checked ? "bg-[#3B5CCC] dark:bg-[#5B7FFF]" : "bg-slate-300 dark:bg-slate-600"}
        `}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform
            ${checked ? "translate-x-5" : ""}
            dark:bg-slate-100
          `}
        />
      </button>
    </div>
  );
};
export default Toggle;