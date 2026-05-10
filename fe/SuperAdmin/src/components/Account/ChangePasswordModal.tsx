import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { useAlert } from "../alert-context";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import type { ChangePasswordForm, ChangePasswordProps } from "@/type/Account/SuperAdmin/authentication.types";
import { changePassword } from "@/service/api/Authenticate";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const ChangePasswordModal = ({
  open,
  onClose,
  onSubmit,
}: ChangePasswordProps) => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting,isValid },
  } = useForm<ChangePasswordForm>({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const isMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(newPassword);
  const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  if (!open) return null;

  const handleCancel = () => {
    reset();
    onClose();
  };

  const onSubmitForm = async (data: ChangePasswordForm) => {
    try {
      await changePassword(data);

      showAlert({
        title: t("auth.changePassword.success"),
        type: "success",
        autoClose: 3000,
      });

      reset();
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || t("auth.changePassword.error"),
        type: "error",
      });
    }
  };
  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent
        className="
          p-0
          w-[calc(100vw-20px)] sm:w-full
          max-w-[96vw] sm:max-w-xl lg:max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          custom-scrollbar"
      >
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("auth.changePassword.title")}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-gray-500">
            {t("auth.changePassword.description")}
          </p>
           <div>
          <label className="text-sm font-medium text-gray-700">
            {t("auth.changePassword.currentPassword")}
          </label>
          <div className="relative mt-1">
            <Input
              type={show.current ? "text" : "password"}
              {...register("currentPassword", {
                required: t("auth.changePassword.currentPasswordRequired"),
              })}
              
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
            <Input
              type={show.new ? "text" : "password"}
              {...register("newPassword", {
                required: t("auth.changePassword.newPasswordRequired"),
                minLength: {
                  value: 8,
                  message: t("auth.changePassword.ruleLength"),
                },
                validate: (value) =>
                  /[0-9!@#$%^&*]/.test(value) ||
                  t("auth.changePassword.ruleNumber"),
              })}
              placeholder={t("auth.changePassword.minLength")}
             
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
             {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.newPassword.message}
            </p>
          )}

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
          <Input
              type={show.confirm ? "text" : "password"}
              className={`w-full rounded-lg p-2 outline-none border ${
                confirmPassword && !isMatch
                  ? "border-red-400"
                  : "border-input"
              }`}
              {...register("confirmPassword", {
                required: t(
                  "auth.changePassword.confirmPasswordRequired",
                ),
                validate: (value) =>
                  value === newPassword ||
                  t("auth.changePassword.passwordNotMatch"),
              })}
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
           {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        </div>
            <div className="border-t bg-white px-6 py-4">
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmit(onSubmitForm)}
              disabled={isSubmitting || !isValid}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ChangePasswordModal;
