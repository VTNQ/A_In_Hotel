import {
  type ExtraServiceEditProps,
  type ExtraServiceForm,
} from "@/type/extraService.types";
import { useAlert } from "../alert-context";
import { useEffect, useRef, useState } from "react";
import { getAllHotel } from "@/service/api/Hotel";
import { getAllCategories } from "@/service/api/Categories";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { getFacilityById, updateExtraServcie } from "@/service/api/facilities";
import { File_URL } from "@/setting/constant/app";

const ExtraServiceEditModal: React.FC<ExtraServiceEditProps> = ({
  open,
  extraServiceId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [formData, setFormData] = useState<ExtraServiceForm>({
    name: "",
    description: "",
    categoryId: null,
    unit: null,
    price: "",
    type: "",
    hotelId: null,
    extraCharge: "",
    icon: null,
    note: "",
  });
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fetchHotels = async () => {
    try {
      const res = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      console.log(res);
      setHotels(res?.data?.content || []);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!open || !extraServiceId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getFacilityById(extraServiceId);
        setFormData({
          name: response.serviceName ?? "",
          description: response.description ?? "",
          categoryId: response.categoryId ?? null,
          unit: response.unit ?? null,
          price: response.price ?? "",
          type: "",
          hotelId: response.hotelId ?? null,
          extraCharge: response.extraCharge ?? "",
          icon: null,
          note: response.note ?? "",
        });
        setImagePreview(
          response?.icon?.url ? File_URL + response.icon.url : null,
        );
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
    fetchCategories();
    fetchHotels();
  }, [open, extraServiceId]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
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
      const response = await updateExtraServcie(
        Number(extraServiceId),
        payload,
      );
      showAlert({
        title:
          response?.data?.message ||
          t("extraService.createOrUpdate.updateSucess"),
        type: "success",
        autoClose: 4000,
      });
      setFormData({
        name: "",
        description: "",
        categoryId: null,
        unit: null,
        price: "",
        type: "",
        hotelId: null,
        extraCharge: "",
        icon: null,
        note: "",
      });
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("extraService.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }finally{
      setLoading(false);
    }
  };
  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: null,
      unit: null,
      price: "",
      type: "",
      hotelId: null,
      extraCharge: "",
      icon: null,
      note: "",
    });
    setImagePreview(null);
    onClose();
  };
  if (!open || !extraServiceId) return <></>;
  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {t("extraService.createOrUpdate.titleEdit")}
          </DialogTitle>
        </DialogHeader>

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
                  {t("extraService.name")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  placeholder={t("extraService.createOrUpdate.namePlaceHolder")}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  {t("extraService.description")}
                </label>
                <Input
                  name="description"
                  value={formData.description}
                  placeholder={t(
                    "extraService.createOrUpdate.descriptionPlaceHolder",
                  )}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* ===== Category ===== */}
              <div className="sm:col-span-2">
                <SelectField
                  label={t("extraService.category")}
                  items={categories}
                  value={formData.categoryId}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, categoryId: v }))
                  }
                  isRequired
                  placeholder={t("facility.form.categoryPlaceholder")}
                  getValue={(i) => i.id}
                  getLabel={(i) => i.name}
                />
              </div>
              <div>
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
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, unit: v }))
                  }
                  isRequired={true}
                  placeholder={t("extraService.createOrUpdate.defaultUnit")}
                  getValue={(i) => i.value}
                  getLabel={(i) => i.label}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  {t("extraService.price")}{" "}
                  <span className="text-red-500">*</span>
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
              <div>
                <label className="text-sm font-medium">
                  {t("extraService.hotel")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <SelectField
                  items={hotels}
                  value={formData.hotelId}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, hotelId: v }))
                  }
                  isRequired={true}
                  placeholder={t(
                    "extraService.createOrUpdate.hotelPlaceHolder",
                  )}
                  getValue={(i) => i.id}
                  getLabel={(i) => i.name}
                />
              </div>
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
                <label className="text-sm">{t("extraService.icon")}</label>

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

                      setFormData((prev) => ({ ...prev, icon: file }));
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />

                  <div className="flex min-h-[150px] w-[132%] items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#42578E]">
                    {!imagePreview ? (
                      <p className="text-sm font-medium text-slate-600">
                        {t("extraService.createOrUpdate.uploadHint")}
                      </p>
                    ) : (
                      <div className="relative w-full overflow-hidden rounded-lg">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-full object-cover"
                        />

                        {/* Close button */}
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({ ...prev, image: null }));
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="
              absolute right-2 top-2
              flex h-7 w-7 items-center justify-center
              rounded-full bg-black/60
              text-sm text-white
              hover:bg-black/80
            "
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
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
      </DialogContent>
    </Dialog>
  );
};
export default ExtraServiceEditModal;
