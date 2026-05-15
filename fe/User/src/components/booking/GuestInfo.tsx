import { Mail, User } from "lucide-react";
import { useTranslation } from "react-i18next";
 
const GuestInfo = ({ data, onChange }: any) => {
  const { t } = useTranslation();
  const update = (key: string, value: string) => {
    onChange((prev: any) => ({ ...prev, [key]: value }));
  };
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
              value={data.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update("firstName", e.target.value)
              }
              placeholder="e.g. Anh"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.lastName")}
            </label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update("lastName", e.target.value)
              }
              placeholder="e.g. Nguyễn"
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.idNumber")}
            </label>
            <input
              type="text"
              placeholder="0123456789"
              value={data.idNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update("idNumber", e.target.value)
              }
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.guestType")}
            </label>
            <select
              value={data.guestType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                update("guestType", e.target.value)
              }
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            >
              <option value={1}>{t("booking.guestInfo.types.standard")}</option>
              <option value={3}>{t("booking.guestInfo.types.vip")}</option>
              <option value={2}>{t("booking.guestInfo.types.corporate")}</option>
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
              value={data.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update("email", e.target.value)
              }
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.phone")}
            </label>
            <input
              type="tel"
              placeholder="+84 000 000 000"
              value={data.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update("phone", e.target.value)
              }
              className="w-full h-11 px-4 rounded-lg border border-[rgb(193,198,215)] focus:border-[rgb(0,89,187)]
                  focus:ring-1 focus:ring-[rgb(0,89,187)] outline-none transition-all text-[14px] line-clamp-1 font-normal font-sans"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="font-sans text-[14px] line-clamp-1 tracking-[0.02em] font-normal text-on-surface">
              {t("booking.guestInfo.specialRequests")}
            </label>
            <textarea
              value={data.note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                update("note", e.target.value)
              }
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
