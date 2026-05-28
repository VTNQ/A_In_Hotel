import  { useEffect, useRef, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { getAll } from "@/service/api/Authenticate";
import type { UserResponse } from "@/type/UserResponse";
import { SelectField } from "../ui/select";
import { useAlert } from "../alert-context";
import { AddHotel } from "@/service/api/Hotel";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";
import z from "zod";
import { createImageHotelSchema } from "@/validation/image.validation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * FormLayouts
 * - 4 thẻ form theo layout giống ảnh: Vertical, Vertical w/ icons, Horizontal, Horizontal w/ icons
 * - Tailwind only, icon bằng lucide-reactch
 * - Nút "Show Code" ở góc phải mỗi card (demo, chưa gắn hành động)
 */
export default function CreateHotel() {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const hotelSchema = z.object({
    name: z.string().min(1, t("hotel.validation.nameRequired")),

    address: z.string().min(1, t("hotel.validation.addressRequired")),

    idUser: z.preprocess(
      (val) => (val === null || val === "" ? undefined : Number(val)),
      z.number({
        error: t("hotel.validation.managerRequired"),
      }),
    ),

    image: createImageHotelSchema(t),

    hotlines: z
      .array(
        z.object({
          phone: z
            .string()
            .min(1, t("hotel.validation.phoneRequired"))
            .regex(/^(0|\+84)[0-9]{9,10}$/, t("hotel.validation.phoneInvalid")),
        }),
      )
      .min(1, t("hotel.validation.phoneRequired")),
  });
  type FormData = z.input<typeof hotelSchema>;

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(hotelSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      idUser: undefined,
      image: null,
      hotlines: [{ phone: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
  control,
  name: "hotlines",
});
  const getUser = async () => {
    try {
      const response = await getAll({
        all: true,
        filter: "role.id==2",
      });
      setUsers(response.data.content);
    } catch (error) {
      console.log("Failed to fetch user:", error);
    }
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    getUser();
  }, []);
 
  const onSubmit = async (data:FormData) => {
    try {
      const payload = {
        ...data,
        hotlines: data.hotlines.filter((h) => h.phone.trim() !== ""),
      };
      const response = await AddHotel(payload);

      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      reset({
        name: "",
        address: "",
        idUser: null,
        image: null as File | null,
        hotlines: [{ phone: "" }],
      });
      navigate("/Home/hotel");
    } catch (error: any) {
      showAlert({
        title: t("hotel.hotelCreate.error"),
        description: error?.response.data.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image",null,{
      shouldValidate:true,
      shouldDirty:true
    })
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

 return (
  <div className="space-y-6  dark:text-neutral-100">
    {/* Header */}
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">
          {t("hotel.hotelCreate.title")}
        </h1>

        <Breadcrumb
          items={[
            { label: t("hotel.breadcrumb.home"), href: "/Home" },
            { label: t("hotel.breadcrumb.hotel"), href: "/Home/hotel" },
          ]}
        />
      </div>
    </div>

    {/* Grid */}
    <div className="mx-auto mt-5 grid grid-cols-1 gap-6 lg:grid-cols-1">
      <div
        className="
          rounded-2xl border border-gray-200 bg-white shadow-sm
          dark:border-neutral-800 dark:bg-neutral-900
        "
      >
        {/* HEADER */}
        <div
          className="
            flex items-center justify-between border-b border-gray-100 p-4
            dark:border-neutral-800
          "
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
            {t("hotel.hotelCreate.formTitle")}
          </h3>
        </div>

        {/* BODY */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME */}
            <div>
              <Label
                htmlFor="Hotel Name"
                className="text-slate-700 dark:text-neutral-300"
              >
                {t("hotel.hotelCreate.name")}
              </Label>

              <Input
                {...register("name")}
                placeholder="Enter Name Hotel"
                className="
                  dark:border-neutral-700
                  dark:bg-neutral-800
                  dark:text-neutral-100
                  dark:placeholder:text-neutral-500
                "
              />

              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <Label
                htmlFor="Address"
                className="text-slate-700 dark:text-neutral-300"
              >
                {t("hotel.hotelCreate.address")}
              </Label>

              <Textarea
                placeholder="Enter Address Hotel"
                {...register("address")}
                rows={3}
                className="
                  mt-1 w-full rounded-md border border-slate-300
                  px-3 py-2 text-sm outline-none
                  focus:ring-1 focus:ring-[#42578E]

                  dark:border-neutral-700
                  dark:bg-neutral-800
                  dark:text-neutral-100
                  dark:placeholder:text-neutral-500
                "
              />

              {errors.address && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* MANAGER */}
            <div>
              <SelectField<UserResponse>
                items={users}
                isRequired
                value={watch("idUser") ? String(watch("idUser")) : null}
                onChange={(val) => {
                  setValue("idUser", val ? Number(val) : null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                label={t("hotel.hotelCreate.manager")}
                placeholder={t("hotel.hotelCreate.selectManager")}
                description={t("hotel.hotelCreate.managerDesc")}
                clearable
                size="md"
                getValue={(u) => String(u.id)}
                getLabel={(u) => u.fullName ?? u.email ?? `User #${u.id}`}
              />

              {errors.idUser && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.idUser.message}
                </p>
              )}
            </div>

            {/* HOTLINES */}
            <div className="space-y-2">
              <label className="text-slate-700 dark:text-neutral-300">
                {t("hotel.hotelCreate.hotlines")}
              </label>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2"
                  >
                    <Input
                      placeholder={t(
                        "hotel.hotelCreate.hotlinePlaceholder",
                      )}
                      {...register(`hotlines.${index}.phone`)}
                      className="
                        dark:border-neutral-700
                        dark:bg-neutral-800
                        dark:text-neutral-100
                        dark:placeholder:text-neutral-500
                      "
                    />

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => remove(index)}
                        className="
                          dark:border-neutral-700
                          dark:bg-neutral-800
                          dark:text-neutral-200
                          dark:hover:bg-neutral-700
                        "
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {errors.hotlines && (
                <p className="text-sm text-red-500">
                  {errors.hotlines.message}
                </p>
              )}

              <Button
                type="button"
                variant="secondary"
                onClick={() => append({ phone: "" })}
                className="
                  dark:bg-neutral-800
                  dark:text-neutral-100
                  dark:hover:bg-neutral-700
                "
              >
                + {t("hotel.hotelCreate.addHotline")}
              </Button>
            </div>

            {/* IMAGE */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-neutral-300">
                {t("hotel.hotelCreate.image")} *
              </Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setValue("image", file, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  setImagePreview(URL.createObjectURL(file));
                }}
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  !imagePreview && fileInputRef.current?.click()
                }
                className="
                  relative overflow-hidden rounded-2xl border-2 border-dashed
                  border-slate-200 bg-slate-50
                  hover:border-slate-300 transition cursor-pointer

                  dark:border-neutral-700
                  dark:bg-neutral-900
                  dark:hover:border-neutral-600
                "
              >
                {!imagePreview ? (
                  <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 sm:py-12">
                    <div className="rounded-full bg-white p-3 shadow-sm dark:bg-neutral-800">
                      <Upload className="h-5 w-5 text-slate-600 dark:text-neutral-300" />
                    </div>

                    <p className="text-sm font-medium text-slate-700 dark:text-neutral-200">
                      {t("hotel.hotelCreate.uploadHint")}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-neutral-500">
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
                        absolute right-3 top-3 rounded-full
                        bg-black/60 p-2 text-white
                        hover:bg-black/70
                      "
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-neutral-500">
                {t("hotel.hotelCreate.uploadHint")}
              </p>
            </div>

            {errors.image && (
              <p className="mt-1 text-xs text-red-600">
                {String(errors.image.message)}
              </p>
            )}

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="
                dark:bg-indigo-500
                dark:text-white
                dark:hover:bg-indigo-600
              "
            >
              {t("common.save")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}
