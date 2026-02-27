import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createAsset } from "@/service/api/Asset";
import { getAllCategories } from "@/service/api/Categories";
import { getAllHotel } from "@/service/api/Hotel";
import { getRoom } from "@/service/api/Room";
import type { AssetForm } from "@/type/asset.types";
import type { HotelRow } from "@/type/hotel.types";
import { Upload, X } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateAssetPage = () => {
  const [formData, setFormData] = useState<AssetForm>({
    assetName: "",
    categoryId: "",
    hotelId: "",
    roomId: "",
    price: "",
    quantity: "",
    note: "",
    image: null,
  });
  const { showAlert } = useAlert();
  const [hotels, setHotels] = useState<HotelRow[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==3",
      });
      setCategories(response.content);
    } catch (err: any) {
      console.log(err);
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
  const fetchRooms = async (hotelId: string) => {
    if (!hotelId) {
      setRooms([]);
      return;
    }

    try {
      const response = await getRoom({
        all: true,
        filter: `hotel.id==${hotelId}`,
      });
      setRooms(response.data.content);
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchHotels();
    fetchCategories();
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const payload = {
        assetName: formData.assetName,
        categoryId: formData.categoryId,
        hotelId: formData.hotelId,
        roomId: formData.roomId,
        price: formData.price,
        quantity: formData.quantity,
        note: formData.note,
        image: formData.image,
      };
      const response = await createAsset(payload);
      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      setFormData({
        assetName: "",
        categoryId: "",
        hotelId: "",
        roomId: "",
        price: "",
        quantity: "",
        note: "",
        image: null,
      });
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message || t("asset.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchRooms(String(formData.hotelId));
    setFormData((prev) => ({ ...prev, roomId: "" }));
  }, [formData.hotelId]);
  const { t } = useTranslation();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("asset.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("asset.title"), href: "/Home/asset" },
            { label: t("asset.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div className="grid grid-cols-1  sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              {t("asset.name")} <span className="text-red-500">*</span>
            </label>
            <Input
              name="assetName"
              placeholder={t("asset.createOrUpdate.namePlaceHolder")}
              onChange={handleChange}
              value={formData.assetName}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("asset.hotel")} <span className="text-red-500">*</span>
            </label>
            <SelectField
              items={hotels}
              value={formData.hotelId}
              onChange={(v) => setFormData((prev) => ({ ...prev, hotelId: v }))}
              isRequired={true}
              placeholder={t("asset.createOrUpdate.hotelPlaceHolder")}
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("asset.room")} <span className="text-red-500">*</span>
            </label>
            <SelectField
              items={rooms}
              value={formData.roomId}
              onChange={(v) => setFormData((prev) => ({ ...prev, roomId: v }))}
              isRequired={true}
              placeholder={t("asset.createOrUpdate.roomPlaceHolder")}
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.roomNumber}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("asset.category")} <span className="text-red-500">*</span>
            </label>
            <SelectField
              items={categories}
              value={formData.categoryId}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, categoryId: v }))
              }
              isRequired={true}
              placeholder={t("asset.createOrUpdate.categoryPlaceHolder")}
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("asset.price")} <span className="text-red-500">*</span>
            </label>
            <Input
              name="price"
              placeholder={t("asset.createOrUpdate.pricePlaceHolder")}
              onChange={handleChange}
              value={formData.price}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("asset.quantity")} <span className="text-red-500">*</span>
            </label>
            <Input
              name="quantity"
              placeholder={t("asset.createOrUpdate.quantityPlaceHolder")}
              onChange={handleChange}
              value={formData.quantity}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("asset.createOrUpdate.note")}
          </label>
          <Textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder={t("asset.createOrUpdate.notePlaceholder")}
            rows={3}
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("asset.icon")}</label>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setFormData((prev) => ({
                  ...prev,
                  icon: file, // ✅ đúng field
                }));

                setImagePreview(URL.createObjectURL(file));
              }}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className="
                    relative overflow-hidden rounded-2xl border-2 border-dashed
                    border-slate-200 bg-slate-50
                    hover:border-slate-300 transition
                    cursor-pointer
                  "
            >
              {!imagePreview ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 sm:py-12">
                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <Upload className="h-5 w-5 text-slate-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {t("asset.createOrUpdate.uploadHint")}
                  </p>
                  <p className="text-xs text-slate-500">JPG, PNG</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-[220px] w-full object-cover sm:h-[280px]"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/70"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          
        </div>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/asset")}>
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
export default CreateAssetPage;
