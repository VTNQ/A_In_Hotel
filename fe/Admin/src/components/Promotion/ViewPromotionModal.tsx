import { useEffect, useState } from "react";
import {
  PROMOTION_TYPE_I18N,
  type ViewPromotionProps,
} from "../../type/promotion.types";
import CommonModalView from "../ui/CommonModalView";
import { getPromotionById } from "../../service/api/Promotion";
import { useTranslation } from "react-i18next";
import { CheckCircle, Percent, Wallet, XCircle } from "lucide-react";
import { getBookingTypeLabelKey } from "../../util/util";

const ViewPromotionModal = ({
  isOpen,
  onClose,
  promotionId,
}: ViewPromotionProps) => {
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState<any | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPromotionById(promotionId);
        setPromotion(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [promotionId]);
  return (
    <CommonModalView
      isOpen={isOpen}
      onClose={onClose}
      title="Promotion Details"
      width="w-[50%] max-w-[100px]"
      widthClose="w-full sm:w-[200px]"
      isBorderBottom={true}
    >
      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="flex items-center gap-3 text-[#42578E]">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-sm font-semibold">
              {t("common.loading") || "Loading promotion details..."}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10">
          <section>
            <h3 className="text-primary text-lg font-bold mb-4">
              General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Promotion Name
                </p>
                <p className="text-base">{promotion?.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Campaign Code
                </p>
                <p className="font-mono tracking-widest font-bold">
                  {promotion?.code}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Description
                </p>
                <p>{promotion?.description}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Priority Level
                </p>
                <p>Level {promotion?.priority}</p>
              </div>
            </div>
            <div className="mt-4 border-b border-dotted border-gray-400"></div>
          </section>
          <section>
            <h3 className="text-primary text-lg font-bold mb-4">
              Offer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Promotion Type
                </p>
                <p>{t(PROMOTION_TYPE_I18N[Number(promotion?.type)])}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Discount Value
                </p>
                <p className="flex items-center gap-2 text-lg font-semibold text-[#253150]">
                  {promotion?.type === "1" ? (
                    <>
                      <Percent size={18} className="text-[#42578E]" />
                      <span>{promotion?.value}%</span>
                    </>
                  ) : (
                    <>
                      <Wallet size={18} className="text-[#42578E]" />
                      <span>
                        {Number(promotion?.value).toLocaleString()} VND
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-[#1F2945] text-lg font-bold mb-4">
              Applicable Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Start Date
                </p>
                <p>{promotion?.startDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  End Date
                </p>
                <p>{promotion?.endDate}</p>
              </div>
            </div>

            <div className="mt-4 border-b border-dotted border-gray-400"></div>
          </section>
          <section>
            <h3 className="text-[#1F2945] text-lg font-bold mb-4">
              Booking & Customer Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Booking Type
                </p>
                <p className="text-base font-medium text-[#253150] mt-1">
                  {t(
                    getBookingTypeLabelKey(promotion?.bookingType) ??
                      "common.all",
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Minimum Nights
                </p>
                <p>{promotion?.minNights ?? 0} Nights</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase text-[#253150] font-semibold">
                  Customer Segment
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="px-3 py-1 rounded-full bg-[#42578E]/10
    text-[#42578E] text-xs font-semibold"
                  >
                    {t(
                      getBookingTypeLabelKey(promotion?.customerType) ??
                        "common.all",
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 border-b border-dotted border-gray-400"></div>
          </section>
          <section>
            <h3 className="text-primary text-lg font-bold mb-4">
              Room Type Inclusion
            </h3>
            <div className="rounded-lg border overflow-hidden border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase">
                      Room Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {promotion?.promotionRoomTypeResponses.map((r: any) => {
                    const isIncluded = !r.excluded;

                    return (
                      <tr
                        key={r.roomTypeId}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-[#253150]">
                          {r.roomTypeName}
                        </td>

                        <td className="px-4 py-3">
                          {isIncluded ? (
                            <span className="flex items-center gap-1 text-green-600 font-semibold">
                              <CheckCircle size={16} />
                              Included
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-500 font-semibold">
                              <XCircle size={16} />
                              Excluded
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </CommonModalView>
  );
};
export default ViewPromotionModal;
