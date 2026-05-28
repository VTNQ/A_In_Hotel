import { getRoomById } from "@/service/api/Room";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Info from "./Info";
import PriceInfo from "./PriceInfo";
import { File_URL } from "@/setting/constant/app";
import { Button } from "@/components/ui/button";
import type { Room, ViewRoomProps } from "@/type/Room.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";

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
  }, [isOpen, roomId]);

  if (!isOpen || !roomId) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={(o: any) => !o && onClose()}>
      <DialogContent
        className="
          max-w-3xl
          p-6
          max-h-[90vh]
          overflow-y-auto
          custom-scrollbar

          bg-white
          border border-slate-200

          dark:bg-neutral-950
          dark:border-neutral-800
        "
      >
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle
            className="
              text-xl
              font-semibold

              text-slate-900
              dark:text-neutral-100
            "
          >
            {t("room.view.title")}
          </DialogTitle>
        </DialogHeader>

        {/* LOADING */}
        {loading ? (
          <div
            className="
              py-20
              text-center

              text-slate-500
              dark:text-neutral-400
            "
          >
            {t("common.loading")}
          </div>
        ) : (
          <Tabs defaultValue="info" className="mt-4">
            {/* TABS */}
            <TabsList
              className="
                mb-6

                bg-slate-100
                border border-slate-200

                dark:bg-neutral-900
                dark:border-neutral-800
              "
            >
              <TabsTrigger
                value="info"
                className="
                  text-slate-700
                  dark:text-neutral-300

                  data-[state=active]:bg-white
                  data-[state=active]:text-slate-900

                  dark:data-[state=active]:bg-neutral-950
                  dark:data-[state=active]:text-white
                "
              >
                {t("room.view.tabs.info")}
              </TabsTrigger>

              <TabsTrigger
                value="images"
                className="
                  text-slate-700
                  dark:text-neutral-300

                  data-[state=active]:bg-white
                  data-[state=active]:text-slate-900

                  dark:data-[state=active]:bg-neutral-950
                  dark:data-[state=active]:text-white
                "
              >
                {t("room.view.tabs.images")}
              </TabsTrigger>
            </TabsList>

            {/* TAB INFO */}
            <TabsContent value="info">
              <div
                className="
                  rounded-xl
                  p-5
                  space-y-6

                  bg-slate-50
                  border border-slate-200

                  dark:bg-neutral-900/50
                  dark:border-neutral-800
                "
              >
                {/* ROOM INFO */}
                <div className="grid grid-cols-2 gap-6">
                  <Info
                    label={t("room.roomName")}
                    value={room?.roomName}
                  />

                  <Info
                    label={t("room.roomNumber")}
                    value={room?.roomNumber}
                  />

                  <Info
                    label={t("room.code")}
                    value={room?.roomCode}
                  />

                  <Info
                    label={t("room.roomTypeName")}
                    value={room?.roomTypeName}
                  />

                  <Info
                    label={t("room.createOrUpdate.floor")}
                    value={room?.floor}
                  />

                  <Info
                    label={t("room.view.area")}
                    value={`${room?.area} m²`}
                  />

                  <Info
                    label={t("room.createOrUpdate.capacity")}
                    value={room?.capacity}
                  />
                </div>

                {/* PRICE */}
                <div
                  className="
                    rounded-xl
                    p-4
                    space-y-3

                    bg-white
                    border border-slate-200

                    dark:bg-neutral-950
                    dark:border-neutral-800
                  "
                >
                  <PriceInfo
                    label={t("room.view.first2Hours")}
                    value={room?.hourlyBasePrice}
                  />

                  <PriceInfo
                    label={t("room.view.extraHour")}
                    value={room?.hourlyAdditionalPrice}
                  />

                  <PriceInfo
                    label={t("room.view.overnight")}
                    value={room?.overnightPrice}
                  />

                  <PriceInfo
                    label={t("room.view.dayNight")}
                    value={room?.defaultRate}
                  />
                </div>

                {/* NOTE */}
                <div>
                  <h4
                    className="
                      mb-1
                      font-medium

                      text-slate-900
                      dark:text-neutral-100
                    "
                  >
                    {t("room.createOrUpdate.note")}
                  </h4>

                  <p
                    className="
                      text-slate-600
                      dark:text-neutral-400
                    "
                  >
                    {room?.note || t("room.view.noNote")}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB IMAGES */}
            <TabsContent value="images">
              {room?.images?.length ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {room.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="
                        overflow-hidden
                        rounded-xl

                        bg-white
                        border border-slate-200

                        dark:bg-neutral-950
                        dark:border-neutral-800
                      "
                    >
                      <img
                        src={File_URL + img?.url}
                        alt={`room-${idx}`}
                        className="
                          h-40
                          w-full
                          object-cover
                          transition-transform
                          duration-300
                          hover:scale-105
                        "
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className="
                    py-10
                    text-center

                    text-slate-500
                    dark:text-neutral-400
                  "
                >
                  {t("common.noImage")}
                </p>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* FOOTER */}
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRoomInformation;