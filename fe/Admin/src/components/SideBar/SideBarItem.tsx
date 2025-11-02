import { ChevronDown } from "lucide-react";
import { useState } from "react"
import type { MenuItem } from "../../type";

const SideBarItem = ({ item }: { item: MenuItem }) => {
    const [open, setOpen] = useState(false);
    const Icon = item.icon;
    return (
        <div>
            <button
                onClick={() => item.children && setOpen(!open)}
                className={`flex justify-between items-center w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#1C2844] rounded-md transition`}
            >
                <span className="flex items-center gap-3">
                    {Icon && <Icon size={18} />}
                    {item.label}
                </span>
                {item.children && (
                    <ChevronDown
                        size={16}
                        className={`transition-transform ${open ? "rotate-180" : ""}`}
                    />
                )}
            </button>
            {open && item.children && (
                <div className="ml-8 mt-1 space-y-1">
                    {item.children?.map((child: MenuItem, idx: number) => (
                        <button
                            key={idx}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#2A3A63] hover:text-white rounded-md"
                        >
                            {child.label}
                        </button>
                    ))}

                </div>
            )}
        </div>
    )
}
export default SideBarItem;