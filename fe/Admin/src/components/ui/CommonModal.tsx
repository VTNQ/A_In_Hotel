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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[750px] max-w-full flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scroll">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2.5 rounded-lg text-white bg-[#2E3A8C] hover:bg-[#253278] transition"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
