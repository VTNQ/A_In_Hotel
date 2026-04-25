import { getAssetById, updateAsset } from "@/service/api/Asset";
import { getAllCategories } from "@/service/api/Categories";
import { getAllHotel } from "@/service/api/Hotel";
import { getRoom } from "@/service/api/Room";
import { File_URL } from "@/setting/constant/app";
import type { AssetEditProps } from "@/type/asset.types";
import type { HotelRow } from "@/type/hotel.types";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { SelectField } from "../ui/select";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useAlert } from "../alert-context";
import { Upload, X } from "lucide-react";
import z from "zod";
import { createImageAssetSchema } from "@/validation/image.validation";
import { useForm } from "react-hook-form";

const AssetEditModal: React.FC<AssetEditProps> = ({
  open,
  onClose,
  onSubmit,
  assetId,
}) => {
  const { t } = useTranslation();

   const assetSchema = z.object({
      assetName: z.string().min(1, t("asset.validate.assetNameRequired")),
      categoryId: z.string().min(1, t("asset.validate.categoryRequired")),
      roomId: z.string().min(1, t("asset.validate.roomRequired")),
      price: z
        .string()
        .min(1, t("asset.validate.priceRequired"))
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
          message: t("asset.validate.priceInvalid"),
        }),
      hotelId: z.string().min(1, t("asset.validate.hotelRequired")),
      quantity: z
        .string()
        .optional()
        .refine(
          (value) => !value || (!isNaN(Number(value)) && Number(value) >= 0),
          {
            message: t("asset.validate.quantityInvalid"),
          },
        ),
  
      note: z.string().optional(),
      image: z.any().optional(),
    }).superRefine((data, ctx) => {
      // nếu đã có preview (ảnh cũ từ backend) thì bỏ validate image
      if (imagePreview) return;

      const imageValidation = createImageAssetSchema(t).safeParse(data.image);

      if (!imageValidation.success) {
        imageValidation.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["image"],
            message: issue.message,
          });
        });
      }
    });
    type FormData = z.infer<typeof assetSchema>;
  
    const {
      handleSubmit,
      reset,
      setValue,
      watch,
      trigger,
      formState: { errors, isValid, isSubmitting },
    } = useForm<FormData>({
      mode: "onBlur",
      defaultValues: {
        assetName: "",
        categoryId: "",
        roomId: "",
        price: "",
        quantity: "",
        hotelId: "",
        note: "",
        image: null,
      },
    });
  const [hotels, setHotels] = useState<HotelRow[]>([]);
  const [fetching, setFetching] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { showAlert } = useAlert();
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories({
        all: true,
        filter: "isActive==1 and type==3",
      });
      setCategories(response.content);
    } catch (err: any) {
      console.log(err);
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
  
  const fetchRooms = async (hotelId: string) => {
    if (!hotelId) {
      setRooms([]);
      return;
    }

    try {
      const response = await getRoom({
        all: true,
        filter: `hotel.id==${hotelId}`,
      });
      setRooms(response.data.content);
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!open || !assetId) return;

    const fetchData = async () => {
      setFetching(true);
      try {
        const res = await getAssetById(Number(assetId));
        const asset = res;

        reset({
          assetName: asset.assetName,
          categoryId: String(asset.categoryId),
          hotelId: String(asset.hotelId),
          roomId: String(asset.roomId),
          price: String(asset.price),
          quantity: String(asset.quantity),
          note: asset.note ?? "",
          image: null,
        });

        setImagePreview(File_URL + asset.thumbnail?.url);
        await fetchRooms(String(asset.hotelId));
      } catch (err) {
        console.log(err);
      } finally {
        setFetching(false);
      }
    };

    fetchHotels();
    fetchCategories();
    fetchData();
  }, [open, assetId]);

  const onSubmitForm = async (data: FormData) => {
    try {
      const payload = {
        assetName: data.assetName,
        categoryId: data.categoryId,
        hotelId: data.hotelId,
        roomId: data.roomId,
        price: data.price,
        quantity: data.quantity,
        note: data.note,
        image: data.image,
      };
      const response = await updateAsset(payload, Number(assetId));
      showAlert({
        title:
          response?.data?.message || t("asset.createOrUpdate.updateSucess"),
        type: "success",
        autoClose: 4000,
      });
      reset({
        assetName: "",
        categoryId: "",
        hotelId: "",
        roomId: "",
        price: "",
        quantity: "",
        note: "",
        image: null,
      });
      setImagePreview(null);
      onSubmit();
      onClose();
    } catch (err: any) {
      showAlert({
        title: t("asset.createOrUpdate.updateError"),
        description: err?.response?.data?.message || t("common.tryAgain"),
        type: "error",
        autoClose: 4000,
      });
    } 
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image",null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  useEffect(() => {
    if (!watch("hotelId")) return;

    fetchRooms(watch("hotelId"));

    if (!assetId) {
      setValue("roomId","")
    }
  }, [watch("hotelId")]);
  const handleClose = () => {
    reset({
      assetName: "",
      categoryId: "",
      hotelId: "",
      roomId: "",
      price: "",
      quantity: "",
      note: "",
      image: null,
    });
    setImagePreview(null);
    onClose();
  };
  if (!open || !assetId) return <></>;
  return (
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
        <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("asset.createOrUpdate.titleEdit")}
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
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.name")} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="assetName"
                  placeholder={t("asset.createOrUpdate.namePlaceHolder")}
                  onChange={(e)=>{
                    setValue("assetName",e.target.value,{
                      shouldValidate:true,
                      shouldDirty:true
                    })
                    trigger("assetName")
                  }}
                  value={watch("assetName")}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.category")} <span className="text-red-500">*</span>
                </label>
                <SelectField
                  items={categories}
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
                  isRequired
                  placeholder={t("asset.createOrUpdate.categoryPlaceHolder")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              </div>

              {/* Hotel */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.hotel")} <span className="text-red-500">*</span>
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
                  }
                  }
                  isRequired
                  placeholder={t("asset.createOrUpdate.hotelPlaceHolder")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.name}
                />
              </div>

              {/* Room */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.room")} <span className="text-red-500">*</span>
                </label>
                <SelectField
                  items={rooms}
                  value={watch("roomId")}
                  onChange={(v) =>
                  {
                    setValue("roomId",String(v),{
                      shouldValidate:true,
                      shouldDirty:true
                    })
                    trigger("roomId")
                  }
                  }
                  isRequired
                  placeholder={t("asset.createOrUpdate.roomPlaceHolder")}
                  getValue={(i) => String(i.id)}
                  getLabel={(i) => i.roomNumber}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.price")} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="price"
                  type="number"
                  placeholder={t("asset.createOrUpdate.pricePlaceHolder")}
                  onChange={(e)=>{
                    setValue("price",e.target.value,{
                      shouldValidate:true,
                      shouldDirty:true
                    })
                    trigger("price")
                  }}
                  value={watch("price")}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("asset.quantity")} <span className="text-red-500">*</span>
                </label>
                <Input
                  name="quantity"
                  type="number"
                  placeholder={t("asset.createOrUpdate.quantityPlaceHolder")}
                  onChange={(e)=>{
                    setValue("quantity",e.target.value,{
                      shouldValidate:true,
                      shouldDirty:true
                    })
                    trigger("quantity")
                  }}
                  value={watch("quantity")}
                />
              </div>

              {/* Note */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">
                  {t("asset.createOrUpdate.note")}
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
                  placeholder={t("asset.createOrUpdate.notePlaceholder")}
                  rows={3}
                />
              </div>

              {/* Image */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">{t("asset.icon")}</label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (imagePreview?.startsWith("blob:")) {
                      URL.revokeObjectURL(imagePreview);
                    }
                    setValue("image",file)

                    setImagePreview(URL.createObjectURL(file));
                  }}
                />

                <div
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                  className="
                    relative cursor-pointer overflow-hidden rounded-2xl
                    border-2 border-dashed border-slate-300 bg-slate-50
                    hover:border-slate-400 transition
                  "
                >
                  {!imagePreview ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 sm:py-12 text-center">
                      <div className="rounded-full bg-white p-3 shadow-sm">
                        <Upload className="h-5 w-5 text-slate-600" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {t("asset.createOrUpdate.uploadHint")}
                      </p>
                      <p className="text-xs text-slate-500">JPG, PNG</p>
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
                        className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black/70"
                        aria-label="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER fixed */}
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
export default AssetEditModal;
