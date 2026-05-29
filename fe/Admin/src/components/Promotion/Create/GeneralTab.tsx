import { Calendar } from "lucide-react";
import type { CreateOrUpdateTabProps } from "../../../type/promotion.types";
import { useTranslation } from "react-i18next";

const GeneralTab = ({
  watch,
  setValue,
  trigger,
  errors,
}: CreateOrUpdateTabProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto px-10 py-10 bg-white dark:bg-[#0F172A] transition-colors">
      <div className="space-y-16 mx-auto">
        {/* GENERAL */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#42578E] rounded-full dark:bg-blue-500" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100">
              {t("promotion.general.title")}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* NAME */}
            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium text-[#253150] dark:text-gray-300">
                {t("promotion.general.name")}
              </label>

              <input
                value={watch("name")}
                placeholder={t("promotion.general.namePlaceholder")}
                onBlur={() => trigger("name")}
                onChange={(e) =>
                  setValue("name", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                defaultValue="Summer Getaway"
                className="
                  w-full rounded-lg p-2 outline-none border
                  border-[#4B62A0]
                  bg-white text-gray-800
                  dark:bg-slate-800 dark:text-gray-100
                  dark:border-slate-600
                  dark:placeholder:text-gray-400
                  focus:border-[#42578E]
                  dark:focus:border-blue-500
                "
              />

              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* PRIORITY */}
            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium text-[#253150] dark:text-gray-300">
                {t("promotion.general.priority")}
              </label>

              <input
                value={watch("priority")}
                onChange={(e) =>
                  setValue("priority", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                onBlur={() => trigger("priority")}
                placeholder={t("promotion.general.priorityPlaceholder")}
                type="number"
                className="
                  w-full rounded-lg p-2 outline-none border
                  border-[#4B62A0]
                  bg-white text-gray-800
                  dark:bg-slate-800 dark:text-gray-100
                  dark:border-slate-600
                  dark:placeholder:text-gray-400
                  focus:border-[#42578E]
                  dark:focus:border-blue-500
                "
              />

              {errors.priority && (
                <p className="text-red-500 text-sm">
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col sm:col-span-2">
              <label className="block mb-1 font-medium text-[#253150] dark:text-gray-300">
                {t("promotion.general.description")}
              </label>

              <textarea
                value={watch("description")}
                onChange={(e) =>
                  setValue("description", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder={t("promotion.general.descriptionPlaceholder")}
                className="
                  w-full rounded-lg p-3 outline-none border
                  border-[#4B62A0]
                  bg-[#EEF0F7] text-gray-800
                  dark:bg-slate-800 dark:text-gray-100
                  dark:border-slate-600
                  dark:placeholder:text-gray-400
                  focus:border-[#42578E]
                  dark:focus:border-blue-500
                "
              />
            </div>
          </div>
        </section>

        {/* SCHEDULE */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#42578E] rounded-full dark:bg-blue-500" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100">
              {t("promotion.schedule.title")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* START DATE */}
            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium text-[#253150] dark:text-gray-300">
                {t("promotion.schedule.startDate")}
              </label>

              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150] dark:text-gray-400"
                />

                <input
                  type="date"
                  value={watch("startDate")}
                  onChange={(e) =>
                    setValue("startDate", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  defaultValue="Jun 15, 2024 - 12:00 PM"
                  onBlur={() => trigger("startDate")}
                  className="
                    h-12 w-full rounded-lg border pl-12 pr-4 outline-none
                    border-[#4B62A0]
                    bg-white text-gray-800
                    dark:bg-slate-800 dark:text-gray-100
                    dark:border-slate-600
                    focus:border-[#42578E]
                    dark:focus:border-blue-500
                  "
                />

                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* END DATE */}
            <div className="flex flex-col gap-2">
              <label className="block mb-1 font-medium text-[#253150] dark:text-gray-300">
                {t("promotion.schedule.endDate")}
              </label>

              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150] dark:text-gray-400"
                />

                <input
                  type="date"
                  value={watch("endDate")}
                  onChange={(e) =>
                    setValue("endDate", e.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  onBlur={() => trigger("endDate")}
                  defaultValue="Jun 15, 2024 - 12:00 PM"
                  className="
                    h-12 w-full rounded-lg border pl-12 pr-4 outline-none
                    border-[#4B62A0]
                    bg-white text-gray-800
                    dark:bg-slate-800 dark:text-gray-100
                    dark:border-slate-600
                    focus:border-[#42578E]
                    dark:focus:border-blue-500
                  "
                />

                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GeneralTab;