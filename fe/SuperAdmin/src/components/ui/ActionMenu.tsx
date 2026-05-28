import type { ActionMenuProps } from "@/type/common";

import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const ActionMenu: React.FC<ActionMenuProps> = ({ title, actions }) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const toggle = () => {
    if (!btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const menuWidth = 176; // w-44 = 176px
    const menuHeight = 180; // ước lượng, hoặc bạn chỉnh theo UI

    // Tính vị trí default (menu bên dưới)
    let top = rect.bottom + 6;
    let left = rect.left - menuWidth + 40;

    // Nếu menu tràn xuống dưới màn hình → flip lên
    if (top + menuHeight > window.innerHeight) {
      top = rect.top - menuHeight - 6; // đặt lên trên
    }

    // Nếu menu tràn trái → đẩy sang phải
    if (left < 0) {
      left = rect.right + 6;
    }

    setMenuPos({ top, left });
    setOpen(!open);
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!btnRef.current?.contains(e.target as Node)) setOpen(false);
    };

    const handleScroll = () => setOpen(false);
    const handleResize = () => setOpen(false);

    if (open) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="
        rounded-lg p-1.5 transition
        text-gray-600
        hover:bg-gray-100
        dark:text-neutral-300
        dark:hover:bg-neutral-800
        "
      >
        <MoreHorizontal size={16} />
      </button>
      {open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[2147483647]
              w-44 rounded-xl p-2
              bg-white shadow-xl 
              border border-gray-200
              dark:border-neutral-700
              dark:bg-neutral-900"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              {title && (
                <p className="mb-2 text-sm font-semibold 
                text-gray-700  dark:text-white">
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
                    className={`
                      flex items-center gap-2 px-3 py-2 text-sm rounded-md 
                      transition
                      ${a.disabled
                        ? "text-gray-400 dark:text-neutral-600 cursor-not-allowed"
                        : a.danger
                          ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          : "text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {a.icon}
                    {a.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
export default ActionMenu;
