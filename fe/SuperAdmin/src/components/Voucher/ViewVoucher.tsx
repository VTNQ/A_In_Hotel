import { getAllCategories } from "@/service/api/Categories";
import { getVoucherById } from "@/service/api/Voucher";
import {
  BOOKING_TYPE,
  VOUCHER_TYPE,
  type ViewVoucherProps,
} from "@/type/voucher.types";
import { useEffect, useMemo, useState } from "react";
import { useAlert } from "../alert-context";
import { useTranslation } from "react-i18next";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const ViewVoucher = ({ isOpen, onClose, voucherId }: ViewVoucherProps) => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [voucher, setVoucher] = useState<any | null>(null);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!isOpen || !voucherId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [voucherRes, categoryRes] = await Promise.all([
          getVoucherById(voucherId),
          getAllCategories({ all: true, filter: "isActive==1 and type==1" }),
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

  /* ================= STATUS ================= */
  const status = useMemo(() => {
    if (!voucher || !voucher.isActive) return "inactive";

    const now = new Date();
    const start = voucher.startDate ? new Date(voucher.startDate) : null;
    const end = voucher.endDate ? new Date(voucher.endDate) : null;

    if (start && now < start) return "upcoming";
    if (end && now > end) return "expired";
    return "active";
  }, [voucher]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent size="xl" className="p-0 max-h-[90vh] flex flex-col">
        {/* ================= HEADER ================= */}
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>{t("voucher.view.title")}</DialogTitle>
        </DialogHeader>

        {/* ================= BODY (SCROLL) ================= */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#3B5CCC]/20 border-t-[#3B5CCC] rounded-full animate-spin" />
              <span className="ml-3 text-sm text-slate-500">
                {t("common.loading")}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ================= LEFT ================= */}
              <div className="space-y-6">
                {/* GENERAL */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                  <h3 className="text-base font-semibold text-[#253150]">
                    {t("voucher.view.generalInformation")}
                  </h3>

                  <div className="grid grid-cols-12 gap-3 text-sm">
                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.status")}
                    </div>
                    <div className="col-span-8">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border
                        ${
                          status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : status === "expired"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : status === "upcoming"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {t(
                          `voucher.view.status${
                            status[0].toUpperCase() + status.slice(1)
                          }`,
                        )}
                      </span>
                    </div>

                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.voucherName")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {voucher?.voucherName || "-"}
                    </div>

                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.voucherCode")}
                    </div>
                    <div className="col-span-8 font-mono text-[#253150]">
                      {voucher?.voucherCode || "-"}
                    </div>

                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.description")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {voucher?.description || "-"}
                    </div>
                  </div>
                </div>

                {/* DATE */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                  <h3 className="text-base font-semibold text-[#253150]">
                    {t("voucher.view.validityRange")}
                  </h3>

                  <div className="grid grid-cols-12 gap-3 text-sm">
                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.startDate")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {voucher?.startDate || "-"}
                    </div>

                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.endDate")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {voucher?.endDate || "-"}
                    </div>
                  </div>
                </div>

                {/* STACK */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                  <h3 className="text-base font-semibold text-[#253150]">
                    {t("voucher.view.stackRules")}
                  </h3>

                  <div className="grid grid-cols-12 gap-3 text-sm">
                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.stackWithPromotion")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {voucher?.stackWithPromotion
                        ? t("voucher.view.yes")
                        : t("voucher.view.no")}
                    </div>

                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.stackWithOtherVoucher")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {voucher?.stackWithOtherVoucher
                        ? t("voucher.view.yes")
                        : t("voucher.view.no")}
                    </div>

                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.priority")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {voucher?.priority || "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT ================= */}
              <div className="space-y-6">
                {/* DISCOUNT */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                  <h3 className="text-base font-semibold text-[#253150]">
                    {t("voucher.view.discountInformation")}
                  </h3>

                  <div className="grid grid-cols-12 gap-3 text-sm">
                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.discountType")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {t(VOUCHER_TYPE[Number(voucher?.type)])}
                    </div>

                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.discountValue")}
                    </div>
                    <div className="col-span-8 font-semibold text-[#253150]">
                      {voucher?.value || "-"}
                    </div>

                    {voucher?.type === "2" && (
                      <>
                        <div className="col-span-4 text-slate-500">
                          {t("voucher.view.maxDiscount")}
                        </div>
                        <div className="col-span-8 text-[#253150]">
                          {voucher?.maxDiscountValue || "-"}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* USAGE */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                  <h3 className="text-base font-semibold text-[#253150]">
                    {t("voucher.view.usageRules")}
                  </h3>

                  <div className="grid grid-cols-12 gap-3 text-sm">
                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.bookingType")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {t(BOOKING_TYPE[Number(voucher?.bookingType)])}
                    </div>

                    <div className="col-span-4 text-slate-500">
                      {t("voucher.view.usagePerCustomer")}
                    </div>
                    <div className="col-span-8 text-[#253150]">
                      {voucher?.usagePerCustomer || t("voucher.view.no")}
                    </div>
                  </div>
                </div>

                {/* ROOM TYPES */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
                  <h3 className="text-base font-semibold text-[#253150]">
                    {t("voucher.view.roomTypes")}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {roomTypes.map((room) => {
                      const match = voucher.roomTypes.find(
                        (r: any) => r.roomTypeId === room.id,
                      );
                      const excluded = match?.excluded;

                      return (
                        <span
                          key={room.id}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            excluded
                              ? "bg-[#3B5CCC]/10 text-[#3B5CCC]"
                              : "bg-slate-100 text-slate-400 line-through"
                          }`}
                        >
                          {room.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <Button variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewVoucher;
