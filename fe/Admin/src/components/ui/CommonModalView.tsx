import { X } from "lucide-react";
import type { CommonModalViewProps } from "../../type";
import { useTranslation } from "react-i18next";

const CommonModalView: React.FC<CommonModalViewProps> = ({
  isOpen,
  title = "Modal Title",
  children,
  onClose,
  tabs = [],
  activeTab,
  onTabChange,
  width = "w-[95vw] sm:w-[500px]",
  isBorderBottom,
  widthClose = "w-full sm:w-[200px]",
  withCenter = "text-center",
}) => {
  if (!isOpen) return null;
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
      <div
        className={`
          bg-white rounded-3xl shadow-xl
          ${width}
          max-w-full
          flex flex-col
          max-h-[90vh]
        `}
      >
        {/* HEADER */}
        <div
          className={`
            relative px-4 sm:px-6 pt-6 sm:pt-8 pb-4
            bg-white rounded-2xl
            ${isBorderBottom ? "border-b border-[#C2C4C5]" : ""}
          `}
        >
          <h2
            className={`text-lg sm:text-[27px] font-semibold text-[#1F2945] ${withCenter}`}
          >
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              absolute right-4 sm:right-6 top-4 sm:top-8
              w-7 h-7 flex items-center justify-center
              border border-[#2E3A8C]
              text-[#2E3A8C]
              rounded-lg
              hover:bg-[#f2f4ff]
              transition
            "
          >
            <X size={16} strokeWidth={2} />
          </button>

          {/* TABS */}
          {tabs.length > 0 && (
            <div className="mt-4 flex justify-center gap-4 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onTabChange?.(tab.key)}
                  className={`
                    text-sm sm:text-[16px] font-semibold pb-1
                    transition
                    ${
                      activeTab === tab.key
                        ? "text-[#1F2945] border-b-2 border-[#1F2945]"
                        : "text-[#8A8FA3] hover:text-[#253150]"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto custom-scroll px-4 sm:px-6 py-2">
          {children}
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-4 bg-white flex justify-center sm:justify-end">
          <button
            onClick={onClose}
            className={`
              ${widthClose}
              h-[40px]
              rounded-xl
              bg-[#42578E]
              text-white
              text-sm sm:text-[16px]
              font-medium
              hover:bg-[#333d6e]
              transition
              shadow-sm
            `}
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonModalView;
