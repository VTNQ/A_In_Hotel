import { getPromotionById } from "@/service/api/Promotion";
import {
  PROMOTION_TYPE_I18N,
  type Promotion,
  type ViewPromotionProps,
} from "@/type/Promotion.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CheckCircle, Percent, Wallet, XCircle } from "lucide-react";
import { getBookingTypeLabelKey } from "@/util/util";
import { Button } from "../ui/button";

const ViewPromotionModal = ({
  isOpen,
  onClose,
  promotionId,
}: ViewPromotionProps) => {
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState<Promotion | null>(null);
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
  if (!isOpen || !promotionId) return <></>;
  return (
    <Dialog  open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent size="lg" className=" p-6 max-h-[85vh] custom-scrollbar overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("promotion.promotionDetail")}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <>
          <div className="flex-1 overflow-y-auto  py-6 space-y-10 ">
            <section>
              <h3 className="text-[#3B5CCC] text-base font-bold">
                {t("promotion.view.general")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                    {t("promotion.name")}
                  </p>
                  <p className="text-base">{promotion?.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                    {t("promotion.code")}
                  </p>
                  <p className="font-mono tracking-widest font-bold">
                    {promotion?.code}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                    {t("promotion.description")}
                  </p>
                  <p>{promotion?.description}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                    {t("promotion.priority")}
                  </p>
                  <p>
                    {" "}
                    {t("promotion.priorityLevel", {
                      level: promotion?.priority,
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-b border-dotted border-gray-400"></div>
            </section>
            <section>
              <h3 className="text-primary text-lg font-bold mb-4">
                {t("promotion.view.offer")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                    {t("promotion.offer.type")}
                  </p>
                  <p>{t(PROMOTION_TYPE_I18N[Number(promotion?.type)])}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                    {t("promotion.offer.value")}
                  </p>
                  <p className="flex items-center gap-2 text-lg font-semibold text-[#253150]">
                    {promotion?.type === 1 ? (
                      <>
                        <Percent size={16} className="text-[#3B5CCC]" />
                        <span>{promotion?.value}%</span>
                      </>
                    ) : (
                      <>
                        <Wallet size={16} className="text-[#3B5CCC]" />
                        <span>
                          {Number(promotion?.value).toLocaleString()} VND
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </section>
            <section  className="space-y-6">
              <h3 className="text-[#3B5CCC] text-lg font-bold mb-4">
                  {t("promotion.view.date")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                    {t("promotion.startDate")}
                  </p>
                  <p>{promotion?.startDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                  {t("promotion.endDate")}
                  </p>
                  <p>{promotion?.endDate}</p>
                </div>
              </div>

              <div className="mt-4 border-b border-dotted border-gray-400"></div>
            </section>
            <section>
              <h3 className="text-[#3B5CCC] text-lg font-bold mb-4">
                {t("promotion.view.conditions")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase text-gray-500 font-semibold">
                     {t("promotion.bookingType")}
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
                     {t("promotion.minNights")}
                  </p>
                  <p> {promotion?.minNights ?? 0}{" "}
                    {t("promotion.nights")}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs uppercase text-[#253150] font-semibold">
                   {t("promotion.customerSegment")}
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
                {t("promotion.view.roomTypes")}
              </h3>
              <div className="rounded-lg border overflow-hidden border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs uppercase">
                         {t("promotion.roomType")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs uppercase">
                            {t("promotion.view.status")}
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
                               {t("common.included")}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-500 font-semibold">
                                <XCircle size={16} />
                              {t("common.excluded")}
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
           <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                {t("common.close")}
              </Button>
            </DialogFooter>
          </>
          
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ViewPromotionModal;