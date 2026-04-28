import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategories } from "@/service/api/Categories";
import { addExtraService } from "@/service/api/facilities";
import { getAllHotel } from "@/service/api/Hotel";
import { createImageExtraServiceSchema } from "@/validation/image.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";

const CreateExtraServicePage = () => {
   const { t } = useTranslation();
   const extraServiceSchema = z.object({
    serviceName: z
      .string()
      .min(1, t("extraService.validate.serviceNameRequired")),

    categoryId: z.string().min(1, t("extraService.validate.categoryRequired")),

    description: z.string().optional(),
   

    note: z.string().optional(),
    hotelId: z.string().min(1, t("extraService.validate.hotelRequired")),
    type: z.string().min(1, t("extraService.validate.typeRequired")),

    extraCharge: z
      .string()
      .min(1, t("extraService.validate.extraChargeRequired"))
      .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
        message: t("extraService.validate.extraChargeInvalid"),
      }),
    icon: createImageExtraServiceSchema(t),
  });
  type FormData = z.infer<typeof extraServiceSchema>;
  const {

    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(extraServiceSchema),
    mode: "all",
    defaultValues: {
      serviceName: "",
      categoryId: "",
      type: "",
      hotelId: "",
      description: "",
      note: "",
      extraCharge: "",
      icon: null,
    },
  });
  const { showAlert } = useAlert();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
  const fetchHotels = async () => {
    try {
      const res = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      console.log(res)
      setHotels(res?.data?.content || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchHotels();
  }, []);
 
 

  const onSubmit = async (data: FormData) => {
  
    try {
     
      const payload = {
        serviceName: data.serviceName.trim(),
        categoryId: Number(data.categoryId),
        description: data.description?.trim(),
        isActive: true,
        note: data.note?.trim(),
        extraCharge: data.extraCharge,
        image: data.icon,
        type: 2,
        hotelId: data.hotelId,
      };
      const response = await addExtraService(payload);
      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      reset({
        serviceName: "",
        description: "",
        categoryId: "",
        type: "",
        extraCharge: "",
        note: "",
        hotelId: "",
        icon: null,
      });
      setImagePreview(null)
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          t("extraService.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } 
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          {t("extraService.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("extraService.title"), href: "/Home/service" },
            { label: t("extraService.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border bg-white p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">
              {t("extraService.name")} <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={t("extraService.createOrUpdate.namePlaceHolder")}
              onChange={(e)=>{
                setValue("serviceName",e.target.value,{
                  shouldValidate:true,
                  shouldDirty:true
                })
                trigger("serviceName")
              }}
              value={watch("serviceName")}
              className="mt-1"
            />
            {errors.serviceName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.serviceName.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">
              {t("extraService.description")}{" "}
            </label>
            <Input
              name="description"
              placeholder={t(
                "extraService.createOrUpdate.descriptionPlaceHolder",
              )}
              onChange={(e)=>{
                setValue("description",e.target.value,{
                  shouldValidate:true,
                  shouldDirty:true
                })
                trigger("description")
              }}
              value={watch("description")}
              className="mt-1"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <SelectField
            label={t("extraService.category")}
            items={categories}
            value={watch("categoryId")}
            onChange={(v) =>{
              setValue("categoryId",String(v),{
                shouldValidate:true,
                shouldDirty:true
              })
              trigger("categoryId")
            }
            }
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
      
          <div>
            <label className="text-sm font-medium">
              {t("extraService.extraCharge")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              name="extraCharge"
              placeholder="Enter extra charge"
              onChange={(e)=>{
                setValue("extraCharge",e.target.value,{
                  shouldValidate:true,
                  shouldDirty:true
                })
                trigger("extraCharge")
              }}
              value={watch("extraCharge")}
              className="mt-1"
            />
            {errors.extraCharge && (
              <p className="text-red-500 text-sm mt-1">
                {errors.extraCharge.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("extraService.hotel")} <span className="text-red-500">*</span>
          </label>
          <SelectField
            items={hotels}
            value={watch("hotelId")}
            onChange={(v) =>{
              setValue("hotelId",String(v),{
                shouldValidate:true,
                shouldDirty:true
              })
              trigger("hotelId")
            }}
            isRequired={true}
            placeholder={t("extraService.createOrUpdate.hotelPlaceHolder")}
            getValue={(i) => i.id}
            getLabel={(i) => i.name}
          />
          {errors.hotelId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.hotelId.message}
              </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("extraService.note")}
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
            placeholder={t("common.notePlaceholder")}
            rows={3}
            className="mt-1"
          />
          {errors.note && (
              <p className="text-red-500 text-sm mt-1">
                {errors.note.message}
              </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>{t("extraService.icon")}</Label>

          <div className="relative lg:w-48">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
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

            <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center hover:border-[#42578E]">
              {!imagePreview ? (
                <>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
                    <svg
                      className="h-6 w-6 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13.5l4.5-4.5a2.25 2.25 0 013.182 0L15 13.5"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    {t("extraService.createOrUpdate.uploadHint")}
                  </p>
                  <p className="text-xs text-slate-400">JPG, PNG</p>
                </>
              ) : (
                <div className="relative w-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setValue("icon",null);

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
          {errors.icon && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.icon.message)}
              </p>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/service")}>
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
              t("common.save")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CreateExtraServicePage;
