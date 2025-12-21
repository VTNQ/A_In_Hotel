import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS } from "./Section";

const SideBarItem = ({
  item,
  onNavigate,
}: {
  item: any;
  onNavigate?: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isParentActive =
    item.children &&
    item.children.some((c: any) =>
      location.pathname.startsWith(c.path)
    );

  const isActive =
    item.path && location.pathname.startsWith(item.path);

  // ⭐ Auto open nếu route con đang active
  useEffect(() => {
    if (isParentActive) {
      setOpen(true);
    }
  }, [isParentActive]);

  const handleClick = () => {
    if (item.children) {
      setOpen((prev) => !prev);
    } else if (item.path) {
      navigate(item.path);
      onNavigate?.(); // đóng sidebar mobile
    }
  };

  return (
    <div>
      {/* ITEM CHA */}
      <div
        onClick={handleClick}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer
          hover:bg-[#2A3553]
          transition-colors duration-200
          ${isActive || isParentActive ? "bg-[#2A3553]" : ""}
        `}
      >
        {item.icon && <item.icon size={18} />}
        <span className="text-sm">{item.label}</span>

        {item.children && (
          <span className="ml-auto">
            {open ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </span>
        )}
      </div>

      {/* DROPDOWN */}
      <AnimatePresence>
        {item.children && open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="ml-6 mt-1 space-y-1 overflow-hidden"
          >
            {item.children.map((child: any, i: number) => {
              const isChildActive = location.pathname === child.path;

              return (
                <div
                  key={i}
                  onClick={() => {
                    navigate(child.path);
                    onNavigate?.(); // ⭐ đóng sidebar mobile
                  }}
                  className={`
                    px-3 py-2 text-sm rounded-md cursor-pointer
                    hover:bg-[#2A3553]
                    transition-colors duration-150
                    ${isChildActive ? "bg-[#2A3553]" : ""}
                  `}
                >
                  {child.label}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const SideBar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <aside
      className={`
      fixed lg:static z-50
      h-screen w-64
      bg-[#1D263E] text-white
      transform transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
          <img src="/asset/logo-ainhotel.png" className="w-32" />
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 mt-4">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              {section.title && (
                <h2 className="px-4 text-xs uppercase text-gray-500 mb-1">
                  {section.title}
                </h2>
              )}
              {section.items.map((item: any, j: number) => (
                <SideBarItem key={j} item={item} onNavigate={onClose} />
              ))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
};

export default SideBar;
