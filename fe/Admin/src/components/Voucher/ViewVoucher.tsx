import { useTranslation } from "react-i18next";
import { useAlert } from "../alert-context";
import {
  BOOKING_TYPE,
  VOUCHER_TYPE,
  type ViewVoucherProps,
} from "../../type/voucher.types";
import { useEffect, useMemo, useState } from "react";
import { getVoucherById } from "../../service/api/Voucher";
import { getAllCategory } from "../../service/api/Category";
import CommonModalView from "../ui/CommonModalView";

const ViewVoucher = ({ isOpen, onClose, voucherId }: ViewVoucherProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [voucher, setVoucher] = useState<any | null>(null);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const { showAlert } = useAlert();
  useEffect(() => {
    if (!isOpen || !voucherId) return;
    const fetchData = async () => {
      setLoading(false);
      try {
        const [voucherRes, categoryRes] = await Promise.all([
          getVoucherById(voucherId),
          getAllCategory({ all: true, filter: "isActive==1 and type==1" }),
        ]);
        setVoucher(voucherRes?.data?.data);
        setRoomTypes(categoryRes.content || []);
      } catch (err: any) {
        showAlert({
          title: err?.response?.data?.message || "Load voucher failed",
          type: "error",
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, voucherId]);
  const status = useMemo(() => {
    if (!voucher) return "inactive";

    if (!voucher.isActive) return "inactive";

    const now = new Date();
    const start = voucher.startDate ? new Date(voucher.startDate) : null;
    const end = voucher.endDate ? new Date(voucher.endDate) : null;

    if (start && now < start) return "upcoming";
    if (end && now > end) return "expired";
    return "active";
  }, [voucher]);
  const StatusBadge = ({ status }: { status: string }) => {
    const map: any = {
      active: {
        label: t("voucher.view.statusActive"),
        className: "bg-green-100 text-green-700",
      },
      inactive: {
        label: t("voucher.view.statusInactive"),
        className: "bg-gray-200 text-gray-600",
      },
      expired: {
        label: t("voucher.view.statusExpired"),
        className: "bg-red-100 text-red-700",
      },
      upcoming: {
        label: t("voucher.view.statusUpcoming"),
        className: "bg-yellow-100 text-yellow-700",
      },
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status].className}`}
      >
        {map[status].label}
      </span>
    );
  };
  if (!isOpen) return <></>;
  const handleCancel = ()=>{
    setVoucher(null);
    setRoomTypes([])
    onClose();
  };
  return (
    <CommonModalView
      isOpen={isOpen}
      onClose={handleCancel}
      title={t("voucher.view.title")}
      width="w-[95vw] sm:w-[90vw] lg:w-[1000px]"
      isBorderBottom
    >
      {loading || !voucher ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E3E7F2] bg-white p-5 space-y-3">
              <h3 className="text-lg font-semibold text-[#1F2945]">
                {t("voucher.view.generalInformation")}
              </h3>
              <div className="h-px bg-[#EEF0F7]" />
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.status")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {status ? <StatusBadge status={status} /> : "-"}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.voucherName")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.voucherName ? voucher.voucherName : "-"}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.voucherCode")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.voucherCode ? voucher.voucherCode : "-"}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.description")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.description ? voucher.description : "-"}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#E3E7F2] bg-white p-5 space-y-3">
              <h3 className="text-lg font-semibold text-[#1F2945]">
                {t("voucher.view.validityRange")}
              </h3>
              <div className="h-px bg-[#EEF0F7]" />
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.startDate")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.startDate ? voucher.startDate : "-"}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.endDate")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.endDate ? voucher.endDate : "-"}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#E3E7F2] bg-white p-5 space-y-3">
              <h3 className="text-lg font-semibold text-[#1F2945]">
                {t("voucher.view.stackRules")}
              </h3>
              <div className="h-px bg-[#EEF0F7]" />
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.stackWithPromotion")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.stackWithPromotion
                    ? t("voucher.view.yes")
                    : t("voucher.view.no")}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.stackWithOtherVoucher")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.stackWithOtherVoucher
                    ? t("voucher.view.yes")
                    : t("voucher.view.no")}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.priority")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.priority || "-"}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E3E7F2] bg-white p-5 space-y-3">
              <h3 className="text-lg font-semibold text-[#1F2945]">
                {t("voucher.view.discountInformation")}
              </h3>
              <div className="h-px bg-[#EEF0F7]" />
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.discountType")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {t(VOUCHER_TYPE[Number(voucher.type)])}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.discountValue")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.value ? voucher.value : "-"}
                </div>
              </div>
              {voucher.type === "2" && (
                <div className="grid grid-cols-12 gap-3 py-2">
                  <div className="col-span-4 text-sm font-medium text-[#253150]">
                    {t("voucher.view.maxDiscount")}
                  </div>
                  <div className="col-span-8 text-sm text-[#1F2945]">
                    {voucher.maxDiscountValue ? voucher.maxDiscountValue : "-"}
                  </div>
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-[#E3E7F2] bg-white p-5 space-y-3">
              <h3 className="text-lg font-semibold text-[#1F2945]">
                {t("voucher.view.usageRules")}
              </h3>
              <div className="h-px bg-[#EEF0F7]" />
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.bookingType")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {t(BOOKING_TYPE[Number(voucher.bookingType)])}
                </div>
              </div>
              <div className="grid grid-cols-12 gap-3 py-2">
                <div className="col-span-4 text-sm font-medium text-[#253150]">
                  {t("voucher.view.usagePerCustomer")}
                </div>
                <div className="col-span-8 text-sm text-[#1F2945]">
                  {voucher.usagePerCustomer
                    ? voucher.usagePerCustomer
                    : t("voucher.view.no")}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#E3E7F2] bg-white p-5 space-y-3">
              <h3 className="text-lg font-semibold text-[#1F2945]">
                {t("voucher.view.roomTypes")}
              </h3>
              <div className="h-px bg-[#EEF0F7]" />
              {roomTypes.map((room) => {
                const match = voucher.roomTypes.find(
                  (r: any) => r.roomTypeId === room.id,
                );
                const excluded = match?.excluded;
                return (
                  <span
                    key={room.id}
                    className={`inline-block mr-2 mb-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      excluded
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-400 border border-gray-200 opacity-70"
                    }`}
                  >
                    {room.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </CommonModalView>
  );
};
export default ViewVoucher;
