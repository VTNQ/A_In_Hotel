import { Check } from "lucide-react";

const times = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const TimePicker = ({ title, value, onChange }:any) => {
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-4">

      <label className="text-xs uppercase tracking-[0.1em] text-gray-400">
        {title}
      </label>

      <div className="grid grid-cols-2 gap-2">
        {times.map((t) => {
          const active = t === value;

          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`py-3 px-4 rounded-lg flex justify-between items-center text-sm transition
              ${
                active
                  ? "bg-black text-white border-2 border-black"
                  : "border border-outline-variant hover:border-black"
              }`}
            >
              {t}
              <Check
                size={16}
                className={`transition-opacity duration-200 ${
                    active ? "opacity-100" :"opacity-0"
                }`}
                />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimePicker;