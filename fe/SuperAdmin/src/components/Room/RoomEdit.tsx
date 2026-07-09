import { type RoomEditProps } from "@/type/Room.type";
import { useAlert } from "../alert-context";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { getRoomById, updateRoom } from "@/service/api/Room";
import { File_URL } from "@/setting/constant/app";
import { getAllHotel } from "@/service/api/Hotel";
import { getAllCategories } from "@/service/api/Categories";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { PictureInPicture } from "lucide-react";
import { Button } from "../ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const RoomEdit: React.FC<RoomEditProps> = ({
  open,
  roomId,
  onClose,
  onSubmit,
}) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const roomSchema = z.object({
    status: z.string().optional(),

    roomName: z.string().min(1, t("room.validation.roomNameRequired")),

    idRoomType: z.string().min(1, t("room.validation.roomTypeRequired")),

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

    hotelId: z.string().min(1, t("room.validation.hotelRequired")),
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

    image: z.any().optional(),
    oldImages: z.array(z.string()).optional(),
  });
  type FormData = z.infer<typeof roomSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(roomSchema),
    mode: "onChange",
    defaultValues: {
      roomName: "",
      idRoomType: "",
      hotelId: "",
      capacity: "",
      defaultRate: "",
      area: "",
      hourlyBasePrice: "",
      hourlyAdditionalPrice: "",
      overnightPrice: "",
      note: "",
      image: [],
      oldImages: [],
    },
  });
  const [fetching, setFetching] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [imagePreview, setPreviewReview] = useState<string[]>([]);
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
  const onSubmitForm = async (data: FormData) => {
    try {
      const cleanOldImages = (watch("oldImages") || []).map((img) =>
        img.replace(File_URL, ""),
      );

      const payload = {
        roomName: data.roomName,
        idRoomType: data.idRoomType,
        capacity: data.capacity,
        defaultRate: data.defaultRate,
        area: data.area,
        note: data.note,
        hourlyBasePrice: data.hourlyBasePrice,
        hourlyAdditionalPrice: data.hourlyAdditionalPrice,
        overnightPrice: data.overnightPrice,
        hotelId: data.hotelId,
        images: data.image,
        oldImages: cleanOldImages,
      };
      const response = await updateRoom(Number(roomId), payload);
      showAlert({
        title: response.data.message,
        type: "success",
        autoClose: 4000,
      });
      reset({
        roomName: "",
        idRoomType: "",
        hotelId: "",
        capacity: "",
        defaultRate: "",
        area: "",
        hourlyBasePrice: "",
        hourlyAdditionalPrice: "",
        overnightPrice: "",
        note: "",
        image: [],
        oldImages: [],
      });
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("room.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  const handleClose = () => {
    reset({
      roomName: "",
      idRoomType: "",
      hotelId: "",
      capacity: "",
      defaultRate: "",
      area: "",
      hourlyBasePrice: "",
      hourlyAdditionalPrice: "",
      overnightPrice: "",
      note: "",
      image: [],
      oldImages: [],
    });
    onClose();
  };
  useEffect(() => {
    if (!open || !roomId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await getRoomById(Number(roomId));
        const oldImages =
          response?.data?.data?.images?.map((img: any) => File_URL + img.url) ||
          [];
        reset({
          roomName: response?.data?.data?.roomName || "",
          idRoomType: response?.data?.data?.idRoomType
            ? String(response.data.data.idRoomType)
            : undefined,
          hotelId: response?.data?.data?.hotelId
            ? String(response.data.data.hotelId)
            : undefined,
          capacity: String(response?.data?.data?.capacity || ""),
          defaultRate: String(response?.data?.data?.defaultRate || ""),
          area: String(response?.data?.data?.area || ""),
          hourlyBasePrice: String(response?.data?.data?.hourlyBasePrice ?? ""),
          hourlyAdditionalPrice: String(
            response?.data?.data?.hourlyAdditionalPrice ?? "",
          ),
          overnightPrice: String(response?.data?.data?.overnightPrice ?? ""),
          note: response?.data?.data?.note || "",
          image: [],
          oldImages: oldImages,
        });
        setPreviewReview(oldImages);
      } catch (err) {
        console.error("Failed to fetch room:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
    fetchCategories();
    fetchHotels();
  }, [open, roomId]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const currentImages = watch("image") ?? [];

    const newImages = [...currentImages, ...files];

    setValue("image", newImages, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setPreviewReview((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    trigger("image");

    // Cho phép chọn lại cùng một file
    e.target.value = "";
  };
  const handleRemoveImage = (index: number) => {
  const oldImages = watch("oldImages") ?? [];
  const newImages = watch("image") ?? [];

  // Xóa preview
  const removedPreview = imagePreview[index];
  if (removedPreview.startsWith("blob:")) {
    URL.revokeObjectURL(removedPreview);
  }

  setPreviewReview((prev) => prev.filter((_, i) => i !== index));

  if (index < oldImages.length) {
    // Xóa ảnh cũ
    setValue(
      "oldImages",
      oldImages.filter((_, i) => i !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  } else {
    // Xóa ảnh mới
    const newIndex = index - oldImages.length;

    setValue(
      "image",
      newImages.filter(( i:any) => i !== newIndex),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  trigger(["oldImages", "image"]);
};
  if (!open || !roomId) return null;
  return (
    <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="
          p-0
          w-[calc(100vw-20px)] sm:w-full
          max-w-[96vw] sm:max-w-xl lg:max-w-3xl
          max-h-[90vh]
          overflow-y-auto
    custom-scrollbar

        "
      >
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4 dark:bg-background">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("room.createOrUpdate.titleEdit")}
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="overflow-y-auto custom-scrollbar px-6 py-5">
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
                    {t("room.createOrUpdate.roomName")}
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder={t("room.createOrUpdate.enterRoomName")}
                    {...register("roomName")}
                    className="mt-1"
                  />
                  {errors.roomName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.roomName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("room.createOrUpdate.roomType")}
                    <span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    items={categories}
                    value={watch("idRoomType")}
                    onChange={(v) => {
                      setValue("idRoomType", String(v), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      trigger("idRoomType");
                    }}
                    isRequired={true}
                    placeholder={t("room.createOrUpdate.selectRoomType")}
                    getValue={(i) => String(i.id)}
                    getLabel={(i) => i.name}
                  />
                  {errors.idRoomType && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.idRoomType.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("room.hotel")}
                    <span className="text-red-500">*</span>
                  </label>
                  <SelectField
                    items={hotels}
                    value={watch("hotelId")}
                    onChange={(v) => {
                      setValue("hotelId", String(v), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      trigger("hotelId");
                    }}
                    isRequired={true}
                    placeholder={t("room.createOrUpdate.selectHotel")}
                    getValue={(i) => String(i.id)}
                    getLabel={(i) => i.name}
                  />
                  {errors.hotelId && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.hotelId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">
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
                    <p className="text-sm text-red-500 mt-1">
                      {errors.area.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">
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
                  <label className="text-sm font-medium">
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
                  <label className="text-sm font-medium">
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
                  <label className="text-sm font-medium">
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
                  <label className="text-sm font-medium">
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
                  <label className="text-sm font-medium">
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
                  <label className="text-sm font-medium">
                    {t("room.createOrUpdate.images")}
                  </label>

                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageChange}
                    />

                    <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-background p-4">
                      {imagePreview.length === 0 ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex cursor-pointer flex-col items-center justify-center py-10 text-center"
                        >
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-background">
                            <PictureInPicture className="text-slate-700 dark:text-slate-200" />
                          </div>

                          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {t("room.createOrUpdate.clickSelectImages")}
                          </p>

                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {t("room.createOrUpdate.selectFiles")}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                          {imagePreview.map((src, idx) => (
                            <div
                              key={idx}
                              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                            >
                              <img
                                src={src}
                                alt={`preview-${idx}`}
                                className="h-32 w-full object-cover transition-transform group-hover:scale-105"
                              />

                              <div className="absolute inset-0 bg-black/30 opacity-0 transition group-hover:opacity-100" />

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(idx);
                                }}
                                className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          {/* Ô thêm ảnh */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-3xl font-bold text-slate-400 transition hover:border-[#42578E] hover:text-[#42578E]"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">
                    {String(errors?.image?.message)}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={handleSubmit(onSubmitForm)}
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? t("common.saving") : t("common.save")}
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default RoomEdit;
