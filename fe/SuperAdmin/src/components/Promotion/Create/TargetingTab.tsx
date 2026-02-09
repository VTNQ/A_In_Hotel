import { SelectField } from "@/components/ui/select";
import { getAllCategories } from "@/service/api/Categories";
import {
  BOOKING_TYPE_OPTIONS,
  type CreateOrUpdateTabProps,
} from "@/type/Promotion.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TargetingTab = ({ formData, setFormData }: CreateOrUpdateTabProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

        const data = response.content || [];
        setCategories(data);

        setFormData((prev) => {
          if (prev.roomTypes?.length) return prev;
          return {
            ...prev,
            roomTypes: data.map((r: any) => ({
              id: r.id,
              excluded: false,
            })),
          };
        });
      } catch (err) {
        setError(t("promotion.loadErrorRoomType"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const toggleRoomType = (roomId: number) => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((r) =>
        r.id === roomId ? { ...r, excluded: !r.excluded } : r,
      ),
    }));
  };

  const isAllSelected =
    formData.roomTypes.length > 0 &&
    formData.roomTypes.every((r) => r.excluded);

  const toggleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((r) => ({
        ...r,
        excluded: !isAllSelected,
      })),
    }));
  };
  return (
    <div className="flex-1 overflow-y-auto px-5 py-10 space-y-16">
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-8 w-1 rounded-full bg-[#3B5CCC]" />
          <h3 className="text-xl font-bold text-slate-800">
            {t("promotion.targeting.audience")}
          </h3>
        </div>
        <div className=" space-y-2">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
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
              value={formData.customerType}
              onChange={(v) => setFormData((p) => ({ ...p, customerType: v }))}
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
          <div className="h-8 w-1 rounded-full bg-[#3B5CCC]" />
          <h3 className="text-xl font-bold text-slate-800">
            {t("promotion.targeting.application")}
          </h3>
        </div>
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {t("promotion.targeting.roomTypes")}
          </label>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[56px] rounded-lg border border-slate-200 bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          )}
          {!loading && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
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
                      ? "border-[#3B5CCC] bg-[#E8EEFF]"
                      : "border-dashed border-slate-300 bg-white"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 text-[#3B5CCC]"
                />
                <span className="text-sm font-semibold text-[#253150]">
                  {t("promotion.targeting.selectAllRoomTypes")}
                </span>
              </label>

              {/* Room list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((room) => {
                  const checked =
                    formData.roomTypes.find((r) => r.id === room.id)
                      ?.excluded === true;

                  return (
                    <label
                      key={room.id}
                      className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition
                        ${
                          checked
                            ? "border-[#3B5CCC] bg-[#E8EEFF]/60"
                            : "border-slate-200 bg-white hover:border-[#3B5CCC]/40"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRoomType(room.id)}
                        className="h-5 w-5 text-[#3B5CCC]"
                      />
                      <span className="text-sm font-medium text-[#253150]">
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
          <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {t("promotion.targeting.bookingTypes")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mt-2">
            {BOOKING_TYPE_OPTIONS.map((type) => {
              const checked = formData.bookingType === type.value;

              return (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition
                    ${
                      checked
                        ? "border-[#3B5CCC] bg-[#E8EEFF]"
                        : "border-slate-200 bg-white hover:border-[#3B5CCC]/40"
                    }`}
                >
                  <input
                    type="radio"
                    name="bookingType"
                    checked={checked}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bookingType: type.value,
                      }))
                    }
                    className="h-4 w-4 text-[#3B5CCC]"
                  />
                  <span className="text-sm font-medium text-[#253150]">
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
