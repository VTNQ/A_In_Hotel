import { useEffect, useState } from "react";
import { getAllCategory } from "../../../service/api/Category";
import {
  BOOKING_TYPE_OPTIONS,
  type CreateOrUpdateTabProps,
} from "../../../type/promotion.types";
import { useTranslation } from "react-i18next";

const TargetingTab = ({ formData, setFormData }: CreateOrUpdateTabProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllCategory({
          all: true,
          filter: "isActive==1 and type==1",
        });
        const data = response.content || [];
        setCategories(data);

        
        setFormData((prev) => {
       
          if (prev.roomTypes && prev.roomTypes.length > 0) {
            return prev;
          }

    
          return {
            ...prev,
            roomTypes: data.map((room: any) => ({
              id: room.id,
              excluded: false, // true = chọn, false = chưa chọn (theo quy ước mới)
            })),
          };
        });
      } catch (err: any) {
        console.error(err);
        setError(
          t("promotion.loadErrorRoomType") || "Failed to load room types",
        );
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
    formData.roomTypes.every((r) => r.excluded === true);

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
    <div className="flex-1 overflow-y-auto px-10 py-8">
      <div className="mx-auto space-y-16">
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#42578E] rounded-full" />
            <h3 className="text-xl font-bold text-slate-800">
              Audience & Channels
            </h3>
          </div>
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Customer Segment
              </label>
              <select
                value={formData.customerType}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    customerType: e.target.value,
                  }));
                }}
                className="h-12 rounded-lg border px-4 bg-white border-[#4B62A0] outline-none"
              >
                <option value="0">{t("common.all")}</option>
                <option value="1">
                  {t("promotion.customerType.personal")}
                </option>
                <option value="2">{t("promotion.customerType.company")}</option>
                <option value="3">{t("promotion.customerType.walkin")}</option>
                <option value="4">{t("promotion.customerType.online")}</option>
                <option value="5">{t("promotion.customerType.vip")}</option>
              </select>
            </div>
          </div>
        </section>
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-[#42578E]  rounded-full" />
            <h3 className="text-xl font-bold text-slate-800">Application</h3>
          </div>
          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Applicable Room Types
              </label>
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[56px] rounded-lg border border-gray-200 bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-4">
                  {error}
                </div>
              )}
              {!loading && !error && (
                <div className="space-y-4">
                  {/* Select All – luôn full width */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all sm:col-span-2
      ${
        isAllSelected
          ? "border-[#42578E] bg-[#42578E]/10"
          : "border-dashed border-gray-300 bg-white"
      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 text-[#42578E]"
                    />
                    <span className="text-sm font-bold text-[#253150]">
                      Select all room types
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
                          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
            ${
              checked
                ? "border-[#42578E] bg-[#42578E]/5"
                : "border-gray-200 bg-white"
            }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleRoomType(room.id)}
                            className="w-5 h-5 text-[#42578E]"
                          />
                          <span className="text-sm font-semibold text-[#253150]">
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
              <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Applicable Booking Types
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                {BOOKING_TYPE_OPTIONS.map((type) => {
                  const checked = formData.bookingType === type.value;

                  return (
                    <label
                      key={type.value}
                      className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all
          ${
            checked
              ? "border-[#42578E] bg-[#42578E]/10"
              : "border border-gray-200 bg-white hover:border-[#42578E]/40"
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
                        className="w-4 h-4 text-[#42578E] focus:ring-[#42578E]/20"
                      />

                      <span
                        className={`text-sm font-semibold ${
                          checked ? "text-[#253150]" : "text-slate-600"
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
