import { DatePickerField } from "@/components/ui/DatePickerField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateOrUpdateTabProps } from "@/type/Promotion.types";
import { useTranslation } from "react-i18next";

const GeneralTab = ({ watch,
  setValue,
  trigger,
  errors, }: CreateOrUpdateTabProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto px-9 py-3">
      <div className="mx-auto space-y-16">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 rounded-full bg-[#3B5CCC]" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-100">
              {t("promotion.general.title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#253150] dark:text-neutral-300">
                {t("promotion.general.name")}
              </label>
              <Input
               value={watch("name")}
                placeholder={t("promotion.general.namePlaceholder")}
                onBlur={() => trigger("name")}
                onChange={(e) =>
                  setValue("name", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
                {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#253150] dark:text-neutral-300">
                {t("promotion.general.priority")}
              </label>
              <Input
                type="number"
                value={watch("priority")}
                onChange={(e) =>
                  setValue("priority", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onBlur={() => trigger("priority")}
                placeholder={t("promotion.general.priorityPlaceholder")}
                
              />
              {errors.priority && (
                <p className="text-red-500 text-sm">
                  {errors.priority.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="font-medium text-[#253150] dark:text-neutral-300">
                {t("promotion.general.description")}
              </label>
              <Textarea
                 value={watch("description")}
                onChange={(e) =>
                  setValue("description", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder={t("promotion.general.descriptionPlaceholder")}
                
                rows={4}
              />
            </div>
          </div>
        </section>
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 rounded-full bg-[#3B5CCC] " />
            <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-100">
              {t("promotion.schedule.title")}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#253150">
                {t("promotion.schedule.startDate")}
              </label>
              <DatePickerField
                 value={watch("startDate")}
                onChange={(d?: Date) => {
                  setValue("startDate", d, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  trigger("startDate");
                }}
                className="mt-1"
                placeholder={t("staff.birthdayPlaceholder")}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[#253150">
                {t("promotion.schedule.endDate")}
              </label>
              <DatePickerField
                value={watch("endDate")}
                onChange={(d?: Date) =>{
                  setValue("endDate", d, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  trigger("endDate");
                }}
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
