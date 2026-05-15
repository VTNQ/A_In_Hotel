import { Check } from "lucide-react";
import { BookingPackages } from "../../type/booking.types";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const BookingPackage = ({ form, nights, onChange }: any) => {
  const { t } = useTranslation();
  const PACKAGE_OPTIONS = [
    { label: t("booking.schedule.packages.twoHours.title"), value: "1" },
    { label: t("booking.schedule.packages.overnight.title"), value: "2" },
    { label: t("booking.schedule.packages.daily.title"), value: "3" },
  ];

  const packageOptions = useMemo(() => {
    return PACKAGE_OPTIONS.map((opt) => ({
      ...opt,
      disabled: opt.value === "2" && nights > 1, // ✅ chỉ overnight
    }));
  }, [nights]);
  useEffect(() => {
    if (!form.checkInDate || !form.checkOutDate) return;

    if (nights === 0 && form.package !== "1") {
      onChange("package", "1");
    }

    if (nights === 1 && form.package !== "2") {
      onChange("package", "2");
    }

    if (nights >= 2 && form.package !== "3") {
      onChange("package", "3");
    }
  }, [nights, form.checkInDate, form.checkOutDate]);
  return (
    <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-4">
      <label className="text-xs uppercase tracking-[0.1em] text-gray-400 block">
        Booking Package
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BookingPackages.map((pkg) => {
          const Icon = pkg.icon;
          const option = packageOptions.find((o) => o.value === pkg.id);
          const isDisabled = option?.disabled;
          const isActive = form.package === pkg.id;
          return (
            <button
              key={pkg.id}
              disabled={isDisabled}
              onClick={() => onChange("package", pkg.id)}
              className={`flex flex-col items-start p-4 rounded-lg transition-all text-left
                ${isDisabled
                  ? "opacity-40 cursor-not-allowed"
                  : isActive
                    ? "border-2 border-black bg-blue-50"
                    : "border border-outline-variant hover:border-black"
                }
                `}
            >
              <div className="flex justify-between w-full mb-2">
                <Icon
                  size={20}
                  className={
                    isDisabled
                      ? "text-gray-400"
                      : isActive
                        ? "text-black"
                        : "text-gray-400"
                  }
                />
                <div
                  className={`w-5 h-5 flex items-center justify-center rounded-full transition-all
  ${isActive ? "bg-black text-white" : "bg-transparent text-transparent"}`}
                >
                  <Check size={12} />
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${isDisabled
                    ? "text-gray-300"
                    : isActive
                      ? "text-black"
                      : "text-gray-400"
                  }`}
              >
                {(() => {
                  const pkgKeys: any = { "1": "twoHours", "2": "overnight", "3": "daily" };
                  const key = pkgKeys[pkg.id];
                  return t(`booking.schedule.packages.${key}.title`);
                })()}
              </span>
              <span className="text-xs text-[rgb(87,95,103)] mt-1">
                {(() => {
                  const pkgKeys: any = { "1": "twoHours", "2": "overnight", "3": "daily" };
                  const key = pkgKeys[pkg.id];
                  return t(`booking.schedule.packages.${key}.desc`);
                })()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default BookingPackage;
