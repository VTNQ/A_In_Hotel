import { useEffect, useRef, useState } from "react";
import type { SelectProps } from "../../type";
import { ChevronDown } from "lucide-react";

const Select = ({
  label,
  value,
  options,
  placeholder = "Select option",
  disabled,
  onChange,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col relative" ref={ref}>
      {label && (
        <label className="text-sm text-[#253150] mb-1">{label}</label>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`
          flex items-center justify-between border border-[#42578E]
          rounded-lg px-3 py-2 bg-white outline-none
          ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "focus:ring-2 focus:ring-[#536DB2]"}
        `}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-[#42578E] rounded-lg shadow-lg">
          {options.map((o) => {
            const isSelected = o.value === value;
            const isDisabled = o.disabled;

            return (
              <div
                key={o.value}
                title={isDisabled ? o.description : undefined}
                onClick={() => {
                  if (isDisabled) return;
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`
                  px-3 py-2 text-sm flex justify-between items-center
                  ${
                    isDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "cursor-pointer hover:bg-[#536DB2] hover:text-white"
                  }
                  ${isSelected && !isDisabled ? "bg-[#536DB2] text-white" : ""}
                `}
              >
                <span>{o.label}</span>

                {isDisabled && o.description && (
                  <span className="text-xs italic text-gray-400 ml-2">
                    {o.description}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
