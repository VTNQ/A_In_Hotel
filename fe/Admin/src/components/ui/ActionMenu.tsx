import { useState } from "react";
import { Eye, Edit, Power, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ActionMenuProps } from "../../type";
const ActionMenu: React.FC<ActionMenuProps> = ({
    row,
    onView,
    onEdit,
    onActivate,
    onDeactivate,
}) => {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);
    const close = () => setOpen(false);
    const actions = row.isActive
        ? [
            { label: "View", icon: <Eye size={16} />, onClick: onView },
            { label: "Edit", icon: <Edit size={16} />, onClick: onEdit },
            { label: "Deactivate", icon: <Power size={16} />, onClick: onDeactivate },
        ]
        : [
            { label: "View", icon: <Eye size={16} />, onClick: onView },
            { label: "Edit", icon: <Edit size={16} />, onClick: onEdit },
            { label: "Activate", icon: <Power size={16} />, onClick: onActivate },
        ];

    return (
        <div className="relative inline-block text-left">
            {/* Trigger */}
            <button
                onClick={toggle}
                className="p-1 rounded hover:bg-gray-100 transition"
            >
                <MoreVertical size={16} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50"
                    >
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                            {row.isActive ? "Active" : "Inactive"}
                        </p>

                        <div className="flex flex-col gap-1">
                            {actions.map((a) => (
                                <button
                                    key={a.label}
                                    onClick={() => {
                                        a.onClick?.(row);
                                        close();
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
                                >
                                    {a.icon}
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ActionMenu;
