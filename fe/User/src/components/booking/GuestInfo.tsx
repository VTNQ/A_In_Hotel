import { Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { GuestFormData } from "../../type/booking.types";
import { useEffect } from "react";

const GuestInfo = ({ data, onChange }: any) => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<GuestFormData>({
    mode:"onChange",
    defaultValues: data,
  });
 const values = watch();

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);
  return (
        <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] line-clamp-1 font-semibold text-on-surface font-sans">
          {t("booking.guestInfo.title")}
        </h1>
        <p className="text-[16px] line-clamp-[1.5] font-normal font-sans text-on-surface">
          {t("booking.guestInfo.subtitle")}
        </p>
      </div>
      <section className="bg-white border border-[rgb(193,198,215)] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[rgb(235,238,243)] pb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#FBF7F2] text-gray-600">
            <User size={18} />
          </div>
          <h2 className="text-[20px] line-clamp-1 font-semibold text-on-surface font-sans">
            {t("booking.guestInfo.identityTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.firstName")}
            </label>
            <input
              type="text"
              {...register("firstName", {
                required: t("validation.firstNameRequired"),
              })}
              placeholder="e.g. Anh"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.lastName")}
            </label>
            <input
              type="text"
              {...register("lastName", {
                required: t("validation.lastNameRequired"),
              })}
              placeholder="e.g. Nguyễn"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.idNumber")}
            </label>
            <input
              type="text"
              placeholder="0123456789"
              {...register("idNumber", {
                required: t("validation.idRequired"),
                minLength: {
                  value: 9,
                  message: t("validation.idMin"),
                },
              })}
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
            {errors.idNumber && (
              <p className="text-sm text-red-500">{errors.idNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.guestType")}
            </label>
            <select
              {...register("guestType")}
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            >
              <option value={1}>{t("booking.guestInfo.types.standard")}</option>
              <option value={3}>{t("booking.guestInfo.types.vip")}</option>
              <option value={2}>
                {t("booking.guestInfo.types.corporate")}
              </option>
            </select>
          </div>
        </div>
      </section>
      <section className="bg-white border border-[rgb(193,198,215)] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[rgb(235,238,243)] pb-4">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#FBF7F2] text-gray-600">
            <Mail size={18} />
          </div>
          <h2 className="text-[20px] line-clamp-1 font-semibold text-on-surface font-sans">
            {t("booking.guestInfo.contactTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.email")}
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              {...register("email", {
                required: t("validation.emailRequired"),
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: t("validation.emailInvalid"),
                },
              })}
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.phone")}
            </label>
            <input
              type="tel"
              placeholder="+84 000 000 000"
              {...register("phone", {
                required: t("validation.phoneRequired"),
                minLength: {
                  value: 10,
                  message: t("validation.phoneMin"),
                },
              })}
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.specialRequests")}
            </label>
            <textarea
              {...register("note")}
              placeholder={t("booking.guestInfo.placeholderNote")}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md resize-none"
              rows={4}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestInfo;
