import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface ActionMenuProps {
  title?: string;
  actions: ActionItem[];
}

const ActionMenu: React.FC<ActionMenuProps> = ({ title, actions }) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX - 120,
    });
    setOpen(!open);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!btnRef.current?.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="p-1 rounded hover:bg-gray-100 transition"
      >
        <MoreVertical size={16} />
      </button>

      {open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[99999] bg-white border border-gray-200 shadow-lg rounded-xl p-2 w-44"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              {title && (
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {title}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {actions.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => {
                      if (!a.disabled) a.onClick?.();
                      setOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                      a.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : a.danger
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {a.icon}
                    {a.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default ActionMenu;
