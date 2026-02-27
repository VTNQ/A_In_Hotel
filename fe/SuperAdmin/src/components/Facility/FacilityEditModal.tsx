import { getAllCategories } from "@/service/api/Categories";
import { getFacilityById, updateExtraServcie } from "@/service/api/facilities";
import { File_URL } from "@/setting/constant/app";
import type { FacilitiesEditProps, FacilityForm } from "@/type/facility.types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useAlert } from "../alert-context";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";

const FacilityEditModal: React.FC<FacilitiesEditProps> = ({
  open,
  facilityId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState<FacilityForm>({
    serviceName: "",
    description: "",
    note: "",
    categoryId: "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // ================= Fetch Categories =================
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==2",
      });
      setCategories(res?.content || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= Fetch Facility =================
  useEffect(() => {
    if (!open || !facilityId) return;

    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getFacilityById(Number(facilityId));
        setFormData({
          serviceName: response.serviceName ?? "",
          description: response.description ?? "",
          note: response.note ?? "",
          categoryId: String(response.categoryId ?? ""),
        });
        setPreview(response?.icon?.url ? File_URL + response.icon.url : null);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchCategories();
    fetchData();

    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
    // eslint-disable-next-line
  }, [open, facilityId]);

  if (!open || !facilityId) return null;

  // ================= Handlers =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const payload = {
        serviceName: formData.serviceName,
        description: formData.description,
        note: formData.note,
        categoryId: Number(formData.categoryId),
        image: coverImage,
        extraCharge: 0,
        price: 0,
      };

      const response = await updateExtraServcie(Number(facilityId), payload);

      showAlert({
        title: response?.data?.message || t("facility.edit.success"),
        type: "success",
        autoClose: 3000,
      });

      handleClose();
      onSubmit();
    } catch (err: any) {
      showAlert({
        title: t("facility.edit.failed"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      serviceName: "",
      description: "",
      note: "",
      categoryId: "",
    });
    setCoverImage(null);
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="
          p-0
          w-[calc(100vw-20px)] sm:w-full
          max-w-[96vw] sm:max-w-lg lg:max-w-2xl
          max-h-[90vh]
          overflow-y-auto
    custom-scrollbar
        "
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 border-b bg-white">
          <DialogHeader className="px-6 py-4">
            <DialogTitle className="text-lg font-semibold">
              {t("facility.edit.title")}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="custom-scrollbar overflow-y-auto px-6 py-5">
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Service Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("facility.form.name")}
                </label>
                <Input
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder={t("facility.form.namePlaceholder")}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("facility.form.category")}
                </label>
                <SelectField
                  items={categories}
                  isRequired
                  value={formData.categoryId}
                  onChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: String(v),
                    }))
                  }
                  placeholder={t("facility.form.categoryPlaceholder")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              </div>

              {/* Description */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">
                  {t("facility.form.description")}
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t("facility.form.descriptionHint")}
                />
              </div>

              {/* Note */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">
                  {t("facility.form.note")}
                </label>
                <Textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={2}
                  placeholder={t("facility.form.noteHint")}
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">
                  {t("facility.form.coverImage")}
                </label>

                <label
                  htmlFor="cover-upload"
                  className="
                    relative flex aspect-video cursor-pointer
                    items-center justify-center
                    rounded-xl border-2 border-dashed
                    border-gray-300 bg-gray-50
                    hover:border-gray-400 transition
                  "
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full rounded-xl object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveImage();
                        }}
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      <Upload className="mx-auto mb-2 h-5 w-5" />
                      <p>{t("facility.form.upload")}</p>
                      <p className="text-xs">{t("facility.form.imageHint")}</p>
                    </div>
                  )}
                </label>

                <input
                  id="cover-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                  onChange={onFileInputChange}
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t bg-white px-6 py-4">
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityEditModal;
