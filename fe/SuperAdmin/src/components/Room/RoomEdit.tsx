import { type RoomEditProps, type RoomForm } from "@/type/Room.type";
import { useAlert } from "../alert-context";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { getRoomById, updateRoom } from "@/service/api/Room";
import { File_URL } from "@/setting/constant/app";
import { getAllHotel } from "@/service/api/Hotel";
import { getAllCategories } from "@/service/api/Categories";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { PictureInPicture } from "lucide-react";
import { Button } from "../ui/button";

const RoomEdit: React.FC<RoomEditProps> = ({
  open,
  roomId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState<RoomForm>({
    roomNumber: "",
    roomName: "",
    idRoomType: "",
    hotelId: "",
    capacity: "",
    defaultRate: "",
    floor: "",
    area: "",
    hourlyBasePrice: "",
    hourlyAdditionalPrice: "",
    overnightPrice: "",
    note: "",
    image: null,
    oldImages: [],
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [categories, setCategories] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [imagePreview, setPreviewReview] = useState<string[]>([]);
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==1",
      });
      setCategories(res.content);
    } catch (err: any) {
      console.error(err);
    }
  };
  const fetchHotels = async () => {
    try {
      const response = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      setHotels(response.data.content);
    } catch (err: any) {
      console.log(err);
    }
  };
  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const cleanOldImages = (formData.oldImages || []).map((img) =>
        img.replace(File_URL, ""),
      );

      const payload = {
        roomNumber: formData.roomNumber,
        roomName: formData.roomName,
        idRoomType: formData.idRoomType,
        capacity: formData.capacity,
        defaultRate: formData.defaultRate,
        floor: formData.floor,
        area: formData.area,
        note: formData.note,
        hourlyBasePrice: formData.hourlyBasePrice,
        hourlyAdditionalPrice: formData.hourlyAdditionalPrice,
        overnightPrice: formData.overnightPrice,
        hotelId: formData.hotelId,
        images: formData.image,
        oldImages: cleanOldImages,
      };
      const response = await updateRoom(Number(roomId), payload);
      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      setFormData({
        roomNumber: "",
        roomName: "",
        idRoomType: "",
        hotelId: "",
        capacity: "",
        defaultRate: "",
        floor: "",
        area: "",
        hourlyBasePrice: "",
        hourlyAdditionalPrice: "",
        overnightPrice: "",
        note: "",
        image: null,
        oldImages: [],
      });
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("room.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setFormData({
      roomNumber: "",
      roomName: "",
      idRoomType: "",
      hotelId: "",
      capacity: "",
      defaultRate: "",
      floor: "",
      area: "",
      hourlyBasePrice: "",
      hourlyAdditionalPrice: "",
      overnightPrice: "",
      note: "",
      image: null,
      oldImages: [],
    });
    onClose();
  };
  useEffect(() => {
    if (!open || !roomId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getRoomById(Number(roomId));
        const oldImages =
          response?.data?.data?.images?.map((img: any) => File_URL + img.url) ||
          [];
        setFormData({
          roomNumber: response?.data?.data?.roomNumber || "",
          roomName: response?.data?.data?.roomName || "",
          idRoomType: response?.data?.data?.idRoomType
            ? String(response.data.data.idRoomType)
            : null,
          hotelId: response?.data?.data?.hotelId
            ? String(response.data.data.hotelId)
            : null,
          capacity: response?.data?.data?.capacity || "",
          defaultRate: response?.data?.data?.defaultRate || "",
          floor: response?.data?.data?.floor || "",
          area: response?.data?.data?.area || "",
          hourlyBasePrice: response?.data?.data?.hourlyBasePrice || "",
          hourlyAdditionalPrice:
            response?.data?.data?.hourlyAdditionalPrice || "",
          overnightPrice: response?.data?.data?.overnightPrice || "",
          note: response?.data?.data?.note || "",
          image: null,
          oldImages: oldImages,
        });
        setPreviewReview(oldImages);
      } catch (err) {
        console.error("Failed to fetch room:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
    fetchCategories();
    fetchHotels();
  }, [open, roomId]);
  if (!open || !roomId) return null;
  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="
          p-0
          w-[calc(100vw-20px)] sm:w-full
          max-w-[96vw] sm:max-w-xl lg:max-w-3xl
          max-h-[90vh]
          overflow-y-auto
    custom-scrollbar

        "
      >
      <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("room.createOrUpdate.titleEdit")}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="overflow-y-auto custom-scrollbar px-6 py-5">
  {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#253150]/20 border-t-[#253150] rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.roomNumber")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  name="roomNumber"
                  placeholder={t("room.createOrUpdate.enterRoomNumber")}
                  onChange={handleChange}
                  value={formData.roomNumber}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.roomName")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  name="roomName"
                  placeholder={t("room.createOrUpdate.enterRoomName")}
                  onChange={handleChange}
                  value={formData.roomName}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.roomType")}
                  <span className="text-red-500">*</span>
                </label>
                <SelectField
                  items={categories}
                  value={formData.idRoomType}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, idRoomType: v }))
                  }
                  isRequired={true}
                  placeholder={t("room.createOrUpdate.selectRoomType")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.hotel")}
                  <span className="text-red-500">*</span>
                </label>
                <SelectField
                  items={hotels}
                  value={formData.hotelId}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, hotelId: v }))
                  }
                  isRequired={true}
                  placeholder={t("room.createOrUpdate.selectHotel")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.floor")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="floor"
                  placeholder={t("room.createOrUpdate.enterFloor")}
                  onChange={handleChange}
                  value={formData.floor}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.area")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="area"
                  placeholder={t("room.createOrUpdate.enterArea")}
                  onChange={handleChange}
                  value={formData.area}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.capacity")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="capacity"
                  placeholder={t("room.createOrUpdate.enterCapacity")}
                  onChange={handleChange}
                  value={formData.capacity}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.priceBase")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  name="hourlyBasePrice"
                  type="number"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  onChange={handleChange}
                  value={formData.hourlyBasePrice}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.priceExtraHour")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="hourlyAdditionalPrice"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  onChange={handleChange}
                  value={formData.hourlyAdditionalPrice}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.priceOvernight")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="overnightPrice"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  onChange={handleChange}
                  value={formData.overnightPrice}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.priceFullDay")}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="defaultRate"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  onChange={handleChange}
                  value={formData.defaultRate}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.note")}
                </label>
                <Textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder={t("room.createOrUpdate.notePlaceholder")}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">
                  {t("room.createOrUpdate.images")}
                </label>

                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (!files.length) return;

                      setFormData((prev) => ({
                        ...prev,
                        image: [...(prev.image ?? []), ...files],
                      }));

                      setPreviewReview((prev) => [
                        ...prev,
                        ...files.map((f) => URL.createObjectURL(f)),
                      ]);
                    }}
                  />

                  <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 hover:border-[#42578E] transition">
                    {imagePreview.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                          <PictureInPicture />
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                          {t("room.createOrUpdate.clickSelectImages")}
                        </p>
                        <p className="text-xs text-slate-400">
                          {t("room.createOrUpdate.selectFiles")}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imagePreview.map((src, idx) => (
                          <div
                            key={idx}
                            className="group relative overflow-hidden rounded-xl border bg-white shadow-sm"
                          >
                            <img
                              src={src}
                              alt={`preview-${idx}`}
                              className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                setPreviewReview((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                );

                                setFormData((prev) => ({
                                  ...prev,
                                  image: (prev.image ?? []).filter(
                                    (_, i) => i !== idx,
                                  ),
                                }));
                              }}
                              className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </div>
        )}
        </div>
      
      </DialogContent>
    </Dialog>
  );
};
export default RoomEdit;
