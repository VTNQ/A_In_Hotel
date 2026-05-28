import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategories } from "@/service/api/Categories";
import { addExtraService } from "@/service/api/facilities";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { createImageExtraServiceSchema } from "@/validation/image.validation";

const CreateFacilityForm: React.FC = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<any[]>([]);
    const { showAlert } = useAlert();
    const extraServiceSchema = z.object({
        serviceName: z
          .string()
          .min(1, t("extraService.validate.serviceNameRequired")),
        description: z.string().optional(),
        note: z.string().optional(),
        categoryId: z.string().min(1, t("extraService.validate.categoryRequired")),
        image: createImageExtraServiceSchema(t)
      });
      type FormData = z.infer<typeof extraServiceSchema>;
      const {
        handleSubmit,
        reset,
        register,
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
          description: "",
          note: "",
        },
      });
    const navigate = useNavigate();

    const [preview, setPreview] = useState<string | null>(null);

    /* ================= handlers ================= */



    const handleImageChange = (file: File) => {
        setValue("image",file,{
            shouldValidate:true,
            shouldDirty:true
        
        });
        trigger("image");
        setPreview(URL.createObjectURL(file));
    }
    const onFileInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) handleImageChange(file);
    };
    /* ================= fetch category ================= */

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories({
                all: true,
                filter: "isActive==1 and type==2",
            });
            setCategories(res?.data?.content || []);
            console.log(res.content)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = async (data: FormData) => {

        try {
            const payload = {
                serviceName: data.serviceName,
                description: data.description,
                categoryId: Number(data.categoryId),
                price: 0,
                extraCharge: 0,
                note: data.note,
                type: 1,
                isActive: 1,
                image: data.image
            }
            const response = await addExtraService(payload);
            showAlert({
                title: response.data.message,
                type: "success",
                autoClose: 4000,
            });
            reset({
                serviceName: "",
                description: "",
                note: "",
                categoryId: "",
                image:null,
            })
            setPreview(null)
        } catch (err: any) {
            showAlert({
                title: t("facility.create.error"),
                description: err?.response.data.message || t("common.tryAgain"),
                type: "error",
                autoClose: 4000,
            })
        } 


    }

    /* ================= render ================= */

   return (
  <div className="space-y-6">
    {/* ===== Page header ===== */}
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {t("facility.create.title")}
      </h1>

      <Breadcrumb
        items={[
          { label: t("facility.breadcrumb.home"), href: "/Home" },
          { label: t("facility.breadcrumb.facilities"), href: "/Home/facility" },
          { label: t("facility.create.title") },
        ]}
      />
    </div>

    {/* ===== Form ===== */}
    <div
      className="
        rounded-xl border p-6 space-y-6
        border-gray-200 bg-white
        dark:border-neutral-800
      dark:bg-neutral-900
      "
    >
      {/* Facility name */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("facility.form.name")}{" "}
          <span className="text-red-500">*</span>
        </label>

        <Input
          {...register("serviceName")}
          placeholder={t("facility.form.namePlaceholder")}
          className="mt-1"
        />

        {errors.serviceName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.serviceName.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("facility.form.description")}{" "}
          <span className="text-red-500">*</span>
        </label>

        <Textarea
          {...register("description")}
          placeholder={t("facility.form.descriptionPlaceholder")}
          rows={3}
          className="
            mt-1
            dark:bg-gray-950
            dark:border-gray-700
            dark:text-gray-100
            dark:placeholder:text-gray-500
          "
        />

        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <SelectField
          label={t("facility.form.category")}
          items={categories}
          value={watch("categoryId")}
          onChange={(v) => {
            setValue("categoryId", String(v), {
              shouldValidate: true,
              shouldDirty: true,
            });

            trigger("categoryId");
          }}
          isRequired={true}
          placeholder={t("facility.form.categoryPlaceholder")}
          getValue={(i) => i.id}
          getLabel={(i) => i.name}
        />

        {errors.categoryId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Cover Image */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("facility.form.coverImage")}
        </label>

        <div className="mt-2">
          <label
            htmlFor="cover-upload"
            className="
              flex h-100 cursor-pointer flex-col items-center justify-center
              rounded-lg border-2 border-dashed
              border-gray-300 bg-white
              text-center text-sm text-gray-500
              transition
              hover:border-primary hover:bg-gray-50

              dark:border-gray-700
              dark:bg-gray-950
              dark:text-gray-400
              dark:hover:border-indigo-500
              dark:hover:bg-gray-900
            "
          >
            {preview ? (
              <img
                src={preview}
                alt="Cover preview"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <>
                <svg
                  className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 16l4-4a2 2 0 012.828 0l4.344 4.344a2 2 0 002.828 0L21 12"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {t("common.upload")}
                </p>

                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {t("common.uploadHint")}
                </p>
              </>
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
          <p className="text-red-500 text-sm mt-1">
            {String(errors.image.message)}
          </p>
        )}
      </div>

      {/* Internal note */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {t("facility.form.note")}
        </label>

        <Textarea
          {...register("note")}
          placeholder={t("facility.form.notePlaceholder")}
          rows={2}
          className="
            mt-1
            dark:bg-gray-950
            dark:border-gray-700
            dark:text-gray-100
            dark:placeholder:text-gray-500
          "
        />
      </div>

      {/* Actions */}
      <div
        className="
          flex justify-end gap-3 border-t pt-4
          border-gray-200
          dark:border-gray-800
        "
      >
        <Button
          variant="outline"
          onClick={() => navigate("/Home/facility")}
          className="
            dark:border-gray-700
            dark:bg-gray-900
            dark:text-gray-100
            dark:hover:bg-gray-800
          "
        >
          {t("common.cancel")}
        </Button>

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isValid}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
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
            t("facility.create.submit")
          )}
        </Button>
      </div>
    </div>
  </div>
);
};

export default CreateFacilityForm;
