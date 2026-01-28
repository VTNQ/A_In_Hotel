import { Calendar } from "lucide-react";
import type { CreateOrUpdateTabProps } from "../../../type/promotion.types";
import { useTranslation } from "react-i18next";

const GeneralTab = ({ formData, setFormData }: CreateOrUpdateTabProps) => {
  const {t} = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto px-10 py-10">
      <div className="space-y-16  mx-auto">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#42578E] rounded-full" />
            <h3 className="text-xl font-bold text-slate-800">
              {t("promotion.general.title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-8">
            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium text-[#253150]">
                {t("promotion.general.name")}
              </label>
              <input
                value={formData.name}
                placeholder={t("promotion.general.namePlaceholder")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                defaultValue="Summer Getaway"
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium text-[#253150]">
                {t("promotion.general.priority")}
              </label>
              <input
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
                placeholder={t("promotion.general.priorityPlaceholder")}
                type="number"
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              />
            </div>
            <div className="flex flex-col sm:col-span-2">
              <label className="block mb-1 font-medium text-[#253150]">
                {t("promotion.general.description")}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={t("promotion.general.descriptionPlaceholder")}
               className="w-full border border-[#4B62A0] bg-[#EEF0F7] rounded-lg p-2 outline-none"
              />
            </div>
          </div>
        </section>
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#42578E] rounded-full" />
            <h3 className="text-xl font-bold text-slate-800">{t("promotion.schedule.title")}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium text-[#253150]">
               {t("promotion.schedule.startDate")}
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150]"
                />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  defaultValue="Jun 15, 2024 - 12:00 PM"
                  className="h-12 w-full rounded-lg border pl-12 pr-4 border-[#4B62A0]  outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium text-[#253150]">
                {t("promotion.schedule.endDate")}
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150]"
                />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  defaultValue="Jun 15, 2024 - 12:00 PM"
                  className="h-12 w-full rounded-lg border pl-12 pr-4 border-[#4B62A0]  outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default GeneralTab;
