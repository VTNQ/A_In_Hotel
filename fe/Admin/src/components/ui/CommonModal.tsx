import React from "react";

interface CommonModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isOpen,
  title = "Modal Title",
  children,
  onClose,
  onSave,
  saveLabel = "Save",
  cancelLabel = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-lg w-[700px] max-w-full p-6 relative">
        {/* Close button (X) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          {title}
        </h2>

        {/* Content */}
        <div className="space-y-4">{children}</div>

        {/* Footer buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 rounded-lg text-white bg-[#2E3A8C] hover:bg-[#253278] transition"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
