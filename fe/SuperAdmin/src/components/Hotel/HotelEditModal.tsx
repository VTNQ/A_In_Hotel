import type { HotelEditProps, HotelFormData } from "@/type/hotel.types";
import type React from "react";
import { useAlert } from "../alert-context";
import { useEffect, useRef, useState } from "react";
import { getAll } from "@/service/api/Authenticate";
import { getHotelById, updateHotel } from "@/service/api/Hotel";
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
import type { UserResponse } from "@/type/UserResponse";
import { File_URL } from "@/setting/constant/app";
import { useTranslation } from "react-i18next";

const HotelEditModal: React.FC<HotelEditProps> = ({
  open,
  hotelId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  const [formData, setFormData] = useState<HotelFormData>({
    name: "",
    address: "",
    idUser: null,
    image: null as File | null,
    hotlines: [],
  });

  const fetchUsers = async () => {
    try {
      const response = await getAll({ all: true, filter: "role.id==2" });
      setUsers(response?.data?.content || []);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    // ✅ chỉ fetch khi modal mở và có hotelId
    if (!open || !hotelId) return;

    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getHotelById(Number(hotelId));
        setFormData({
          name: response?.data?.data?.name || "",
          address: response?.data?.data?.address || "",
          idUser: response?.data?.data?.idUser ?? null,
          image: null as File | null,
          hotlines:
            response?.data?.data?.hotlines?.map((h: any) => ({
              phone: h.phone,
            })) || [],
        });
        setImagePreview(
          response?.data?.data?.thumbnail
            ? File_URL + response?.data?.data?.thumbnail?.url
            : null,
        );
      } catch (err) {
        console.error("Failed to fetch hotel:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
    fetchUsers();
  }, [open, hotelId]);

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
        autoClose: 4000,
      });

      onClose();
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
  const handleClose = () => {
    setFormData({
      name: "",
      address: "",
      idUser: null,
      image: null as File | null,
      hotlines: [],
    });
    onClose();
  };
  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="sm:max-w-md max-h-[90vh]  overflow-y-auto
    custom-scrollbar"
      >
        <DialogHeader>
          <DialogTitle> {t("hotel.hotelEdit.title")}</DialogTitle>
        </DialogHeader>
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#253150]/20 border-t-[#253150] rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              {t("hotel.hotelEdit.loading")}
            </span>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <label className="text-sm"> {t("hotel.hotelEdit.name")}</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm">
                  {t("hotel.hotelEdit.address")}
                </label>
                <Textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, address: e.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <SelectField<UserResponse>
                  items={users}
                  value={
                    formData.idUser != null ? String(formData.idUser) : null
                  }
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      idUser: val ? Number(val) : null,
                    }))
                  }
                  label={t("hotel.hotelEdit.manager")}
                  placeholder={t("hotel.hotelEdit.chooseManager")}
                  description={t("hotel.hotelEdit.managerDesc")}
                  clearable
                  size="md"
                  getValue={(u) => String(u.id)}
                  getLabel={(u) => u.fullName ?? u.email ?? `User #${u.id}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm">
                  {t("hotel.hotelEdit.hotlines")}
                </label>
                <div className="space-y-2">
                  {formData.hotlines.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
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
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            hotlines: prev.hotlines.filter(
                              (_, i) => i !== index,
                            ),
                          }));
                        }}
                      >
                        X
                      </Button>
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
                  + {t("hotel.hotelEdit.addHotline")}
                </Button>
              </div>
              <div>
                <label className="text-sm">{t("hotel.hotelEdit.image")}</label>
                <div className="relative mt-2 w-[26%]">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={`absolute inset-0 cursor-pointer opacity-0 ${
                      imagePreview ? "pointer-events-none" : "z-10"
                    }`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setFormData((prev) => ({
                        ...prev,
                        image: file,
                      }));
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />

                  <div className="flex min-h-[150px] w-[132%] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50  text-center hover:border-[#42578E]">
                    {!imagePreview ? (
                      <>
                        <p className="text-sm font-medium text-slate-600">
                          {t("hotel.hotelEdit.uploadHint")}
                        </p>
                      </>
                    ) : (
                      <div className="relative w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full rounded-lg "
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({
                              ...prev,
                              image: null,
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
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("common.saving") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HotelEditModal;
