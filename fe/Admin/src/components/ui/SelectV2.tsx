import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Option = {
  value: number | string;
  label: string;
};

type SelectProps = {
  label?: string;
  iconSrc?: string;
  value?: number | string;
  options: Option[];
  placeholder?: string;
  onChange: (value: number | string) => void;
};

const SelectV2 = ({
  label,
  iconSrc,
  value,
  options,
  placeholder = "Select option",
  onChange,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

  const selected = options.find((o) => o.value === value);

  const filteredOptions = useMemo(() => {
    if (!keyword) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [keyword, options]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        setKeyword((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setKeyword((prev) => prev + e.key);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setKeyword("");
        }, 800);
      }

      if (e.key === "Escape") {
        setOpen(false);
        setKeyword("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutRef.current);
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setKeyword("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayText = open
    ? keyword || selected?.label || placeholder
    : selected?.label || placeholder;

  return (
    <div ref={ref} className="relative flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}

      {/* ===== SELECT BUTTON ===== */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          flex items-center justify-between
          rounded-xl border px-3 py-2.5 text-sm
          bg-white dark:bg-gray-900
          transition
          ${
            open
              ? "border-[#0E5E6F] ring-2 ring-[#0E5E6F]/20"
              : "border-gray-300 dark:border-gray-700"
          }
        `}
      >
        <div className="flex items-center gap-2 truncate">
          {iconSrc && selected && !keyword && (
            <img src={iconSrc} className="w-4 h-4" />
          )}

          <span
            className={
              open
                ? "text-[#0E5E6F] font-medium"
                : selected
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            }
          >
            {displayText}
            {open && keyword && (
              <span className="animate-pulse ml-0.5 text-gray-400">|</span>
            )}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ===== DROPDOWN ===== */}
      {open && (
        <div
          className="
            absolute top-full left-0 mt-2 w-full
            rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900
            shadow-xl
            overflow-hidden
            z-[1000]
          "
        >
          <div className="max-h-56 overflow-auto">

            {filteredOptions.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-400 dark:text-gray-500">
                No results
              </div>
            )}

            {filteredOptions.map((o) => {
              const active = o.value === value;

              return (
                <div
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setKeyword("");
                  }}
                  className={`
                    flex items-center justify-between
                    px-3 py-2 text-sm cursor-pointer
                    transition
                    hover:bg-[#EFF9F8] dark:hover:bg-gray-800
                    ${
                      active
                        ? "bg-[#EFF9F8] dark:bg-gray-800 font-medium"
                        : "text-gray-700 dark:text-gray-200"
                    }
                  `}
                >
                  <span>{o.label}</span>

                  {active && (
                    <Check className="w-4 h-4 text-[#0E5E6F]" />
                  )}
                </div>
              );
            })}

          </div>
        </div>
      )}
    </div>
  );
};

export default SelectV2;