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

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Label } from "recharts";

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
    }finally{
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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("asset.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("common.category"), href: "/Home/category" },
            { label: t("category.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
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

          <div className="relative w-48">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
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

            <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center hover:border-[#42578E]">
              {!imagePreview ? (
                <>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                    <svg
                      className="h-6 w-6 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13.5l4.5-4.5a2.25 2.25 0 013.182 0L15 13.5"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    {t("asset.createOrUpdate.uploadHint")}
                  </p>
                  <p className="text-xs text-slate-400">JPG, PNG</p>
                </>
              ) : (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({
                        ...prev,
                        icon: null,
                      }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
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
