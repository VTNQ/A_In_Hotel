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
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
      <div
        className={`
          bg-white rounded-2xl shadow-xl
          ${width} ${height}
          max-w-full
          flex flex-col
        `}
      >
        {/* HEADER */}
        <div className="relative px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
            {title}
          </h2>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="
                absolute right-3 sm:right-6 top-3 sm:top-4
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
          )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scroll">
          {children}
        </div>

        {/* FOOTER */}
        {!hideFooter && onSave && (
          <div className="
            flex flex-col sm:flex-row
            gap-3 sm:gap-4
            px-4 sm:px-6 py-3
            border-t border-gray-200
            bg-white
          ">
            <button
              onClick={onClose}
              className="
                w-full sm:w-auto
                px-6 sm:px-12
                h-[40px]
                rounded-lg
                border border-[#42578E]
                text-[#2E3A8C]
                bg-[#EEF0F7]
                hover:bg-[#e2e6f3]
                transition
                font-medium
              "
            >
              {cancelLabel}
            </button>

            <button
              onClick={onSave}
              className="
                w-full sm:w-auto
                px-6 sm:px-12
                h-[40px]
                rounded-lg
                border border-[#7C7C7C]
                text-[#4B4B4B]
                bg-[#F2F2F2]
                hover:bg-[#42578E]
                hover:text-white
                transition
                font-medium
                flex items-center justify-center
              "
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
