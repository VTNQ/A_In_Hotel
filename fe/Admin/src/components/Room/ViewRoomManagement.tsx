import { useEffect, useState } from "react";
import { File_URL } from "../../setting/constant/app";
import type { ViewRoomManagementProps } from "../../type";
import CommonModalView from "../ui/CommonModalView";
import { findById } from "../../service/api/Room";
import { useTranslation } from "react-i18next";

const ViewRoomManagement = ({ isOpen, onClose, roomId }: ViewRoomManagementProps) => {
    const [activeTab, setActiveTab] = useState("info");
    const [roomData, setRoomData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        if (isOpen && roomId) {
            fetchRoom(roomId);
        }
    }, [isOpen, roomId]);
    const fetchRoom = async (id: number) => {
        try {
            setLoading(true);
            const response = await findById(id);
            setRoomData(response.data.data || null);
        } finally {
            setLoading(false)
        }
    }
    const images: string[] = roomData?.images?.map((img: { url: string }) => File_URL + img.url) || [];
    useEffect(() => {
        if (images.length > 0) setSelectedImage(images[0]);
    }, [roomData]);
    const tabs = [
        { key: "info", label: t("room.view.tabs.info") },
        { key: "images", label: t("room.view.tabs.images") }
    ]
    const [selectedImage, setSelectedImage] = useState(images[0]);
    if (!roomData) return null;
    const handleCloseModal = () => {
        setActiveTab("info");
        onClose();
    }
    return (
        <CommonModalView
            isOpen={isOpen}
            onClose={handleCloseModal}
            title={t("room.view.title")}
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            width="w-[574px]"
        >
            {loading && (
                <div className="animate-pulse mt-3 space-y-4">
                    <div className="h-4 w-40 bg-gray-300 rounded"></div>

                    <div className="grid grid-cols-[150px_1fr] gap-y-4">
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                        <div className="h-4 w-40 bg-gray-300 rounded"></div>

                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-300 rounded"></div>

                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    </div>

                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                </div>
            )}
            {!loading && roomData && (
                <>
                    {activeTab === "info" && (
                        <>
                            <div className="bg-[#EEF0F7] w-full py-6  px-5 rounded-xl text-[14px] text-[#4A4A4A]">

                                {/* GRID 3 COLUMNS: LEFT | LINE | RIGHT */}
                                <div className="grid grid-cols-[2fr_5%_2fr] gap-6">

                                    {/* LEFT COLUMN */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#253150]">{t("room.roomName")}</span>
                                            <span>{roomData.roomName}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#253150]">{t("room.code")}</span>
                                            <span>{roomData.roomCode}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#253150]">{t("room.createOrUpdate.floor")}</span>
                                            <span>{roomData.floor}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#253150]">{t("room.createOrUpdate.capacity")}</span>
                                            <span>{roomData.capacity}</span>
                                        </div>
                                    </div>

                                    {/* CENTER VERTICAL LINE */}
                                    <div className="w-[1px] bg-gray-300 mx-auto"></div>

                                    {/* RIGHT COLUMN */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#2E3451]">{t("room.roomNumber")}</span>
                                            <span>{roomData.roomNumber}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#2E3451]">{t("room.roomTypeName")}</span>
                                            <span>{roomData.roomType?.name || "Deluxe"}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#2E3451]">{t("room.view.area")}</span>
                                            <span>{roomData.area}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold text-[#2E3451]">{t("room.view.facilities")}</span>
                                            <span>{roomData.facilities || "Electronics"}</span>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="mt-2 bg-[#EEF0F7] w-full py-4 px-5 rounded-xl text-[14px] text-[#2E3451]">
                                <div className="grid grid-cols-[2fr_1fr] gap-y-4">
                                    <div>
                                        <span className="font-semibold">{t("room.price")}</span>
                                        <span className="ml-2 text-gray-500">{t("room.first2Hours")}</span>
                                    </div>
                                    <div className="text-right  text-[#2B2B2B]" style={{ fontWeight: '400' }}>
                                        {Number(roomData.hourlyBasePrice).toLocaleString("vi-VN")} VND
                                    </div>
                                    <div>
                                        <span className="font-semibold">{t("room.price")}</span>
                                        <span className="ml-2 text-gray-500">{t("room.extraHour")}</span>
                                    </div>
                                    <div className="text-right font-semibold text-[#2B2B2B]" style={{ fontWeight: '400' }}>
                                        {Number(roomData.hourlyAdditionalPrice).toLocaleString("vi-VN")} VND
                                    </div>
                                    <div>
                                        <span className="font-semibold">{t("room.price")}</span>
                                        <span className="ml-2 text-gray-500">{t("room.overnight")}</span>
                                    </div>
                                    <div className="text-right font-semibold text-[#2B2B2B]" style={{ fontWeight: '400' }}>
                                        {Number(roomData.overnightPrice).toLocaleString("vi-VN")} VND
                                    </div>
                                    <div>
                                        <span className="font-semibold">{t("room.price")}</span>
                                        <span className="ml-2 text-gray-500">{t("room.dayNight")}</span>
                                    </div>
                                    <div className="text-right font-semibold text-[#2B2B2B]" style={{ fontWeight: '400' }}>
                                        {Number(roomData.defaultRate).toLocaleString("vi-VN")} VND
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 ml-2">
                                <h3 className="font-semibold text-[#253150] mb-2">{t("room.createOrUpdate.note")}</h3>
                                <p className="text-[#2B2B2B] leading-relaxed text-[14px]">
                                    {roomData.note || t("room.view.noNote")}
                                </p>
                                <div className="mt-4 border-b border-dotted border-gray-400"></div>
                            </div>
                        </>

                    )}
                    {activeTab === "images" && (
                        <div className="w-full">

                            {/* MAIN IMAGE */}
                            <div className="w-full h-[260px] rounded-xl overflow-hidden mb-1">
                                <img
                                    src={selectedImage || images[0]}
                                    className="w-full h-full object-cover"
                                    alt={t("room.view.imagePreview")}
                                />
                            </div>

                            {/* THUMBNAILS */}
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.slice(1).map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        onClick={() => setSelectedImage(img)}
                                        className={`
            w-[150px] h-[90px] 
            rounded-lg object-cover cursor-pointer 
            
            transition
            ${selectedImage === img ? " shadow-md" : ""}
          `}
                                    />
                                ))}

                            </div>
                            <div className="mt-4 border-b border-dotted border-gray-400"></div>
                        </div>
                    )}
                </>

            )}


        </CommonModalView>
    )
}
export default ViewRoomManagement;