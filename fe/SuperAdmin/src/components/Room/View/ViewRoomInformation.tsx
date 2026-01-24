import { getRoomById } from "@/service/api/Room";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Info from "./Info";
import PriceInfo from "./PriceInfo";
import { File_URL } from "@/setting/constant/app";
import { Button } from "@/components/ui/button";
import type { Room, ViewRoomProps } from "@/type/Room.type";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

const ViewRoomInformation: React.FC<ViewRoomProps> = ({
  isOpen,
  onClose,
  roomId,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  useEffect(() => {
    if (!isOpen || !roomId) return;
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await getRoomById(roomId);
        setRoom(res?.data?.data ?? null);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  },[isOpen,roomId]);
  if(!open || !roomId) return <></>
  return(
    <Dialog open={isOpen} onOpenChange={(o:any) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("room.view.title")}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-20 text-center">{t("common.loading")}</div>
        ) : (
          <Tabs defaultValue="info" className="mt-4">
            <TabsList className="mb-6">
              <TabsTrigger value="info">{t("room.view.tabs.info")}</TabsTrigger>
              <TabsTrigger value="images">{t("room.view.tabs.images")}</TabsTrigger>
            </TabsList>

            {/* ===== TAB THÔNG TIN ===== */}
            <TabsContent value="info">
              <div className="rounded-xl bg-slate-50 p-5 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Info label={t("room.roomName")} value={room?.roomName} />
                  <Info label={t("room.roomNumber")} value={room?.roomNumber} />
                  <Info label={t("room.code")} value={room?.roomCode} />
                  <Info label={t("room.roomTypeName")} value={room?.roomTypeName} />
                  <Info label={t("room.createOrUpdate.floor")} value={room?.floor} />
                  <Info label={t("room.view.area")} value={`${room?.area} m²`} />
                  <Info label={t("room.createOrUpdate.capacity")} value={room?.capacity} />
                </div>

                <div className="rounded-xl bg-white p-4 space-y-3">
                  <PriceInfo label={t("room.view.first2Hours")} value={room?.hourlyBasePrice} />
                  <PriceInfo label={t("room.view.extraHour")} value={room?.hourlyAdditionalPrice} />
                  <PriceInfo label={t("room.view.overnight")} value={room?.overnightPrice} />
                  <PriceInfo label={t("room.view.dayNight")} value={room?.defaultRate} />
                </div>

                <div>
                  <h4 className="font-medium mb-1">{t("room.createOrUpdate.note")}</h4>
                  <p className="text-gray-600">{room?.note || t("room.view.noNote")}</p>
                </div>
              </div>
            </TabsContent>

            {/* ===== TAB HÌNH ẢNH ===== */}
            <TabsContent value="images">
              {room?.images?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={File_URL + img?.url}
                      alt={`room-${idx}`}
                      className="h-40 w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">
                  {t("common.noImage")}
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>{t("common.close")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
};
export default ViewRoomInformation;