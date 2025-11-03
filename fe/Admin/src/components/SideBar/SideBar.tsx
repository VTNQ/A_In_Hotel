import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS } from "./Section";

const SideBarItem = ({ item }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = item.path && location.pathname.startsWith(item.path);

  const handleClick = () => {
    if (item.children) setOpen(!open);
    else if (item.path) navigate(item.path);
  };

  return (
    <div>
      {/* Item chính */}
      <div
        onClick={handleClick}
        className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer hover:bg-[#2A3553] transition-colors duration-200 ${
          isActive ? "bg-[#2A3553]" : ""
        }`}
      >
        {item.icon && <item.icon size={18} />}
        <span className="text-sm">{item.label}</span>
        {item.children && (
          <span className="ml-auto">
            {open ? (
              <ChevronUp size={16} className="text-gray-400 transition-transform duration-200" />
            ) : (
              <ChevronDown size={16} className="text-gray-400 transition-transform duration-200" />
            )}
          </span>
        )}
      </div>

      {/* Hiệu ứng dropdown cho menu con */}
      <AnimatePresence>
        {item.children && open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="ml-6 mt-1 space-y-1 overflow-hidden"
          >
            {item.children.map((child: any, i: number) => (
              <div
                key={i}
                onClick={() => navigate(child.path)}
                className={`px-3 py-1.5 text-sm rounded-md cursor-pointer hover:bg-[#2A3553] transition-colors duration-150 ${
                  location.pathname === child.path ? "bg-[#2A3553]" : ""
                }`}
              >
                {child.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SideBar = () => {
  return (
    <aside className="flex flex-col h-screen w-64 bg-[#1D263E] text-white overflow-y-auto custom-scroll">
      {/* Tổng thể có thể cuộn */}
      <div className="flex flex-col min-h-full">
        {/* Logo */}
        <div className="flex flex-col items-start py-6 border-b border-gray-700 ml-4">
          <img
            src="/asset/logo-ainhotel.png"
            alt="A-IN HOTEL VIETNAM"
            className="w-36 h-auto object-contain"
          />
        </div>

        {/* Menu */}
        <nav className="flex-1 mt-4 px-3">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              {section.title && (
                <h2 className="px-4 text-xs uppercase text-gray-500 mb-1">
                  {section.title}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item: any, j: number) => (
                  <SideBarItem key={j} item={item} />
                ))}
              </div>
              {i === 0 && <div className="border-t border-gray-700 my-3 mx-4"></div>}
            </div>
          ))}
        </nav>

        {/* Footer (Map image) */}
        <div className="mt-auto px-3 py-3">
          <img src="/asset/map.png" alt="map" className="opacity-70" />
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
