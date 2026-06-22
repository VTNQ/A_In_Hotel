import { useAlert } from "@/components/alert-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFranchiseSectionItem } from "@/service/api/FranchiseSectionItem";
import { createImageFranchiseSectionItemPage } from "@/validation/image.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";

const CreateFranchiseSectionItemPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = z.object({
    title: z.string().min(
      1,
      t("validation.required", {
        field: t("franchiseSectionItem.fields.title"),
      }),
    ),
    description: z.string().optional(),
    sectionId: z.string().optional(),
    sortOrder: z.coerce.number().default(0),
    active: z.boolean().default(true),
    image: createImageFranchiseSectionItemPage(t),
  });
  const { sectionId } = useParams();
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
      sectionId: sectionId,
      sortOrder: 0,
      active: true,
      image: null,
    },
  });
  const { showAlert } = useAlert();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const onSubmit = async (data: franchiseSectionItemData) => {
    try {
      await createFranchiseSectionItem(data);
      showAlert({
        title: t("franchiseSectionItem.messages.createSuccess"),
        type: "success",
        autoClose: 3000,
      });
      reset();
    } catch (err) {
      showAlert({
        title: t("franchiseSectionItem.messages.createFailed"),
        type: "error",
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {t("franchiseSectionItem.createTitle")}
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          bg-white dark:bg-neutral-900
          border border-slate-200 dark:border-neutral-800
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        <div className="px-6 py-5 border-b border-slate-200 dark:border-neutral-800">
          <h1 className="text-2xl font-semibold">
            {t("franchiseSectionItem.title")}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {t("franchiseSectionItem.breadcrumb")}
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t("franchiseSectionItem.fields.icon")}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setValue("image", file, {
                  shouldValidate: true,
                  shouldDirty: true,
                });

                trigger("image");

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
                {t("franchiseSectionItem.fields.title")}{" "}
                <span className="text-red-500">*</span>
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
                {t("franchiseSectionItem.fields.sortOrder")}
              </label>

              <Input
                type="number"
                placeholder="Enter Sort Order"
                {...register("sortOrder")}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {t("franchiseSectionItem.fields.description")}
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
                  <p className="font-medium">
                    {" "}
                    {t("franchiseSectionItem.fields.active")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t("franchiseSectionItem.activeDescription")}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div
          className="
            px-6 py-4
            border-t border-slate-200 dark:border-neutral-800
            flex justify-end gap-3
            bg-slate-50 dark:bg-neutral-950
          "
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/Home/franchise-section/${sectionId}/items`)}
          >
            {t("common.cancel")}
          </Button>

          <Button type="submit" disabled={isSubmitting || !isValid}>
            {isSubmitting ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default CreateFranchiseSectionItemPage;
