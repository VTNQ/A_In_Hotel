import React, { useEffect, useRef, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { getAll } from "@/service/api/Authenticate";
import type { UserResponse } from "@/type/UserResponse";
import { SelectField } from "../ui/select";
import { useAlert } from "../alert-context";
import { AddHotel } from "@/service/api/Hotel";
import { useNavigate } from "react-router-dom";
import type { HotelFormData } from "@/type/hotel.types";
import Breadcrumb from "../Breadcrumb";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";

/**
 * FormLayouts
 * - 4 thẻ form theo layout giống ảnh: Vertical, Vertical w/ icons, Horizontal, Horizontal w/ icons
 * - Tailwind only, icon bằng lucide-reactch
 * - Nút "Show Code" ở góc phải mỗi card (demo, chưa gắn hành động)
 */
export default function CreateHotel() {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const getUser = async () => {
    try {
      const response = await getAll({
        all: true,
        filter: "hotel.id=isnull=true and role.id==2",
      });
      setUsers(response.data.content);
    } catch (error) {
      console.log("Failed to fetch user:", error);
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    getUser();
  }, []);
  const [formData, setFormData] = useState<HotelFormData>({
    name: "",
    address: "",
    idUser: null,
    image: null as File | null,
    hotlines: [{ phone: "" }],
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        hotlines: formData.hotlines.filter((h) => h.phone.trim() !== ""),
      };
      const response = await AddHotel(payload);

      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      setFormData({
        name: "",
        address: "",
        idUser: null,
        image: null as File | null,
        hotlines: [{ phone: "" }],
      });
      navigate("/Home/hotel");
    } catch (error: any) {
      showAlert({
        title: t("hotel.hotelCreate.error"),
        description: error?.response.data.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("hotel.hotelCreate.title")}
          </h1>
          <Breadcrumb
            items={[
              { label: t("hotel.breadcrumb.home"), href: "/Home" },
              { label: t("hotel.breadcrumb.hotel"), href: "/Home/hotel" },
            ]}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto grid mt-5  grid-cols-1 gap-6 lg:grid-cols-1">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("hotel.hotelCreate.formTitle")}
            </h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="Hotel Name">
                  {t("hotel.hotelCreate.name")}
                </Label>
                <Input
                  value={formData.name}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, name: val.target.value }))
                  }
                  placeholder="Enter Name Hotel"
                />
              </div>
              <div>
                <Label htmlFor="Address">
                  {t("hotel.hotelCreate.address")}
                </Label>
                <Textarea
                  value={formData.address}
                  placeholder="Enter Address Hotel"
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: val.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#42578E]"
                  rows={3}
                />
              </div>
              <div>
                <SelectField<UserResponse>
                  items={users}
                  isRequired={true}
                  value={formData.idUser ? String(formData.idUser) : ""}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      idUser: val ? Number(val) : null,
                    }))
                  }
                  label={t("hotel.hotelCreate.manager")}
                  placeholder={t("hotel.hotelCreate.selectManager")}
                  description={t("hotel.hotelCreate.managerDesc")}
                  clearable
                  size="md"
                  getValue={(u) => String(u.id)}
                  getLabel={(u) => u.fullName ?? u.email ?? `User #${u.id}`}
                />
              </div>
              <div className="space-y-2">
                <label>{t("hotel.hotelCreate.hotlines")}</label>
                <div className="space-y-2">
                  {formData.hotlines.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={t("hotel.hotelCreate.hotlinePlaceholder")}
                        value={item.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => {
                            const hotlines = [...prev.hotlines];
                            hotlines[index] = { phone: value };
                            return { ...prev, hotlines };
                          });
                        }}
                      />
                      {formData.hotlines.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              hotlines: prev.hotlines.filter(
                                (_, i) => i !== index,
                              ),
                            }))
                          }
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      hotlines: [...prev.hotlines, { phone: "" }],
                    }))
                  }
                >
                  + {t("hotel.hotelCreate.addHotline")}
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  {t("hotel.hotelCreate.image")}
                </Label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setFormData((prev) => ({ ...prev, image: file }));
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
                        {t("hotel.hotelCreate.uploadHint")}
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

                <p className="text-xs text-slate-500">
                  {t("hotel.hotelCreate.uploadHint")}
                </p>
              </div>
              <Button type="submit"> {t("common.save")}</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
