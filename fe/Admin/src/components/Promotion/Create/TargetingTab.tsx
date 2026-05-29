import { useEffect, useState } from "react";
import { getAllCategory } from "../../../service/api/Category";
import {
  BOOKING_TYPE_OPTIONS,
  type CreateOrUpdateTabProps,
} from "../../../type/promotion.types";
import { useTranslation } from "react-i18next";

const TargetingTab = ({ watch, setValue, trigger }: CreateOrUpdateTabProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const roomTypes = watch("roomTypes") || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllCategory({
          all: true,
          filter: "isActive==1 and type==1",
        });

        const data = response.data.content || [];

        setCategories(data);

        setValue(
          "roomTypes",
          data.map((room: any) => ({
            id: room.id,
            excluded: false,
          })),
          {
            shouldValidate: true,
          },
        );
      } catch (err) {
        console.error(err);

        setError(
          t("promotion.loadErrorRoomType") || "Failed to load room types",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setValue, t]);

  const toggleRoomType = (roomId: number) => {
    const updated = roomTypes.map((room: any) =>
      room.id === roomId
        ? {
            ...room,
            excluded: !room.excluded,
          }
        : room,
    );

    setValue("roomTypes", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const isAllSelected =
    roomTypes.length > 0 && roomTypes.every((room: any) => room.excluded);

  const toggleSelectAll = () => {
    const updated = roomTypes.map((room: any) => ({
      ...room,
      excluded: !isAllSelected,
    }));

    setValue("roomTypes", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8 bg-white dark:bg-[#0F172A]">
      <div className="mx-auto space-y-16">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#42578E] rounded-full" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100">
              {t("promotion.targeting.audience")}
            </h3>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                {t("promotion.targeting.customerAgent")}
              </label>

              <select
                value={watch("customerType")}
                onChange={(e) => {
                  setValue("customerType", e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  trigger("customerType");
                }}
                className="h-12 rounded-lg border px-4 bg-white dark:bg-slate-800 
                border-[#4B62A0] dark:border-slate-700 
                text-slate-800 dark:text-gray-100 outline-none"
              >
                <option value="0">{t("common.all")}</option>
                <option value="1">
                  {t("promotion.customerType.personal")}
                </option>
                <option value="2">
                  {t("promotion.customerType.company")}
                </option>
                <option value="3">
                  {t("promotion.customerType.walkin")}
                </option>
                <option value="4">
                  {t("promotion.customerType.online")}
                </option>
                <option value="5">
                  {t("promotion.customerType.vip")}
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#42578E] rounded-full" />

            <h3 className="text-xl font-bold text-slate-800 dark:text-gray-100">
              {t("promotion.targeting.application")}
            </h3>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                {t("promotion.targeting.roomTypes")}
              </label>

              {/* Loading */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[56px] rounded-lg border 
                      border-gray-200 dark:border-slate-700 
                      bg-gray-100 dark:bg-slate-800 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div
                  className="text-sm text-red-500 dark:text-red-400 
                  bg-red-50 dark:bg-red-500/10 
                  border border-red-200 dark:border-red-500/20 
                  rounded-lg p-4"
                >
                  {error}
                </div>
              )}

              {/* Content */}
              {!loading && !error && (
                <div className="space-y-4">
                  {/* Select all */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
                    ${
                      isAllSelected
                        ? "border-[#42578E] bg-[#42578E]/10 dark:bg-[#42578E]/20"
                        : "border-dashed border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-[#42578E]"
                    />

                    <span className="text-sm font-bold text-[#253150] dark:text-gray-100">
                      {t("promotion.targeting.selectAllRoomTypes")}
                    </span>
                  </label>

                  {/* Room types */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((room: any) => {
                      const selectedRoom = roomTypes.find(
                        (r: any) => r.id === room.id,
                      );

                      const checked = selectedRoom?.excluded === true;

                      return (
                        <label
                          key={room.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
                          ${
                            checked
                              ? "border-[#42578E] bg-[#42578E]/5 dark:bg-[#42578E]/15"
                              : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#42578E]/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleRoomType(room.id)}
                            className="w-5 h-5 text-[#42578E]"
                          />

                          <span className="text-sm font-semibold text-[#253150] dark:text-gray-100">
                            {room.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300">
                {t("promotion.targeting.bookingTypes")}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                {BOOKING_TYPE_OPTIONS.map((type) => {
                  const checked = watch("bookingType") === type.value;

                  return (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border
                      ${
                        checked
                          ? "border-[#42578E] bg-[#42578E]/10 dark:bg-[#42578E]/20"
                          : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#42578E]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        value={type.value}
                        checked={checked}
                        onChange={() =>
                          setValue("bookingType", type.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className="w-4 h-4 text-[#42578E] focus:ring-[#42578E]/20"
                      />

                      <span
                        className={`text-sm font-semibold ${
                          checked
                            ? "text-[#253150] dark:text-gray-100"
                            : "text-slate-600 dark:text-gray-400"
                        }`}
                      >
                        {t(type.labelKey)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TargetingTab;