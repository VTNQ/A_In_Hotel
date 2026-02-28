import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HotelEditProps, HotelFormData } from "@/type/hotel.types";
import type { UserResponse } from "@/type/UserResponse";
import type { Status } from "@/type/common";

import { useAlert } from "../alert-context";
import { useTranslation } from "react-i18next";

import { getAll } from "@/service/api/Authenticate";
import { getHotelById, updateHotel } from "@/service/api/Hotel";
import { File_URL } from "@/setting/constant/app";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SelectField } from "../ui/select";
import { Button } from "../ui/button";

import { Plus, Trash2, Upload, X } from "lucide-react";

const HotelEditModal: React.FC<HotelEditProps> = ({
  open,
  hotelId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<HotelFormData>({
    name: "",
    address: "",
    idUser: null,
    image: null as File | null,
    hotlines: [],
  });

  // cleanup blob preview
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      idUser: null,
      image: null as File | null,
      hotlines: [],
    });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchUsers = async () => {
    try {
      const response = await getAll({ all: true, filter: "role.id==2" });
      setUsers(response?.data?.content || []);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    if (!open || !hotelId) return;

    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getHotelById(Number(hotelId));
        const d = response?.data?.data;

        setFormData({
          name: d?.name || "",
          address: d?.address || "",
          idUser: d?.idUser ?? null,
          image: null as File | null,
          hotlines: d?.hotlines?.map((h: any) => ({ phone: h.phone })) || [],
        });

        setImagePreview(d?.thumbnail?.url ? File_URL + d.thumbnail.url : null);
      } catch (err) {
        console.error("Failed to fetch hotel:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchUsers();
    fetchData();
  }, [open, hotelId]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePickFile = () => {
    if (imagePreview) return;
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (loading || !hotelId) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        address: formData.address,
        idUser: formData.idUser,
        image: formData.image,
        hotlines: formData.hotlines.filter((h) => h.phone.trim() !== ""),
      };

      const response = await updateHotel(Number(hotelId), payload);

      showAlert({
        title: response?.data?.message ?? t("hotel.hotelEdit.updateSuccess"),
        type: "success",
        autoClose: 3500,
      });

      handleClose();
      onSubmit();
    } catch (err: any) {
      showAlert({
        title: t("hotel.hotelEdit.updateError"),
        description:
          err?.response?.data?.message || err?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="
          p-0
          w-[calc(100vw-20px)] sm:w-full
          max-w-[96vw] sm:max-w-xl lg:max-w-2xl
          max-h-[90vh]
        overflow-y-auto
    custom-scrollbar
        "
      >
        {/* Header sticky */}
        <div className="sticky top-0 z-10 border-b bg-white">
          <DialogHeader className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {t("hotel.hotelEdit.title")}
                </DialogTitle>
                <p className="mt-1 text-sm text-slate-500">
                  {t("hotel.hotelEdit.managerDesc")}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="custom-scrollbar overflow-y-auto px-5 py-4">
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
              <span className="ml-3 text-sm text-slate-500">
                {t("hotel.hotelEdit.loading")}
              </span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Grid form */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {t("hotel.hotelEdit.name")}
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder={t("hotel.hotelEdit.name")}
                    className="h-10"
                  />
                </div>

                {/* Manager */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {t("hotel.hotelEdit.manager")} <span className="text-red-500">*</span>
                  </label>
                  <SelectField<UserResponse>
                    items={users}
                    isRequired
                    value={formData.idUser != null ? String(formData.idUser) : null}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        idUser: val ? Number(val) : null,
                      }))
                    }
                    placeholder={t("hotel.hotelEdit.chooseManager")}
                    clearable
                    size="md"
                    fullWidth
                    getValue={(u) => String(u.id)}
                    getLabel={(u) => u.fullName ?? u.email ?? `User #${u.id}`}
                  />
                </div>

                {/* Address */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    {t("hotel.hotelEdit.address")}
                  </label>
                  <Textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, address: e.target.value }))
                    }
                    placeholder={t("hotel.hotelEdit.address")}
                    className="min-h-[96px]"
                  />
                </div>

                {/* Hotlines */}
                <div className="space-y-3 lg:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-700">
                      {t("hotel.hotelEdit.hotlines")}
                    </label>
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-9 gap-2"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          hotlines: [...prev.hotlines, { phone: "" }],
                        }))
                      }
                    >
                      <Plus className="h-4 w-4" />
                      {t("hotel.hotelEdit.addHotline")}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.hotlines.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        {t("hotel.hotelEdit.hotlinePlaceholder")}
                      </div>
                    ) : (
                      formData.hotlines.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center"
                        >
                          <Input
                            className="h-10 w-full"
                            placeholder={t("hotel.hotelEdit.hotlinePlaceholder")}
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
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 w-full sm:w-12"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                hotlines: prev.hotlines.filter((_, i) => i !== index),
                              }));
                            }}
                            aria-label="Remove hotline"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Image */}
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-sm font-medium text-slate-700">
                    {t("hotel.hotelEdit.image")}
                  </label>

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
                    onClick={handlePickFile}
                    className="
                      relative overflow-hidden rounded-2xl border-2 border-dashed
                      border-slate-200 bg-slate-50
                      hover:border-slate-300
                      transition
                      cursor-pointer
                    "
                  >
                    {!imagePreview ? (
                      <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 sm:py-12">
                        <div className="rounded-full bg-white p-3 shadow-sm">
                          <Upload className="h-5 w-5 text-slate-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          {t("hotel.hotelEdit.uploadHint")}
                        </p>
                        <p className="text-xs text-slate-500">
                          PNG, JPG • (click to upload)
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-[220px] w-full object-cover sm:h-[260px]"
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
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-5 py-4">
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="h-10 w-full sm:w-auto"
              onClick={handleClose}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              className="h-10 w-full sm:w-auto"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelEditModal;