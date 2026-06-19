import { getFranchiseSectionItemById, updateFranchiseSectionItem } from "@/service/api/FranchiseSectionItem";
import { File_URL } from "@/setting/constant/app";
import type { FranchiseSectionItemEditProps } from "@/type/franchiseSectionItem.types";
import { createImageFranchiseSectionItemPage } from "@/validation/image.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Upload, X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useAlert } from "../alert-context";

const FranchiseSectionItemEditModal: React.FC<
  FranchiseSectionItemEditProps
> = ({ open, franchiseSectionItemId, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    sectionId: z.string().optional(),
    sortOrder: z.coerce.number().default(0),
    active: z.boolean().default(true),
    icon: createImageFranchiseSectionItemPage(t),
  });
  type franchiseSectionItemData = z.input<typeof schema>;
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<franchiseSectionItemData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      sectionId: "",
      sortOrder: 0,
      active: true,
      icon: null,
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!open || !franchiseSectionItemId) return;

    const fetchData = async () => {
      setFetching(true);
      try {
        const res = await getFranchiseSectionItemById(
          Number(franchiseSectionItemId),
        );
        const franchiseSectionItem = res.data.data;

        reset({
          title: franchiseSectionItem.title,
          description: franchiseSectionItem.description,
          sectionId: String(franchiseSectionItem.sectionId),
          sortOrder: franchiseSectionItem.sortOrder,
          active: franchiseSectionItem.active,

          icon: null,
        });
  
        setImagePreview(File_URL + franchiseSectionItem.icon?.url);
      } catch (err) {
        console.log(err);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [open, franchiseSectionItemId]);
  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("icon", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const {showAlert} = useAlert();
  const onSubmitForm = async (data: franchiseSectionItemData) => {
      try {
        await updateFranchiseSectionItem(data,Number(franchiseSectionItemId));
        showAlert({
          title: t("franchiseSection.messages.createSuccess"),
          type: "success",
          autoClose: 3000,
        });
        reset();
        onSubmit();
        onClose();
      } catch (err) {
        showAlert({
          title: t("franchiseSection.messages.createFailed"),
          type: "error",
          autoClose: 3000,
        });
      }
    };
  const handleClose = () => {
    reset({
       title: "",
      description: "",
      sectionId: "",
      sortOrder: 0,
      active: true,
      icon: null,
    });
    setImagePreview(null);
    onClose();
  };

  return(
    <Dialog open={!!open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="
          p-0
          w-[calc(100vw-20px)] sm:w-full
          max-w-[96vw] sm:max-w-xl lg:max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          custom-scrollbar"
      >
        {/* HEADER sticky */}
        <div className="sticky top-0 z-10 border-b bg-white dark:bg-background px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Edit Franchise Section Item
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* BODY */}
        <div className="custom-scrollbar overflow-y-auto px-6 py-5">
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700" />
              <span className="ml-3 text-sm text-gray-500">
                {t("common.loading")}
              </span>
            </div>
          ) : (
            <div className="p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Icon
            </label>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setValue("icon", file, {
                  shouldValidate: true,
                  shouldDirty: true,
                });

                trigger("icon");

                setImagePreview(URL.createObjectURL(file));
              }}
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className="
            relative
            overflow-hidden
            rounded-2xl
            border-2
            border-dashed
            border-slate-200
            dark:border-neutral-800
            bg-slate-50
            dark:bg-neutral-900
            hover:border-slate-300
            dark:hover:border-neutral-700
            transition
            cursor-pointer
          "
            >
              {!imagePreview ? (
                <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 sm:py-12">
                  <div className="rounded-full bg-white dark:bg-neutral-800 p-3 shadow-sm">
                    <Upload className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>

                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {t("asset.createOrUpdate.uploadHint")}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    JPG, PNG
                  </p>
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
                    className="
                  absolute
                  right-3
                  top-3
                  rounded-full
                  bg-black/60
                  p-2
                  text-white
                  hover:bg-black/70
                "
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>

              <Input placeholder="Enter Title" {...register("title")} />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Sort Order
              </label>

              <Input
                type="number"
                placeholder="Enter Sort Order"
                {...register("sortOrder")}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <Textarea
                rows={5}
                placeholder="Enter Description"
                {...register("description")}
              />
            </div>
            <div className="md:col-span-2">
              <label
                className="
                flex items-center gap-3
                rounded-lg border border-slate-200
                dark:border-neutral-800
                p-4 cursor-pointer
                hover:bg-slate-50
                dark:hover:bg-neutral-800
                transition-colors
                "
              >
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-xs text-slate-500">
                    {t("franchiseSection.activeDescription")}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
          )}
        </div>

        {/* FOOTER fixed */}
        <div className="border-t bg-white dark:bg-background px-6 py-4">
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
  )
};
export default FranchiseSectionItemEditModal;
