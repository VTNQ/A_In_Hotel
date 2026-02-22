import { useState } from "react";
import type { ChangePasswordProps } from "../../type/authentication.types";
import CommonModal from "../ui/CommonModal";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../service/api/Authenticate";
import { useAlert } from "../alert-context";
import { useTranslation } from "react-i18next";

const ChangePasswordModal = ({
  open,
  onClose,
  onSubmit,
}: ChangePasswordProps) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { t } = useTranslation();
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isMinLength = form.newPassword.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(form.newPassword);
  const isMatch = form.newPassword === form.confirmPassword;
  const handleCancel = () => {
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    onClose();
  };
  const handleSubmit = async () => {
    if (!isMinLength || !hasNumberOrSymbol || !isMatch) return;

    try {
      setLoading(true);
      await changePassword(form);
      showAlert({
        title: t("auth.changePassword.success"),
        type: "success",
        autoClose: 3000,
      });
      onSubmit();
      onClose();
      onClose();
    } finally {
      setLoading(false);
    }
  };
  return (
    <CommonModal
      isOpen={open}
      onClose={handleCancel}
      title={t("auth.changePassword.title")}
      saveLabel={loading ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      onSave={handleSubmit}
      width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
    >
      <div className="px-6 py-5 space-y-5">
        <p className="text-sm text-gray-500">
          {t("auth.changePassword.description")}
        </p>
        <div>
          <label className="text-sm font-medium text-gray-700">
            {t("auth.changePassword.currentPassword")}
          </label>
          <div className="relative mt-1">
            <input
              type={show.current ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, current: !show.current })}
              className="absolute right-3 top-2.5"
            >
              {show.current ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            {t("auth.changePassword.newPassword")}
          </label>
          <div className="relative mt-1">
            <input
              type={show.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder={t("auth.changePassword.minLength")}
              className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, new: !show.new })}
              className="absolute right-3 top-2.5"
            >
              {show.new ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Validation */}
          <div className="mt-2 text-xs space-y-1">
            <p
              className={`${isMinLength ? "text-green-600" : "text-gray-400"}`}
            >
              • {t("auth.changePassword.ruleLength")}
            </p>
            <p
              className={`${hasNumberOrSymbol ? "text-green-600" : "text-gray-400"}`}
            >
              • {t("auth.changePassword.ruleNumber")}
            </p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            {t("auth.changePassword.confirmPassword")}
          </label>
          <div className="relative mt-1">
            <input
              type={show.confirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none ${
                !isMatch && form.confirmPassword
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShow({ ...show, confirm: !show.confirm })}
              className="absolute right-3 top-2.5"
            >
              {show.confirm ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </CommonModal>
  );
};
export default ChangePasswordModal;
