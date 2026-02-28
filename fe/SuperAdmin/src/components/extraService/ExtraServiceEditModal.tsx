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
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!open || !extraServiceId) return;

    const loadData = async () => {
      setFetching(true);
      try {
        const res = await getFacilityById(extraServiceId);

        setFormData({
          name: res.serviceName ?? "",
          description: res.description ?? "",
          categoryId: res.categoryId ?? null,
          unit: res.unit ?? null,
          price: res.price ?? "",
          type: "",
          hotelId: res.hotelId ?? null,
          extraCharge: res.extraCharge ?? "",
          icon: null,
          note: res.note ?? "",
        });

        setImagePreview(
          res?.icon?.url ? File_URL + res.icon.url : null
        );
      } finally {
        setFetching(false);
      }
    };

    const loadCategories = async () => {
      const res = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==2",
      });
      setCategories(res.content || []);
    };

    const loadHotels = async () => {
      const res = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      setHotels(res?.data?.content || []);
    };

    loadData();
    loadCategories();
    loadHotels();
  }, [open, extraServiceId]);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        unit: formData.unit,
        description: formData.description.trim(),
        note: formData.note.trim(),
        extraCharge: formData.extraCharge,
        image: formData.icon,
        hotelId: formData.hotelId,
        type: 2,
        isActive: true,
      };

      const res = await updateExtraServcie(
        Number(extraServiceId),
        payload
      );

      showAlert({
        title:
          res?.data?.message ||
          t("extraService.createOrUpdate.updateSucess"),
        type: "success",
      });

      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("extraService.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open || !extraServiceId) return null;

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-4 border-b bg-gray-50">
          <DialogTitle className="text-lg font-semibold">
            {t("extraService.createOrUpdate.titleEdit")}
          </DialogTitle>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* FORM */}
            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("extraService.name")} *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("extraService.description")}
                </label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              {/* CATEGORY */}
              <div className="md:col-span-2">
                <SelectField
                  label={t("extraService.category")}
                  items={categories}
                  value={formData.categoryId}
                  onChange={(v) =>
                    setFormData((prev) => ({ ...prev, categoryId: v }))
                  }
                  isRequired
                  getValue={(i) => i.id}
                  getLabel={(i) => i.name}
                />
              </div>

              {/* UNIT */}
              <SelectField
                label={t("extraService.unit")}
                items={[
                  { label: "Per Night", value: "PERNIGHT" },
                  { label: "Per Day", value: "PERDAY" },
                  { label: "Per Use", value: "PERUSE" },
                  { label: "Per Hour", value: "PERHOUR" },
                ]}
                value={formData.unit}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, unit: v }))
                }
                isRequired
                getValue={(i) => i.value}
                getLabel={(i) => i.label}
              />

              {/* PRICE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("extraService.price")} *
                </label>
                <Input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              {/* EXTRA CHARGE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("extraService.extraCharge")} *
                </label>
                <Input
                  name="extraCharge"
                  value={formData.extraCharge}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              {/* HOTEL */}
              <SelectField
                label={t("extraService.hotel")}
                items={hotels}
                value={formData.hotelId}
                onChange={(v) =>
                  setFormData((prev) => ({ ...prev, hotelId: v }))
                }
                isRequired
                getValue={(i) => i.id}
                getLabel={(i) => i.name}
              />

              {/* NOTE */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">
                  {t("extraService.note")}
                </label>
                <Textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              {/* IMAGE */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">
                  {t("extraService.icon")}
                </label>

                <div className="relative w-full max-w-sm">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setFormData((prev) => ({ ...prev, icon: file }));
                      setImagePreview(URL.createObjectURL(file));
                    }}
                  />

                  <div className="flex min-h-[160px] items-center justify-center border-2 border-dashed rounded-xl bg-gray-50">
                    {!imagePreview ? (
                      <span className="text-sm text-gray-500">
                        Upload image
                      </span>
                    ) : (
                      <img
                        src={imagePreview}
                        className="h-40 w-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExtraServiceEditModal;