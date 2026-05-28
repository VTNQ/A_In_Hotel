import { useAlert } from "@/components/alert-context";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategories } from "@/service/api/Categories";
import { getAllHotel } from "@/service/api/Hotel";
import { createRoom } from "@/service/api/Room";
import { zodResolver } from "@hookform/resolvers/zod";
import { PictureInPicture } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";

const CreateRoomPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const roomSchema = z.object({
    roomNumber: z.string().min(1, t("room.validation.roomNumberRequired")),

    roomName: z.string().min(1, t("room.validation.roomNameRequired")),

    idRoomType: z.string().min(1, t("room.validation.roomTypeRequired")),

    hotelId: z.string().min(1, t("room.validation.hotelRequired")),

    floor: z
      .string()
      .min(1, t("room.validation.floorRequired"))
      .refine((value) => Number(value) > 0, {
        message: t("room.validation.floorInvalid"),
      }),

    area: z
      .string()
      .min(1, t("room.validation.areaRequired"))
      .refine((value) => Number(value) > 0, {
        message: t("room.validation.areaInvalid"),
      }),

    capacity: z
      .string()
      .min(1, t("room.validation.capacityRequired"))
      .refine((value) => Number(value) > 0, {
        message: t("room.validation.capacityInvalid"),
      }),

    hourlyBasePrice: z
      .string()
      .min(1, t("room.validation.basePriceRequired"))
      .refine((value) => Number(value) > 0, {
        message: t("room.validation.basePriceInvalid"),
      }),

    hourlyAdditionalPrice: z
      .string()
      .min(1, t("room.validation.additionalPriceRequired"))
      .refine((value) => Number(value) > 0, {
        message: t("room.validation.additionalPriceInvalid"),
      }),

    overnightPrice: z
      .string()
      .min(1, t("room.validation.overnightPriceRequired"))
      .refine((value) => Number(value) > 0, {
        message: t("room.validation.overnightPriceInvalid"),
      }),

    defaultRate: z
      .string()
      .min(1, t("room.validation.defaultRateRequired"))
      .refine((value) => Number(value) > 0, {
        message: t("room.validation.defaultRateInvalid"),
      }),

    note: z.string().optional(),

    image: z
      .array(z.instanceof(File))
      .min(1, t("room.validation.roomRequired"))
      .max(5, t("room.validation.maxImages")),
  });
  type FormData = z.infer<typeof roomSchema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(roomSchema),
    mode: "onChange",
    defaultValues: {
      roomNumber: "",
      roomName: "",
      idRoomType: "",
      hotelId: "",
      capacity: "",
      defaultRate: "",
      floor: "",
      area: "",
      hourlyBasePrice: "",
      hourlyAdditionalPrice: "",
      overnightPrice: "",
      note: "",
      image: [],
    },
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const { showAlert } = useAlert();

  const [imagePreview, setPreviewReview] = useState<string[]>([]);

  const [hotels, setHotels] = useState<any[]>([]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        roomNumber: data.roomNumber,
        roomName: data.roomName,
        idRoomType: data.idRoomType,
        capacity: data.capacity,
        defaultRate: data.defaultRate,
        floor: data.floor,
        area: data.area,
        note: data.note,
        hourlyBasePrice: data.hourlyBasePrice,
        hourlyAdditionalPrice: data.hourlyAdditionalPrice,
        overnightPrice: data.overnightPrice,
        hotelId: data.hotelId,
        images: data.image,
      };

      const response = await createRoom(payload);
      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      reset({
        roomNumber: "",
        roomName: "",
        idRoomType: "",
        hotelId: "",
        capacity: "",
        defaultRate: "",
        floor: "",
        area: "",
        hourlyBasePrice: "",
        hourlyAdditionalPrice: "",
        overnightPrice: "",
        note: "",
        image: [],
      });
      setPreviewReview([]);
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message || t("room.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } 
  };
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==1",
      });
      setCategories(res?.data?.content);
    } catch (err: any) {
      console.error(err);
    }
  };
  const fetchHotels = async () => {
    try {
      const response = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      setHotels(response.data.content);
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchHotels();
  }, []);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">
          {t("room.createOrUpdate.titleCreate")}
        </h1>
        <Breadcrumb
          items={[
            { label: t("common.home"), href: "/Home" },
            { label: t("room.title"), href: "/Home/room" },
            { label: t("room.createOrUpdate.titleCreate") },
          ]}
        />
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.roomNumber")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder={t("room.createOrUpdate.enterRoomNumber")}
              {...register("roomNumber")}
              className="mt-1"
            />
            {errors.roomNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.roomNumber.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.roomName")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("roomName")}
              placeholder={t("room.createOrUpdate.enterRoomName")}
              className="mt-1"
            />
            {errors.roomName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.roomName.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.roomType")}
              <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="idRoomType"
              render={({ field }) => (
                <SelectField
                  items={categories}
                  value={field.value}
                  onChange={field.onChange}
                  isRequired
                  placeholder={t("room.createOrUpdate.selectRoomType")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              )}
            />
            {errors.idRoomType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.idRoomType.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.hotel")}
              <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="hotelId"
              render={({ field }) => (
                <SelectField
                  items={hotels}
                  value={field.value}
                  onChange={field.onChange}
                  isRequired
                  placeholder={t("room.createOrUpdate.selectHotel")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              )}
            />
            {errors.hotelId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.hotelId.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.floor")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder={t("room.createOrUpdate.enterFloor")}
              {...register("floor")}
              className="mt-1"
            />
            {errors.floor && (
              <p className="text-sm text-red-500 mt-1">
                {errors.floor.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.area")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder={t("room.createOrUpdate.enterArea")}
              {...register("area")}
              className="mt-1"
            />
            {errors.area && (
              <p className="text-sm text-red-500 mt-1">{errors.area.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.capacity")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              {...register("capacity")}
              placeholder={t("room.createOrUpdate.enterCapacity")}
              className="mt-1"
            />
            {errors.capacity && (
              <p className="text-sm text-red-500 mt-1">
                {errors.capacity.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.priceBase")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder={t("room.createOrUpdate.enterPrice")}
              {...register("hourlyBasePrice")}
              className="mt-1"
            />
            {errors.hourlyBasePrice && (
              <p className="text-sm text-red-500 mt-1">
                {errors.hourlyBasePrice.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.priceExtraHour")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder={t("room.createOrUpdate.enterPrice")}
              {...register("hourlyAdditionalPrice")}
              className="mt-1"
            />
            {errors.hourlyAdditionalPrice && (
              <p className="text-sm text-red-500 mt-1">
                {errors.hourlyAdditionalPrice.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.priceOvernight")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder={t("room.createOrUpdate.enterPrice")}
              {...register("overnightPrice")}
              className="mt-1"
            />
            {errors.overnightPrice && (
              <p className="text-sm text-red-500 mt-1">
                {errors.overnightPrice.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.priceFullDay")}
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              {...register("defaultRate")}
              placeholder={t("room.createOrUpdate.enterPrice")}
              className="mt-1"
            />
            {errors.defaultRate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.defaultRate.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.note")}
            </label>
            <Textarea
              {...register("note")}
              placeholder={t("room.createOrUpdate.notePlaceholder")}
              rows={3}
              className="mt-1"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {t("room.createOrUpdate.images")}
            </label>

            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  setValue("image", files, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  trigger("image")
                  setPreviewReview(
                    files.map((file) => URL.createObjectURL(file)),
                  );
                }}
              />
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.image.message}
                </p>
              )}
              <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 p-4 hover:border-[#42578E] transition">
                {imagePreview.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-neutral-700">
                      <PictureInPicture className="dark:text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-neutral-300">
                      {t("room.createOrUpdate.clickSelectImages")}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-neutral-500">
                      {t("room.createOrUpdate.selectFiles")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imagePreview.map((src, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden rounded-xl border bg-white shadow-sm"
                      >
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            setPreviewReview((prev) =>
                              prev.filter((_, i) => i !== idx),
                            );

                            setValue(
                              "image",
                              Array.isArray(watch("image"))
                                ? watch("image").filter((_, i) => i !== idx)
                                : [],
                              {
                                shouldValidate: true,
                                shouldDirty: true,
                              },
                            );
                          }}
                          className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t dark:border-neutral-800 pt-4">
          <Button variant="outline" onClick={() => navigate("/Home/room")}>
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
export default CreateRoomPage;
