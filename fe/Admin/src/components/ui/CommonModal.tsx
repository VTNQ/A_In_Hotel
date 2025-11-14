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
  width = "w-[875px]",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white rounded-2xl shadow-xl ${width} max-w-full flex flex-col max-h-[85vh]`}
      >
        {/* HEADER */}
        <div className="relative px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 text-center w-full">
            {title}
          </h2>

          {/* CLOSE BTN */}

          <button
            onClick={onClose}
            className="
      absolute right-6 bottom-4
      w-7 h-7 flex items-center justify-center
      border border-[#2E3A8C]
      text-[#2E3A8C]
      rounded-lg
      hover:bg-[#f2f4ff]
      transition
    "
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scroll">
          {children}
        </div>

        {/* FOOTER (ẩn nếu không có onSave hoặc hideFooter=true) */}
        {!hideFooter && onSave && (
          <div className="flex justify-end gap-4 px-6 py-2  border-gray-200 bg-white">
            <button
              onClick={onClose}
              className="
    px-20
      h-[38px]
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
    px-20
    h-[38px]
    rounded-lg
    border border-[#7C7C7C]
    text-[#4B4B4B]
    bg-[#F2F2F2]
    hover:bg-[#7C7C7C]
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
