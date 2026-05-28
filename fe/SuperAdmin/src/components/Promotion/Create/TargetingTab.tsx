import { SelectField } from "@/components/ui/select";
import { getAllCategories } from "@/service/api/Categories";
import {
  BOOKING_TYPE_OPTIONS,
  type CreateOrUpdateTabProps,
} from "@/type/Promotion.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TargetingTab = ({ watch, setValue, trigger }: CreateOrUpdateTabProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roomTypes = watch("roomTypes") || [];
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllCategories({
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
            shouldDirty: true,
          },
        );
      } catch (err) {
        setError(t("promotion.loadErrorRoomType"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const toggleRoomType = (roomId: number) => {
    const updated = roomTypes.map((r: any) =>
      r.id === roomId ? { ...r, excluded: !r.excluded } : r,
    );

    setValue("roomTypes", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });

    trigger("roomTypes");
  };

  const isAllSelected =
    roomTypes.length > 0 && roomTypes.every((r: any) => r.excluded === true);

  const toggleSelectAll = () => {
    const updated = roomTypes.map((r: any) => ({
      ...r,
      excluded: !isAllSelected,
    }));

    setValue("roomTypes", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });

    trigger("roomTypes");
  };
  return (
    <div className="flex-1 overflow-y-auto px-5 py-10 space-y-16">
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-[#3B5CCC] dark:bg-indigo-400" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-100">
            {t("promotion.targeting.audience")}
          </h3>
        </div>
        <div className=" space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300">
            {t("promotion.targeting.customerAgent")}
          </label>
          <div className="relative mt-2">
            <SelectField
              isRequired={true}
              items={[
                { value: "0", label: t("common.all") },
                { value: "1", label: t("promotion.customerType.personal") },
                { value: "2", label: t("promotion.customerType.company") },
                { value: "3", label: t("promotion.customerType.walkin") },
                { value: "4", label: t("promotion.customerType.online") },
                { value: "5", label: t("promotion.customerType.vip") },
              ]}
              value={watch("customerType")}
              onChange={(e) => {
                setValue("customerType", e, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                trigger("customerType");
              }}
              size="sm"
              fullWidth={true}
              getValue={(i) => i.value}
              getLabel={(i) => i.label}
            />
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-[#3B5CCC] dark:bg-indigo-400" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-neutral-100">
            {t("promotion.targeting.application")}
          </h3>
        </div>
        <div className="space-y-4">
          <label
            className="text-sm font-bold uppercase tracking-wider text-slate-700
          dark:text-neutral-300"
          >
            {t("promotion.targeting.roomTypes")}
          </label>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="
                    h-[56px] rounded-lg border
                    border-slate-200 bg-slate-100 animate-pulse

                    dark:border-neutral-800
                    dark:bg-neutral-900
                  "
                />
              ))}
            </div>
          )}
          {!loading && error && (
            <div
              className="
                rounded-lg border p-4 text-sm
                border-red-200 bg-red-50 text-red-600

                dark:border-red-900
                dark:bg-red-950/40
                dark:text-red-400
              "
            >
              {error}
            </div>
          )}
          {!loading && !error && (
            <div className="space-y-4">
              {/* Select all */}
              <label
                className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition mt-2
                  ${
                    isAllSelected
                      ? "border-[#3B5CCC] bg-[#E8EEFF] dark:border-indigo-400 dark:bg-indigo-500/15"
                      : "border-dashed border-slate-300 bg-white dark:border-neutral-700 dark:bg-neutral-900"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 text-[#3B5CCC] dark:text-indigo-400"
                />
                <span className="text-sm font-semibold text-[#253150] dark:text-neutral-100">
                  {t("promotion.targeting.selectAllRoomTypes")}
                </span>
              </label>

              {/* Room list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((room) => {
                  const checked =
                    watch("roomTypes").find((r: any) => r.id === room.id)
                      ?.excluded === true;
                  return (
                    <label
                      key={room.id}
                      className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition
                        ${
                          checked
                            ? "border-[#3B5CCC] bg-[#E8EEFF]/60 dark:border-indigo-400 dark:bg-indigo-500/15"
                            : "border-slate-200 bg-white hover:border-[#3B5CCC]/40 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-indigo-400/50"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRoomType(room.id)}
                        className="h-5 w-5 text-[#3B5CCC] dark:text-indigo-400"
                      />
                      <span className="text-sm font-medium text-[#253150] dark:text-neutral-100">
                        {room.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-700
          dark:text-neutral-300">
            {t("promotion.targeting.bookingTypes")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mt-2">
            {BOOKING_TYPE_OPTIONS.map((type) => {
              const checked = watch("bookingType") === type.value;

              return (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition
                    ${
                      checked
                        ? "border-[#3B5CCC] bg-[#E8EEFF] dark:border-indigo-400 dark:bg-indigo-500/15"
                        : "border-slate-200 bg-white hover:border-[#3B5CCC]/40 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-indigo-400/50"
                    }`}
                >
                  <input
                    type="radio"
                    name="bookingType"
                    checked={checked}
                    onChange={() => {
                      setValue("minNights", type.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      trigger("minNights");
                    }}
                    className="h-4 w-4 text-[#3B5CCC] dark:text-indigo-400"
                  />
                  <span className="text-sm font-medium text-[#253150] dark:text-neutral-100">
                    {t(type.labelKey)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
export default TargetingTab;
