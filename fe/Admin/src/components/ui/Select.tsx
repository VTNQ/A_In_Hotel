import { useEffect, useRef, useState } from "react";
import type { SelectProps } from "../../type";
import { ChevronDown } from "lucide-react";

const Select = ({
    label,
    value,
    options,
    placeholder = "Select option",
    onChange
}: SelectProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find(o => o.value === value);

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

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center justify-between border border-[#42578E] rounded-lg px-3 py-2 bg-white
                   focus:ring-2 focus:ring-[#536DB2] outline-none"
            >
                <span className={selected ? "text-gray-800" : "text-gray-400"}>
                    {selected?.label || placeholder}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {open && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-[#42578E] rounded-lg 
                shadow-lg">
                    {options.map((o) => (
                        <div
                            key={o.value}
                            onClick={() => {
                                onChange(o.value)
                                setOpen(false)
                            }}
                            className={`px-3 py-2 cursor-pointer hover:bg-[#536DB2]
                            ${o.value === value ?
                                    "bg-[#536DB2] text-white" :
                                    ""}`}
                        >
                            {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Select;