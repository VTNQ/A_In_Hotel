import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategories } from "@/service/api/Categories";
import { getAllHotel } from "@/service/api/Hotel";
import { createRoom } from "@/service/api/Room";
import type { RoomForm } from "@/type/Room.type";
import { PictureInPicture } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateRoomPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const { showAlert } = useAlert();
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
  });
  const [imagePreview, setPreviewReview] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
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
      };

      const response = await createRoom(payload);
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
      });
      setPreviewReview([]);
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message || t("room.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };
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
  useEffect(() => {
    fetchCategories();
    fetchHotels();
  }, []);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("room.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("room.title"), href: "/Home/room" },
            { label: t("room.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
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
              onChange={(v) => setFormData((prev) => ({ ...prev, hotelId: v }))}
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
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/room")}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="min-w-[140px]"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                {t("common.saving")}
              </span>
            ) : (
              t("common.save")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreateRoomPage;
