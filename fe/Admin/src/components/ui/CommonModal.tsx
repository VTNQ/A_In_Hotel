import { X } from "lucide-react";
import React from "react";

interface CommonModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  hideFooter?: boolean;
  width?: string; // custom width (optional)
  height?: string;
  showCloseButton?: boolean;
  onsubmit?: boolean;
  diabled?:boolean;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  title = "Modal Title",
  children,
  onClose,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  hideFooter = false,
  width = "w-[95vw] sm:w-[600px] lg:w-[875px]",
  height = "max-h-[85vh]",
  showCloseButton = true,
  onsubmit = false,
  diabled = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/40 backdrop-blur-sm p-2 sm:p-4">
      <div
        className={`
         rounded-2xl shadow-xl ${width} ${height} max-w-full flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 transition-colors
        `}
      >
        {/* HEADER */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
            {title}
          </h2>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="
                absolute right-3 sm:right-6 top-3 sm:top-4
                w-7 h-7 flex items-center justify-center
                border border-[#2E3A8C] dark:border-slate-600
                text-[#2E3A8C] dark:text-slate-300
                rounded-lg
                hover:bg-[#f2f4ff]
                dark:hover:bg-slate-800
                transition
              "
            >
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-visible px-4 sm:px-6 py-4 custom-scroll">
          {children}
        </div>

        {/* FOOTER */}
        {!hideFooter && onSave && (
          <div
            className="
            flex flex-col sm:flex-row
            gap-3 sm:gap-4
            px-4 sm:px-6 py-3
            border-t border-gray-200 dark:border-slate-700
            bg-white dark:bg-slate-900 transition-colors
          "
          >
            <button
              onClick={onClose}
              className="
                w-full sm:w-auto
                px-6 sm:px-12
                h-[40px]
                rounded-lg
                border border-[#42578E] dark:border-slate-600
                text-[#2E3A8C] dark:text-slate-200
                bg-[#EEF0F7] dark:bg-slate-800
                hover:bg-[#e2e6f3] dark:hover:bg-slate-700
                transition
                font-medium
              "
            >
              {cancelLabel}
            </button>

            <button
              onClick={onSave}
              disabled={onsubmit || diabled}
              className={`
                w-full sm:w-auto px-6 sm:px-12 h-[40px] rounded-lg font-medium flex items-center justify-center transition border border-[#7C7C7C] dark:border-slate-600 text-[#484848] dark:text-slate-200 bg-[#F2F2F2] dark:bg-slate-800 hover:bg-[#42578E] hover:text-white dark:hover:bg-[#42578E] dark:hover:text-white disabled:bg-[#E5E5E5] disabled:text-[#9CA3AF] disabled:border-[#D1D5DB] dark:disabled:bg-slate-700 dark:disabled:text-slate-500 dark:disabled:border-slate-600 disabled:cursor-not-allowed disabled:hover:bg-[#E5E5E5] disabled:hover:text-[#9CA3AF] dark:disabled:hover:bg-slate-700 dark:disabled:hover:text-slate-500`}
            >
              {saveLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonModal;
