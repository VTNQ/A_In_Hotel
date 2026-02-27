import { DatePickerField } from "@/components/ui/DatePickerField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateOrUpdateTabProps } from "@/type/Promotion.types";
import { useTranslation } from "react-i18next";

const GeneralTab = ({ formData, setFormData }: CreateOrUpdateTabProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto px-3 py-3">
      <div className="mx-auto space-y-16">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 rounded-full bg-[#3B5CCC]" />
            <h3 className="text-xl font-bold text-slate-800">
              {t("promotion.general.title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#253150]">
                {t("promotion.general.name")}
              </label>
              <Input
                value={formData.name}
                placeholder={t("promotion.general.namePlaceholder")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#253150]">
                {t("promotion.general.priority")}
              </label>
              <Input
                type="number"
                value={formData.priority}
                placeholder={t("promotion.general.priorityPlaceholder")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="font-medium text-[#253150]">
                {t("promotion.general.description")}
              </label>
              <Textarea
                value={formData.description}
                placeholder={t("promotion.general.descriptionPlaceholder")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
          </div>
        </section>
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 rounded-full bg-[#3B5CCC]" />
            <h3 className="text-xl font-bold text-slate-800">
              {t("promotion.schedule.title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#253150">
                {t("promotion.schedule.startDate")}
              </label>
              <DatePickerField
                value={formData.startDate}
                onChange={(d?: Date) =>
                  setFormData((p) => ({ ...p, startDate: d }))
                }
                className="mt-1"
                placeholder={t("staff.birthdayPlaceholder")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#253150">
                {t("promotion.schedule.endDate")}
              </label>
              <DatePickerField
                value={formData.endDate}
                onChange={(d?: Date) =>
                  setFormData((p) => ({ ...p, endDate: d }))
                }
                className="mt-1"
                placeholder={t("staff.birthdayPlaceholder")}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default GeneralTab;
