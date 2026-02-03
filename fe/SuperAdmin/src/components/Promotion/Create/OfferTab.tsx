
import { SelectField } from "@/components/ui/select";
import type { CreateOrUpdateTabProps } from "@/type/Promotion.types";
import { Moon, Percent, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

const OfferTab = ({ formData, setFormData }: CreateOrUpdateTabProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto px-5 py-10 space-y-16">
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-[#3B5CCC]" />
          <h3 className="text-xl font-bold text-slate-800">
            {t("promotion.offer.title")}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[#253150]">
              {t("promotion.offer.type")}
            </label>
            <div className="relative mt-2">
              <SelectField
                isRequired={true}
                items={[
                  { value: "1", label: t("promotion.offer.fixed") },
                  { value: "2", label: t("promotion.offer.percent") },
                  { value: "3", label: t("promotion.offer.special") },
                ]}
                value={formData.type}
                onChange={(v) => setFormData((p) => ({ ...p, type: v }))}
                size="sm"
                fullWidth={true}
                getValue={(i) => i.value}
                getLabel={(i) => i.label}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-[#253150]">
              {t("promotion.offer.value")}
            </label>
            <div className="relative ">
              <span className="absolute left-2 top-1/2 -translate-y-1/3 text-slate-500">
                {formData.type === "1" || formData.type === "3" ? (
                  <Percent size={18} />
                ) : (
                  <Wallet size={18} />
                )}
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }));
                }}
                placeholder={
                  formData.type === "1" || formData.type === "3"
                    ? t("promotion.offer.valuePercentPlaceholder")
                    : t("promotion.offer.valueFixedPlaceholder")
                }
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent  pl-8 py-5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive mt-1"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-[#3B5CCC]" />
          <h3 className="text-xl font-bold text-slate-800">
            {t("promotion.conditions.title")}
          </h3>
        </div>
        <div className="grid grid-cols-1 ">
          <div className="flex flex-col gap-2 ">
            <label className="font-medium text-[#253150]">
              {t("promotion.conditions.minNights")}
            </label>
            <div className="relative">
              <Moon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/3 text-slate-500"
              />
              <input
               value={formData.minNights}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minNights: e.target.value,
                  }))
                }
                 placeholder={t(
                  "promotion.conditions.minNightsPlaceholder"
                )}
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent  pl-10 py-5 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
                focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive mt-1"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default OfferTab;
