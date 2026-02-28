import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategories } from "@/service/api/Categories";
import { addExtraService } from "@/service/api/facilities";
import { getAllHotel } from "@/service/api/Hotel";
import { type ExtraServiceForm } from "@/type/extraService.types";
import {  useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateExtraServicePage = () => {
  const [formData, setFormData] = useState<ExtraServiceForm>({
    name: "",
    description: "",
    categoryId: "",
    unit: "",
    price: "",
    type: "",
    extraCharge: "",
    note: "",
    hotelId: "",
    icon: null,
  });
  const { showAlert } = useAlert();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==2",
      });
      setCategories(res.content || []);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchHotels = async () => {
    try {
      const res = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      console.log(res)
      setHotels(res?.data?.content || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchHotels();
  }, []);
  const { t } = useTranslation();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const payload = {
        serviceName: formData.name.trim(),
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        unit: formData.unit?.trim() ?? "",
        description: formData.description.trim(),
        isActive: true,
        note: formData.note.trim(),
        extraCharge: formData.extraCharge,
        image: formData.icon,
        type: 2,
        hotelId: formData.hotelId,
      };
      const response = await addExtraService(payload);
      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        unit: "",
        price: "",
        type: "",
        extraCharge: "",
        note: "",
        hotelId: "",
        icon: null,
      });
      setImagePreview(null)
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          t("extraService.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("extraService.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("extraService.title"), href: "/Home/service" },
            { label: t("extraService.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              {t("extraService.name")} <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              placeholder={t("extraService.createOrUpdate.namePlaceHolder")}
              onChange={handleChange}
              value={formData.name}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("extraService.description")}{" "}
            </label>
            <Input
              name="description"
              placeholder={t(
                "extraService.createOrUpdate.descriptionPlaceHolder",
              )}
              onChange={handleChange}
              value={formData.description}
              className="mt-1"
            />
          </div>
          <SelectField
            label={t("extraService.category")}
            items={categories}
            value={formData.categoryId}
            onChange={(v) =>
              setFormData((prev) => ({ ...prev, categoryId: v }))
            }
            isRequired={true}
            placeholder={t("facility.form.categoryPlaceholder")}
            getValue={(i) => i.id}
            getLabel={(i) => i.name}
          />
          <SelectField
            label={t("extraService.unit")}
            items={[
              {
                label: "Per Night",
                value: "PERNIGHT",
              },
              {
                label: "Per Day",
                value: "PERDAY",
              },
              {
                label: "Per Use",
                value: "PERUSE",
              },
              {
                label: "Per Hour",
                value: "PERHOUR",
              },
            ]}
            value={formData.unit}
            onChange={(v) => setFormData((prev) => ({ ...prev, unit: v }))}
            isRequired={true}
            placeholder={t("extraService.createOrUpdate.defaultUnit")}
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
          />
          <div>
            <label className="text-sm font-medium">
              {t("extraService.price")} <span className="text-red-500">*</span>
            </label>
            <Input
              name="price"
              placeholder="Enter service price"
              onChange={handleChange}
              value={formData.price}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("extraService.extraCharge")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              name="extraCharge"
              placeholder="Enter extra charge"
              onChange={handleChange}
              value={formData.extraCharge}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("extraService.hotel")} <span className="text-red-500">*</span>
          </label>
          <SelectField
            items={hotels}
            value={formData.hotelId}
            onChange={(v) => setFormData((prev) => ({ ...prev, hotelId: v }))}
            isRequired={true}
            placeholder={t("extraService.createOrUpdate.hotelPlaceHolder")}
            getValue={(i) => i.id}
            getLabel={(i) => i.name}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("extraService.note")}
          </label>
          <Textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder={t("common.notePlaceholder")}
            rows={3}
            className="mt-1"
          />
        </div>
        <div className="space-y-2">
          <Label>{t("extraService.icon")}</Label>

          <div className="relative lg:w-48">
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
                    {t("extraService.createOrUpdate.uploadHint")}
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
          <Button variant="outline" onClick={() => navigate("/Home/service")}>
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
export default CreateExtraServicePage;
