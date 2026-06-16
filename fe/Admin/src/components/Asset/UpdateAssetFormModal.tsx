import { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { findById, updateAsset } from "../../service/api/Asset";
import { getAllCategory } from "../../service/api/Category";
import { getAllRoom } from "../../service/api/Room";
import { getTokens } from "../../util/auth";
import { File_URL } from "../../setting/constant/app";
import { useTranslation } from "react-i18next";
import type { UpdateAssetFormModalProps } from "../../type/asset.types";
import z from "zod";
import { createImageAssetSchema } from "../../validation/image.validation";
import { useForm } from "react-hook-form";

const UpdateAssetFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  assetId,
}: UpdateAssetFormModalProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const assetSchema = z
    .object({
      id: z.string(),
      assetName: z.string().min(1, t("asset.validate.assetNameRequired")),
      categoryId: z.string().min(1, t("asset.validate.categoryRequired")),
      roomId: z.string().min(1, t("asset.validate.roomRequired")),
      price: z
        .string()
        .min(1, t("asset.validate.priceRequired"))
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
          message: t("asset.validate.priceInvalid"),
        }),

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
    })
    .superRefine((data, ctx) => {
      // nếu đã có preview (ảnh cũ từ backend) thì bỏ validate image
      if (preview) return;

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
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      id: "",
      assetName: "",
      categoryId: "",
      roomId: "",
      price: "",
      quantity: "",
      note: "",
      image: null,
    },
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [room, setRooms] = useState<any[]>([]);
  const { showAlert } = useAlert();
  useEffect(() => {
    if (!isOpen || !assetId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCategories(), fetchRooms()]);
        const res = await findById(assetId);
        const data = res?.data?.data;
        reset({
          id: data?.id?.toString() || "",
          assetName: data.assetName || "",
          categoryId: String(data.categoryId) || "",
          price: String(data.price) || "",
          quantity: String(data.quantity) || "",
          note: data.note || "",
          roomId: String(data.roomId) || "",
          image: null,
        });
        setPreview(data.thumbnail?.url ?File_URL +data.thumbnail?.url  : null);
      } catch (error) {
        showAlert({
          title: t("asset.loadError"),
          type: "error",
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, assetId]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setValue("image", file, {
      shouldValidate: true,
    });

    clearErrors("image");
    setPreview(URL.createObjectURL(file));
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategory({
        all: true,
        filter: "isActive==1 and type==3",
      });
      setCategories(res.data.content || []);
    } catch (err) {
      console.log(err);
    }
  };
  const fetchRooms = async () => {
    try {
    
      let filters: string[] = [];
      filters.push(`hotel.id==${getTokens()?.hotelId} and isDeleted==false`);
      const filterQuery = filters.join(" and ");

      const res = await getAllRoom({
        all: true,
        filter: filterQuery,
      });
      setRooms(res.data.content || []);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        assetName: data.assetName,
        categoryId: data.categoryId,
        roomId: data.roomId,
        price: data.price,
        quantity: data.quantity,
        note: data.note,
        image: data.image,
      };
      const response = await updateAsset(Number(data.id), payload);
      const message =
        response?.data?.message || t("asset.createOrUpdate.updateSuccess");
      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });
      reset();
      setPreview(null);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Update error:", err);
      showAlert({
        title:
          err?.response?.data?.message || t("asset.createOrUpdate.updateError"),
        type: "error",
        autoClose: 4000,
      });
    }
  };
  const handleCancel = () => {
    reset();
    setPreview(null);
    onClose();
  };
  if (isOpen && loading) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title={t("asset.createOrUpdate.titleEdit")}
        saveLabel={t("common.save")}
        cancelLabel={t("common.cancelButton")}
        width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
      >
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      </CommonModal>
    );
  }
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      onSave={handleSubmit(onSubmit)}
      title={t("asset.createOrUpdate.titleEdit")}
      saveLabel={isSubmitting ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
      diabled={!isValid || isSubmitting}
    >
      <div className="mb-4">
        <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
          {t("asset.createOrUpdate.icon")}
        </label>
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#EEF0F7] dark:bg-slate-800 border border-[#4B62A0]
        dark:border-slate-700
         rounded-xl overflow-hidden cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleIconChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="https://backoffice-uat.affina.com.vn/assets/images/ffc6ce5b09395834f6c02a056de78121.png"
                className="w-full h-full object-cover absolute inset-0"
              />
            </div>
          )}

          <div className="absolute bottom-2 right-2 bg-[#4B62A0] p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 5a3 3 0 110 6 3 3 0 010-6z" />
              <path d="M12 13c-4 0-7 2-7 5v2h14v-2c0-3-3-5-7-5z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
            {t("asset.name")} *
          </label>
          <input
            type="text"
            placeholder={t("asset.createOrUpdate.namePlaceHolder")}
            {...register("assetName")}
            className=" w-full rounded-lg px-3 py-2.5 sm:py-2 
           outline-none border border-[#4B62A0] 
           dark:border-slate-700 bg-white 
           dark:bg-slate-900 text-gray-700 dark:text-gray-100 
           placeholder:text-gray-400 dark:placeholder:text-slate-500 
           focus:ring-2 focus:ring-[#4B62A0] transition-colors "
          />
          {errors.assetName && (
            <p className="text-red-500 dark:text-red-400 mt-1">{errors.assetName.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
            {t("asset.createOrUpdate.room")} *
          </label>
          <select
            {...register("roomId")}
            className=" w-full rounded-lg px-3 py-2.5 sm:py-2 
           outline-none border border-[#4B62A0] 
           dark:border-slate-700 bg-white 
           dark:bg-slate-900 text-gray-700 dark:text-gray-100 
           placeholder:text-gray-400 dark:placeholder:text-slate-500 
           focus:ring-2 focus:ring-[#4B62A0] transition-colors "
            required
          >
            <option value="">{t("asset.createOrUpdate.selectRoom")}</option>
            {room.length > 0 ? (
              room.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.roomName}
                </option>
              ))
            ) : (
              <option disabled>{t("common.loading")}</option>
            )}
          </select>
          {errors.roomId && (
            <p className="text-red-500 dark:text-red-400 mt-1">{errors.roomId.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
            {t("asset.category")} *
          </label>
          <select
            {...register("categoryId")}
            className=" w-full rounded-lg px-3 py-2.5 sm:py-2 
           outline-none border border-[#4B62A0] 
           dark:border-slate-700 bg-white 
           dark:bg-slate-900 text-gray-700 dark:text-gray-100 
           placeholder:text-gray-400 dark:placeholder:text-slate-500 
           focus:ring-2 focus:ring-[#4B62A0] transition-colors "
            required
          >
            <option value="">{t("asset.createOrUpdate.selectCategory")}</option>
            {categories.length > 0 ? (
              categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            ) : (
              <option disabled>{t("common.loading")}</option>
            )}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 dark:text-red-400 mt-1">{errors.categoryId.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
            {t("asset.createOrUpdate.price")} *
          </label>
          <input
            type="number"
           
            placeholder={t("asset.createOrUpdate.pricePlaceHolder")}
            {...register("price")}
            className=" w-full rounded-lg px-3 py-2.5 sm:py-2 
           outline-none border border-[#4B62A0] 
           dark:border-slate-700 bg-white 
           dark:bg-slate-900 text-gray-700 dark:text-gray-100 
           placeholder:text-gray-400 dark:placeholder:text-slate-500 
           focus:ring-2 focus:ring-[#4B62A0] transition-colors "
          />
          {errors.price && <p className="text-red-500 dark:text-red-400 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
            {t("asset.createOrUpdate.quantity")}
          </label>
          <input
            type="number"
            placeholder={t("asset.createOrUpdate.quantityPlaceHolder")}
            {...register("quantity")}
            className=" w-full rounded-lg px-3 py-2.5 sm:py-2 
           outline-none border border-[#4B62A0] 
           dark:border-slate-700 bg-white 
           dark:bg-slate-900 text-gray-700 dark:text-gray-100 
           placeholder:text-gray-400 dark:placeholder:text-slate-500 
           focus:ring-2 focus:ring-[#4B62A0] transition-colors "
          />
          {errors.quantity && (
            <p className="text-red-500 mt-1">{errors.quantity.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
            {t("asset.createOrUpdate.note")}
          </label>
          <textarea
            {...register("note")}
            placeholder={t("asset.createOrUpdate.notePlaceholder")}
            className="w-full border border-[#253150] dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100  dark:placeholder:text-slate-500  focus:border-[#3E5286] bg-[#EEF0F7] rounded-lg p-2 outline-none"
            rows={2}
          />
        </div>
      </div>
    </CommonModal>
  );
};
export default UpdateAssetFormModal;
