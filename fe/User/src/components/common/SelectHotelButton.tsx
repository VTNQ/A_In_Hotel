import { MapPin } from "lucide-react";
import type { SelectHotelButtonProps } from "../../type/common";
import { useState } from "react";

const SelectHotelButton = ({
    hotels,
    value,
    onChange,
    placeholder = "Select hotel",
}: SelectHotelButtonProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full h-[56px] bg-white border border-[#866F56]
                   outline-none rounded-xl px-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-3 min-w-0">
                    <MapPin size={18} className="text-gray-500 shrink-0" />
                    <span className="font-medium text-sm text-gray-800 truncate">
                        {value?.name || placeholder}
                    </span>
                </div>

                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {open && (
                <div
                    className="absolute left-0 right-0 mt-2 bg-white border rounded-xl
                     shadow-lg z-50 overflow-hidden"
                >
                    {hotels.map((h) => {
                        const isSelected = value?.id === h.id;

                        return (
                            <button
                                key={h.id}
                                type="button"
                                onClick={() => {
                                    onChange(h);
                                    setOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 transition
                  ${isSelected ? "bg-[#F6F3F0]" : "hover:bg-gray-100"}
                `}
                            >
                                <div className="font-medium text-sm text-gray-800">
                                    {h.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {h.address}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    )

}
export default SelectHotelButton;