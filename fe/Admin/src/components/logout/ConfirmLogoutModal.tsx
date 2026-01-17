import { X } from "lucide-react";
import type { ConfirmLogoutModalProps } from "../../type";
import { useTranslation } from "react-i18next";

const ConfirmLogoutModal = ({
  open,
  onCancel,
  onConfirm,
}: ConfirmLogoutModalProps) => {
  if (!open) return null;
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* modal */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* header */}
        <div className="flex items-start justify-between px-6 pt-5">
          <h2 className="text-lg font-semibold text-gray-800">
             {t("logoutConfirm.title")}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div className="px-6 pt-2 pb-5">
          <p className="text-sm text-gray-500">
             {t("logoutConfirm.description")}
          </p>
        </div>

        {/* footer */}
        <div className="flex justify-between px-5 pb-5">
          {/* CANCEL */}
          <button
            onClick={onCancel}
            className="
              w-[200px] h-[44px]
              inline-flex items-center justify-center
              rounded-md
              border border-[#42578E]
              bg-[#EEF0F7]
              text-sm font-medium text-[#2E3A8C]
              hover:bg-[#e2e6f3]
              transition
            "
          >
             {t("logoutConfirm.cancel")}
          </button>

          {/* CONFIRM */}
          <button
            onClick={onConfirm}
            className="
              w-[200px] h-[44px]
              inline-flex items-center justify-center
              rounded-md
              bg-[#4B62A0]
              text-sm font-medium text-white
              hover:bg-[#42578E]
              transition
            "
          >
              {t("logoutConfirm.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
