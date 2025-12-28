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

    const selected = options.find(o => o.value === value);

    // 🔍 filter theo keyword
    const filteredOptions = useMemo(() => {
        if (!keyword) return options;
        return options.filter(o =>
            o.label.toLowerCase().includes(keyword.toLowerCase())
        );
    }, [keyword, options]);

    // ⌨️ gõ phím search ngay trong select
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                setKeyword(prev => prev.slice(0, -1));
                return;
            }

            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                setKeyword(prev => prev + e.key);

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

    // click ngoài
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
                <label className="text-xs font-medium text-gray-500">
                    {label}
                </label>
            )}

            {/* ===== SELECT BUTTON (SEARCH NGAY TẠI ĐÂY) ===== */}
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={`
          flex items-center justify-between
          rounded-xl border px-3 py-2.5 text-sm
          bg-white transition
          ${open
                        ? "border-[#0E5E6F] ring-2 ring-[#0E5E6F]/20"
                        : "border-gray-300"}
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
                                    ? "text-gray-900"
                                    : "text-gray-400"
                        }
                    >
                        {displayText}
                        {open && keyword && (
                            <span className="animate-pulse ml-0.5">|</span>
                        )}
                    </span>
                </div>

                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* ===== DROPDOWN ===== */}
            {open && (
                <div
                    className="
      absolute top-full left-0 z-50
      mt-2 w-full
      rounded-xl border border-gray-200
      bg-white shadow-xl overflow-hidden
    "
                >
                    <div className="max-h-56 overflow-auto">
                        {filteredOptions.length === 0 && (
                            <div className="px-3 py-3 text-sm text-gray-400">
                                No results
                            </div>
                        )}

                        {filteredOptions.map(o => {
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
              hover:bg-[#EFF9F8]
              ${active ? "bg-[#EFF9F8] font-medium" : ""}
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
