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
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createImageExtraServiceSchema } from "@/validation/image.validation";

const FacilityEditModal: React.FC<FacilitiesEditProps> = ({
  open,
  facilityId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();


  const [fetching, setFetching] = useState(false);


  const extraServiceSchema = z.object({
    serviceName: z
      .string()
      .min(1, t("extraService.validate.serviceNameRequired")),
    description: z.string().optional(),
    note: z.string().optional(),
    categoryId: z.string().min(1, t("extraService.validate.categoryRequired")),
    image:createImageExtraServiceSchema(t),
  });
  type FormData = z.infer<typeof extraServiceSchema>;
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: {errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(extraServiceSchema),
    mode: "onBlur",
    defaultValues: {
      serviceName: "",
      categoryId: "",
      image:null,
      description: "",
      note: "",
    },
  });

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
        reset({
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

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setValue("image",file,{
      shouldValidate:true,
      shouldDirty:true
    
    });
    trigger("image");
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setValue("image",null,{
      shouldValidate:true,
      shouldDirty:true
    });
    trigger("image");
    setPreview(null);
  };

  const onSubmitForm = async (data: FormData) => {
    try {


      const payload = {
        serviceName: data.serviceName,
        description: data.description,
        note: data.note,
        categoryId: Number(data.categoryId),
        image: data.image,
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
    } 
  };

  const handleClose = () => {
    reset({
      serviceName: "",
      description: "",
      note: "",
      categoryId: "",
      image:null
    });
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
                  value={watch("serviceName")}
                  onChange={(e)=>{
                    setValue("serviceName",e.target.value,{
                      shouldValidate:true,
                      shouldDirty:true
                    })
                    trigger("serviceName")
                  }}
                  placeholder={t("facility.form.namePlaceholder")}
                />
                {errors.serviceName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.serviceName.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("facility.form.category")}
                </label>
                <SelectField
                  items={categories}
                  isRequired
                  value={watch("categoryId")}
                  onChange={(v) =>
                  {
                    setValue("categoryId",String(v),{
                      shouldValidate:true,
                      shouldDirty:true
                    })
                    trigger("categoryId")
                  }
                  }
                  placeholder={t("facility.form.categoryPlaceholder")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
                {errors.categoryId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">
                  {t("facility.form.description")}
                </label>
                <Textarea
                  name="description"
                  value={watch("description")}
                  onChange={(e)=>{
                    setValue("description",e.target.value,{
                      shouldValidate:true,
                      shouldDirty:true
                    })
                    trigger("description")
                  }}
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
                  value={watch("note")}
                  onChange={(e)=>{
                    setValue("note",e.target.value,{
                      shouldValidate:true,
                      shouldDirty:true
                    })
                    trigger("note")
                  }}
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
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">{String(errors.image.message)}</p>
              )}
            </div>
          )}
        </div>


        {/* FOOTER */}
        <div className="border-t bg-white px-6 py-4">
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmit(onSubmitForm)}
              disabled={isSubmitting || !isValid}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityEditModal;
