import { ArrowDown, Moon, Percent, Wallet } from "lucide-react";
import type { CreateOrUpdateTabProps } from "../../../type/promotion.types";
import { useTranslation } from "react-i18next";

const OfferTab = ({ formData, setFormData }: CreateOrUpdateTabProps) => {
  const {t} = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto px-10 py-10 space-y-16">
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-[#42578E] rounded-full" />
          <h3 className="text-xl font-bold text-slate-800">
            {t("promotion.offer.title")}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="block mb-1 font-medium text-[#253150]">
              {t("promotion.offer.type")}
            </label>
            <div className="relative">
              <select
                value={formData.type}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }));
                }}
                className="h-12 w-full rounded-lg border px-4 pr-10 border-[#4B62A0] bg-white  focus:border-primary outline-none appearance-none"
              >
                <option value="2">{t("promotion.offer.fixed")}</option>
                <option value="1">{t("promotion.offer.percent")}</option>
                <option value="3">{t("promotion.offer.special")}</option>
                
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ArrowDown />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block mb-1 font-medium text-[#253150]">
              {t("promotion.offer.value")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                {formData?.type === "1" || formData?.type === "3"? (
                  <Percent size={18} />
                ) : (
                  <Wallet size={18} />
                )}
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e)=>{
                  setFormData((prev)=>({
                    ...prev,
                    value:e.target.value
                  }))
                }}
                placeholder={
                  formData.type === "1" || formData.type === "3" ? t("promotion.offer.valuePercentPlaceholder") : t("promotion.offer.valueFixedPlaceholder")
                }
                className="h-12 w-full rounded-lg border pl-12 pr-4 border-[#4B62A0] outline-none"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 bg-[#42578E] rounded-full" />
          <h3 className="text-xl font-bold text-slate-800">{t("promotion.conditions.title")}</h3>
        </div>
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col gap-2">
            <label className="block mb-1 font-medium text-[#253150]">
              {t("promotion.conditions.minNights")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150]">
                <Moon size={18} />
              </span>
              <input
                type="number"
                value={formData.minNights}
                onChange={(e)=>{
                  setFormData((prev)=>({
                    ...prev,
                    minNights:e.target.value
                  }))
                }}
                placeholder={t("promotion.conditions.minNightsPlaceholder")}
                className="h-12 w-full rounded-lg border pl-12 pr-4 border-[#4B62A0] outline-none"
              />
            </div>
          </div>
          {/* <div className="flex flex-col gap-2">
            <label className="block mb-1 font-medium text-[#253150]">
              Minimum Spend
            </label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#253150]">
                VND
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="h-12 w-full rounded-lg border pl-12 pr-4 border-[#4B62A0] outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 md:col-span-2 max-w-sm">
            <label className="text-sm font-semibold text-slate-700">
              Max Discount Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150]">
                <Wallet />
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="No limit"
                className="h-12 w-full rounded-lg border pl-12 pr-4 border-[#4B62A0] outline-none"
              />
            </div>
            <p className="text-xs text-slate-500 italic">
              Leave empty if there is no maximum discount cap.
            </p>
          </div> */}
        </div>
      </section>
    </div>
  );
};
export default OfferTab;
