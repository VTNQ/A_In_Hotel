import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { findById, updateRoom } from "../../service/api/Room";
import { File_URL } from "../../setting/constant/app";
import { getAllCategory } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import type { UpdateRoomFormModalProps } from "../../type/room.types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateRoomFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  roomId,
}: UpdateRoomFormModalProps) => {
  const { t } = useTranslation();
  const roomSchema = z.object({
    id: z.string().optional(),
    status: z.string().optional(),
    roomNumber: z.string().min(1, t("room.validation.roomNumberRequired")),

    roomName: z.string().min(1, t("room.validation.roomNameRequired")),

    idRoomType: z.string().min(1, t("room.validation.roomTypeRequired")),

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

    images: z
      .array(z.instanceof(File))
      .min(1, t("common.required"))
      .max(5, t("room.createOrUpdate.maxImages"))
      .optional(),
    oldImages: z.array(z.string()).optional(),
  });

  type FormData = z.infer<typeof roomSchema>;

  const { showAlert } = useAlert();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [tempImages, setTempImages] = useState<(File | string)[]>([]);
  const [oldImages, setOldImages] = useState<string[]>([]);

  const [initialSnapshot, setInitialSnapshot] = useState<string>("");

  /* =========================
     FORM
  ========================= */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(roomSchema),
    mode: "onChange",
    defaultValues: {
      roomNumber: "",
      roomName: "",
      idRoomType: "",
      floor: "",
      area: "",
      capacity: "",
      status: "",
      hourlyBasePrice: "",
      hourlyAdditionalPrice: "",
      overnightPrice: "",
      defaultRate: "",
      note: "",
      images: [],
      oldImages: [],
    },
  });

  const images = watch("images");

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    if (!isOpen || !roomId) return;

    const load = async () => {
      setFetching(true);
      try {
        const [catRes, roomRes] = await Promise.all([
          getAllCategory({ all: true, filter: "isActive==1 and type==1" }),
          findById(roomId),
        ]);

        setCategories(catRes.data.content || []);

        const room = roomRes?.data?.data;

        const oldImgs =
          room?.images?.map((i: any) =>
            i.url?.startsWith("http") ? i.url : `${File_URL}${i.url}`,
          ) || [];
        setOldImages(oldImgs);
        setTempImages(oldImgs);

        const form = {
          roomNumber: room?.roomNumber || "",
          roomName: room?.roomName || "",
          idRoomType: room?.idRoomType || "",
          floor: String(room?.floor || ""),
          area: String(room?.area || ""),
          capacity: String(room?.capacity || ""),
          status: String(room?.status || ""),
          hourlyBasePrice: String(room?.hourlyBasePrice || ""),
          hourlyAdditionalPrice: String(room?.hourlyAdditionalPrice || ""),
          overnightPrice: String(room?.overnightPrice || ""),
          defaultRate: String(room?.defaultRate || ""),
          note: room?.note || "",
          images: [],
        };

        reset(form);

        setInitialSnapshot(JSON.stringify({ ...form, oldImages: oldImgs }));
      } catch {
        showAlert({
          title: "Load failed",
          type: "error",
        });
      } finally {
        setFetching(false);
      }
    };

    load();
  }, [isOpen, roomId]);

  /* =========================
     CHANGE CHECK
  ========================= */
  const hasChanges = () => {
    const current = {
      ...watch(),
      oldImages,
      images,
    };

    return JSON.stringify(current) !== initialSnapshot;
  };
  const watchedValues = watch();
  /* =========================
     SAVE
  ========================= */
  const onSubmit = async (data: FormData) => {
    if (!hasChanges()) {
      showAlert({
        title: t("common.noChange"),
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const finalOld = tempImages.filter((i) => typeof i === "string");
      const finalNew = tempImages.filter((i) => i instanceof File);

      const payload = {
        ...data,
        oldImages: finalOld.map((x) => x.replace(File_URL, "")),
        images: finalNew,
      };

      await updateRoom(Number(roomId), payload);

      showAlert({
        title: t("room.createOrUpdate.updateSuccess"),
        type: "success",
      });

      onSuccess?.();
      onClose();
    } catch {
      showAlert({
        title: t("room.createOrUpdate.updateError"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  if (isOpen && fetching) {
    return (
      <CommonModal isOpen={true} onClose={onClose} title="Loading...">
        <div className="flex justify-center py-10">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </CommonModal>
    );
  }

  if (isOpen && fetching) {
    return (
      <CommonModal
        isOpen={true}
        onClose={onClose}
        title={t("room.createOrUpdate.titleEdit")}
        saveLabel={t("common.save")}
        cancelLabel={t("common.cancel")}
        width="w-[95vw] sm:w-[90vw] lg:w-[1000px]"
      >
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      </CommonModal>
    );
  }
  const isFormValid =
    !!watch("roomNumber") &&
    !!watch("roomName") &&
    !!watch("idRoomType") &&
    !!watch("floor") &&
    !!watch("area") &&
    !!watch("capacity") &&
    !!watch("hourlyBasePrice") &&
    !!watch("hourlyAdditionalPrice") &&
    !!watch("overnightPrice") &&
    !!watch("defaultRate") &&
    tempImages.length > 0;
  return (
    <>
      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSubmit(onSubmit)}
        diabled={!isFormValid || isSubmitting}
        title={t("room.createOrUpdate.titleEdit")}
        width="w-[95vw] sm:w-[90vw] lg:w-[1000px]"
        saveLabel={loading ? t("common.saving") : t("common.save")}
        cancelLabel={t("common.cancelButton")}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* LEFT SIDE FORM */}
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">
                {t("room.roomTypeName")} *
              </label>
              <select
                {...register("idRoomType")}
                className="w-full border border-[#4B62A0] rounded-lg p-2"
              >
                <option value="">
                  {t("room.createOrUpdate.selectRoomType")}
                </option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.idRoomType && (
                <p className="text-red-500 text-xs">
                  {errors.idRoomType.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                {t("room.createOrUpdate.roomNumber")} *
              </label>
              <input
                {...register("roomNumber")}
                placeholder={t("room.createOrUpdate.enterRoomNumber")}
                className="w-full border border-[#4B62A0] rounded-lg p-2"
              />
              {errors.roomNumber && (
                <p className="text-red-500 text-xs">
                  {errors.roomNumber.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.roomName")} *
                </label>
                <input
                  placeholder={t("room.createOrUpdate.enterRoomName")}
                  {...register("roomName")}
                  className="w-full border border-[#42578E] rounded-lg p-2"
                />
                {errors.roomName && (
                  <p className="text-red-500 text-xs">
                    {errors.roomName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.floor")} *
                </label>
                <input
                  type="number"
                  placeholder={t("room.createOrUpdate.enterFloor")}
                  {...register("floor")}
                  className="w-full border border-[#42578E] rounded-lg p-2"
                />
                {errors.floor && (
                  <p className="text-red-500 text-xs">{errors.floor.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                {t("room.createOrUpdate.area")} *
              </label>
              <input
                type="number"
                {...register("area")}
                placeholder={t("room.createOrUpdate.enterArea")}
                className="w-full border border-[#42578E] rounded-lg p-2"
              />
              {errors.area && (
                <p className="text-red-500 text-xs">{errors.area.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                {t("common.status")}
              </label>
              <select
                {...register("status")}
                className="w-full border border-[#42578E] rounded-lg p-2"
              >
                <option value="0">
                  {t("room.createOrUpdate.defaultStatus")}
                </option>
                <option value="1">{t("room.roomStatus.vacantDirty")}</option>
                <option value="2">{t("room.roomStatus.occupied")}</option>
                <option value="3">{t("room.roomStatus.available")}</option>
                <option value="4">{t("room.roomStatus.maintenance")}</option>
                <option value="5">{t("room.roomStatus.blocked")}</option>
                <option value="6">{t("room.roomStatus.deactivated")}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                {t("room.createOrUpdate.capacity")} *
              </label>
              <input
                type="number"
                placeholder={t("room.createOrUpdate.enterCapacity")}
                {...register("capacity")}
                className="w-full border border-[#42578E] rounded-lg p-2"
              />
              {errors.capacity && (
                <p className="text-red-500 text-xs">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                {t("room.createOrUpdate.note")}
              </label>
              <textarea
                {...register("note")}
                placeholder={t("room.createOrUpdate.notePlaceholder")}
                className="w-full border border-[#4B62A0] bg-[#EEF0F7] rounded-lg p-2 outline-none"
                rows={4}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.priceBase")}*
                </label>
                <input
                  type="number"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  {...register("hourlyBasePrice")}
                  className="w-full border border-[#42578E] rounded-lg p-2"
                />
                {errors.hourlyBasePrice && (
                  <p className="text-red-500 text-xs">
                    {errors.hourlyBasePrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.priceExtraHour")}*
                </label>
                <input
                  type="number"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  {...register("hourlyAdditionalPrice")}
                  className="w-full border border-[#42578E] rounded-lg p-2"
                />
                {errors.hourlyAdditionalPrice && (
                  <p className="text-red-500 text-xs">
                    {errors.hourlyAdditionalPrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.priceOvernight")}*
                </label>
                <input
                  type="number"
                  {...register("overnightPrice")}
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  className="w-full border border-[#42578E] rounded-lg p-2"
                />
                {errors.overnightPrice && (
                  <p className="text-red-500 text-xs">
                    {errors.overnightPrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.priceFullDay")} *
                </label>
                <input
                  type="number"
                  {...register("defaultRate")}
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  className="w-full border border-[#42578E] rounded-lg p-2"
                />
                {errors.defaultRate && (
                  <p className="text-red-500 text-xs">
                    {errors.defaultRate.message}
                  </p>
                )}
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="mt-6">
              <label className="font-semibold">
                {t("room.createOrUpdate.images")}
              </label>

              <div
                onClick={() => setImageModalOpen(true)}
                className="mt-2 border border-[#F2F2F2] rounded-xl bg-gray-50 p-4 sm:p-6 cursor-pointer flex items-center justify-center 
                                min-h-[200px] sm:h-64"
              >
                {tempImages.length === 0 ? (
                  <img
                    src="/defaultImage.png"
                    className="w-[180px] h-[130px] opacity-50"
                  />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full h-full">
                    {tempImages.map((img, i) => (
                      <img
                        key={i}
                        src={
                          typeof img === "string"
                            ? img
                            : URL.createObjectURL(img)
                        }
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CommonModal>

      {/* POPUP SELECT IMAGES (giữ nguyên logic cũ) */}
      {/* IMAGE SELECT MODAL */}
      <AnimatePresence>
        {imageModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-[95vw] sm:w-[90vw] lg:w-[900px] max-h-[90vh] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl relative
                            overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <button
                  className="px-5 py-1.5 rounded-full border hover:bg-gray-100"
                  onClick={() => {
                    setTempImages(watchedValues.images || []);
                    setImageModalOpen(false);
                  }}
                >
                  {t("common.cancelButton")}
                </button>

                <h2 className="text-xl font-semibold">
                  {t("room.createOrUpdate.selectImages")}
                </h2>

                <button
                  className="px-5 py-1.5 rounded-full bg-black text-white hover:bg-gray-800"
                  onClick={() => {
                    const files = tempImages.filter(
                      (x): x is File => x instanceof File,
                    );

                    setValue("images", files, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    trigger("images");
                    setImageModalOpen(false);
                  }}
                >
                  {t("common.save")}
                </button>
              </div>

              {/* DROP ZONE */}
              <div
                className="border-2 border-dashed border-[#D4D4E3] rounded-xl bg-[#FAFAFF] 
          p-8 max-h-[500px] overflow-auto custom-scroll"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-blue-500");
                }}
                onDragLeave={(e) =>
                  e.currentTarget.classList.remove("border-blue-500")
                }
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-blue-500");

                  const dropped = Array.from(e.dataTransfer.files).filter((f) =>
                    f.type.startsWith("image/"),
                  ) as File[];

                  if (dropped.length > 0) {
                    setTempImages((prev) => [...prev, ...dropped]);
                  }
                }}
              >
                {/* NO IMAGES */}
                {tempImages.length === 0 && (
                  <div className="flex flex-col items-center py-16">
                    <img src="/defaultImage.png" className="w-20 opacity-70" />
                    <p className="mt-4 font-medium">
                      {t("room.createOrUpdate.dragDrop")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("room.createOrUpdate.supportedFormat")}
                    </p>

                    <label
                      htmlFor="pickImg"
                      className="mt-3 px-6 py-2 border rounded-full bg-white cursor-pointer"
                    >
                      {t("room.createOrUpdate.browseFiles")}
                    </label>

                    <input
                      id="pickImg"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(
                          e.target.files ?? [],
                        ) as File[];
                        if (files.length > 0) setTempImages(files);
                      }}
                    />
                  </div>
                )}

                {/* HAS IMAGES */}
                {tempImages.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* MAIN IMAGE */}
                      <div className="col-span-2 relative">
                        <img
                          src={
                            typeof tempImages[0] === "string"
                              ? tempImages[0]
                              : URL.createObjectURL(tempImages[0])
                          }
                          className="w-full h-[220px] sm:h-[350px] object-cover rounded-xl"
                        />

                        <button
                          className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full text-white"
                          onClick={() => {
                            const clone = [...tempImages];
                            clone.splice(0, 1);
                            setTempImages(clone);
                          }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* SMALL IMAGES */}
                      <div className="flex flex-col gap-4">
                        {tempImages.slice(1).map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={
                                typeof img === "string"
                                  ? img
                                  : URL.createObjectURL(img)
                              }
                              className="w-full h-[120px] sm:h-[165px] object-cover rounded-xl"
                            />

                            <button
                              className="absolute top-2 right-2 bg-black/60 text-white p-[3px] rounded-full opacity-0 group-hover:opacity-100 transition"
                              onClick={() => {
                                const clone = [...tempImages];
                                clone.splice(0, 1);
                                setTempImages(clone);
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ADD MORE */}
                    <div className="flex justify-center mt-8">
                      <label
                        htmlFor="addMoreImg"
                        className="px-6 py-2 border rounded-full cursor-pointer bg-white hover:bg-gray-50"
                      >
                        {t("room.createOrUpdate.browseFiles")}
                      </label>

                      <input
                        id="addMoreImg"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(
                            e.target.files ?? [],
                          ) as File[];
                          if (files.length > 0)
                            setTempImages((prev) => [...prev, ...files]);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UpdateRoomFormModal;
