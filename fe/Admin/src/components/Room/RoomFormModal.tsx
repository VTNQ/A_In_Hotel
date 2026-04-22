import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { createRoom } from "../../service/api/Room";
import { getAllCategory } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import type { RoomFormModalProps } from "../../type/room.types";

const RoomFormModal = ({ isOpen, onClose, onSuccess }: RoomFormModalProps) => {
  /* ===============================
      FORM STATE
  =============================== */
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomName: "",
    idRoomType: "",
    defaultRate: "",
    area: "",
    capacity: "",
    floor: "",
    hourlyBasePrice: "",
    hourlyAdditionalPrice: "",
    overnightPrice: "",
    note: "",
    images: [] as File[],
  });
  const [errors, setErrors] = useState<any>({});
  const DISABLE_VALIDATE = false;
  const { t } = useTranslation();
  const [category, setCategory] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  /* ===============================
      FETCH CATEGORY
  =============================== */
  const fetchCategories = async () => {
    try {
      setFetching(true);
      const res = await getAllCategory({
        all: true,
        filter: "isActive==1 and type==1",
      });
      setCategory(res.content || []);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };
  const validateField = (name: string, value: any) => {
     let error = "";

  switch (name) {
    case "roomNumber":
      if (!value || value.trim() === "") {
        error = t("room.validation.roomNumberRequired");
      }
      break;

    case "roomName":
      if (!value || value.trim() === "") {
        error = t("room.validation.roomNameRequired");
      }
      break;

    case "idRoomType":
      if (!value) {
        error = t("room.validation.roomTypeRequired");
      }
      break;

    case "floor":
      if (!value) {
        error = t("room.validation.floorRequired");
      } else if (Number(value) <= 0) {
        error = t("room.validation.floorInvalid");
      }
      break;

    case "area":
      if (!value) {
        error = t("room.validation.areaRequired");
      } else if (Number(value) <= 0) {
        error = t("room.validation.areaInvalid");
      }
      break;

    case "capacity":
      if (!value) {
        error = t("room.validation.capacityRequired");
      } else if (Number(value) <= 0) {
        error = t("room.validation.capacityInvalid");
      }
      break;

    case "hourlyBasePrice":
      if (!value) {
        error = t("room.validation.basePriceRequired");
      } else if (Number(value) <= 0) {
        error = t("room.validation.basePriceInvalid");
      }
      break;

    case "hourlyAdditionalPrice":
      if (!value) {
        error = t("room.validation.additionalPriceRequired");
      } else if (Number(value) <= 0) {
        error = t("room.validation.additionalPriceInvalid");
      }
      break;

    case "overnightPrice":
      if (!value) {
        error = t("room.validation.overnightPriceRequired");
      } else if (Number(value) <= 0) {
        error = t("room.validation.overnightPriceInvalid");
      }
      break;

    case "defaultRate":
      if (!value) {
        error = t("room.validation.defaultRateRequired");
      } else if (Number(value) <= 0) {
        error = t("room.validation.defaultRateInvalid");
      }
      break;

    default:
      break;
  }

  return error;
    
  };
  const validateForm = () => {
  if (DISABLE_VALIDATE) {
    setErrors({});
    return true;
  }

  const newErrors: any = {
    roomNumber: validateField("roomNumber", formData.roomNumber),
    roomName: validateField("roomName", formData.roomName),
    idRoomType: validateField("idRoomType", formData.idRoomType),
    floor: validateField("floor", formData.floor),
    area: validateField("area", formData.area),
    capacity: validateField("capacity", formData.capacity),
    hourlyBasePrice: validateField("hourlyBasePrice", formData.hourlyBasePrice),
    hourlyAdditionalPrice: validateField("hourlyAdditionalPrice", formData.hourlyAdditionalPrice),
    overnightPrice: validateField("overnightPrice", formData.overnightPrice),
    defaultRate: validateField("defaultRate", formData.defaultRate),
  };

  // validate image riêng
  if (formData.images.length === 0) {
    newErrors.images = t("common.required");
  }

  Object.keys(newErrors).forEach((key) => {
    if (!newErrors[key]) delete newErrors[key];
  });

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
const checkFormValid = () => {
  if (DISABLE_VALIDATE) return true;

  return (
    formData.roomNumber &&
    formData.roomName &&
    formData.idRoomType &&
    formData.floor &&
    formData.area &&
    formData.capacity &&
    formData.hourlyBasePrice &&
    formData.hourlyAdditionalPrice &&
    formData.overnightPrice &&
    formData.defaultRate &&
    formData.images.length > 0
  );
};
  useEffect(() => {
    if (isOpen) {
      setInitialData(formData);
    }
  }, [isOpen]);
  const isFormChanged = () => {
    if (!initialData) return false;

    const keys = Object.keys(formData);

    for (const key of keys) {
      if (key === "images") {
        if (formData.images.length !== initialData.images.length) return true;
        continue;
      }
      if (
        formData[key as keyof typeof formData] !==
        initialData[key as keyof typeof formData]
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  /* ===============================
      POPUP STATE
  =============================== */
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [tempImages, setTempImages] = useState<File[]>([]);

  const openImageModal = () => {
    setTempImages(formData.images);
    setImageModalOpen(true);
  };

  /* ===============================
      HANDLE INPUT CHANGE
  =============================== */
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ===============================
      SAVE ROOM
  =============================== */
  const handleSave = async () => {
    if(!validateForm()) return;
    setLoading(true);
    try {
      const response = await createRoom(formData);

      showAlert({
        title: response?.data?.message || t("room.createOrUpdate.createSucess"),
        type: "success",
        autoClose: 3000,
      });
      setFormData({
        roomNumber: "",
        roomName: "",
        idRoomType: "",
        defaultRate: "",
        area: "",
        capacity: "",
        floor: "",
        hourlyBasePrice: "",
        hourlyAdditionalPrice: "",
        overnightPrice: "",
        note: "",
        images: [],
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message || t("room.createOrUpdate.createError"),
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      CANCEL FORM
  =============================== */
  const handleCancel = () => {
    setFormData({
      roomNumber: "",
      roomName: "",
      idRoomType: "",
      defaultRate: "",
      area: "",
      capacity: "",
      floor: "",
      hourlyBasePrice: "",
      hourlyAdditionalPrice: "",
      overnightPrice: "",
      note: "",
      images: [],
    });
    setErrors({});
    onClose();
  };

  /* ===============================
      CONFIRM CLOSE MODAL
  =============================== */
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []) as File[];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const imageFiles = files.filter((file) => allowedTypes.includes(file.type));
    if (imageFiles.length != files.length) {
      showAlert({
        title: t("room.createOrUpdate.onlyImage"),
        type: "error",
        autoClose: 3000,
      });
    }
    const totalImages = tempImages.length + imageFiles.length;

    if (totalImages > 5) {
      showAlert({
        title: t("room.createOrUpdate.maxImages"),
        type: "error",
        autoClose: 3000,
      });
      return;
    }
    setTempImages((prev) => [...prev, ...imageFiles]);
  };

  if (isOpen && fetching) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title={t("room.createOrUpdate.titleCreate")}
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
  const handleBlur =(e:any)=>{
    if(DISABLE_VALIDATE) return;
    const { name, value } = e.target;
    setErrors((prev:any)=>({
      ...prev,
      [name]: validateField(name, value)
    }))
  }

  return (
    <>
      {/* ===============================
            MAIN FORM MODAL
      =============================== */}
      <CommonModal
        isOpen={isOpen}
        onClose={() => {
          if (isFormChanged()) {
            setConfirmCloseOpen(true);
          } else {
            handleCancel();
          }
        }}
        diabled={!checkFormValid() || loading}
        title={t("room.createOrUpdate.titleCreate")}
        onSave={handleSave}
        saveLabel={loading ? t("common.saving") : t("common.save")}
        cancelLabel={t("common.cancelButton")}
        width="w-[95vw] sm:w-[90vw] lg:w-[1000px]"
      >
        {/* FORM CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* LEFT */}
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">
                {t("room.roomTypeName")} *
              </label>
              <select
                name="idRoomType"
                value={formData.idRoomType}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              >
                <option value="">
                  {" "}
                  {t("room.createOrUpdate.selectRoomType")}
                </option>
                {category.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.idRoomType && (
                <p className="text-red-500 text-xs">{errors.idRoomType}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                {t("room.createOrUpdate.roomNumber")} *
              </label>
              <input
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("room.createOrUpdate.enterRoomNumber")}
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              />
              {errors.roomNumber && (
                <p className="text-red-500 text-xs">{errors.roomNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.roomName")} *
                </label>
                <input
                  name="roomName"
                  placeholder={t("room.createOrUpdate.enterRoomName")}
                  value={formData.roomName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
                {errors.roomName && (
                  <p className="text-red-500 text-xs">{errors.roomName}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.floor")} *
                </label>
                <input
                  type="number"
                  name="floor"
                  placeholder={t("room.createOrUpdate.enterFloor")}
                  value={formData.floor}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
                {errors.floor && (
                  <p className="text-red-500 text-xs">{errors.floor}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                {t("room.createOrUpdate.area")} *
              </label>
              <input
                name="area"
                type="number"
                value={formData.area}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder={t("room.createOrUpdate.enterArea")}
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              />
              {errors.area && (
                <p className="text-red-500 text-xs">{errors.area}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                {t("room.createOrUpdate.capacity")} *
              </label>
              <input
                name="capacity"
                type="number"
                value={formData.capacity}
                onBlur={handleBlur}
                placeholder={t("room.createOrUpdate.enterCapacity")}
                onChange={handleChange}
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              />
              {errors.capacity && (
                <p className="text-red-500 text-xs">{errors.capacity}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                {t("room.createOrUpdate.note")}
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder={t("room.createOrUpdate.notePlaceholder")}
                className="w-full border border-[#4B62A0] bg-[#EEF0F7] rounded-lg p-2 outline-none"
                rows={4}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.priceBase")} *
                </label>
                <input
                  name="hourlyBasePrice"
                  type="number"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  value={formData.hourlyBasePrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
                {errors.hourlyBasePrice && (
                  <p className="text-red-500 text-xs">
                    {errors.hourlyBasePrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.priceExtraHour")}*
                </label>
                <input
                  name="hourlyAdditionalPrice"
                  type="number"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  value={formData.hourlyAdditionalPrice}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
                {errors.hourlyAdditionalPrice && (
                  <p className="text-red-500 text-xs">
                    {errors.hourlyAdditionalPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.priceOvernight")}*
                </label>
                <input
                  name="overnightPrice"
                  type="number"
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  value={formData.overnightPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
                {errors.overnightPrice && (
                  <p className="text-red-500 text-xs">
                    {errors.overnightPrice}
                  </p>
                )}
              
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  {t("room.createOrUpdate.priceFullDay")} *
                </label>
                <input
                  name="defaultRate"
                  type="number"
                  value={formData.defaultRate}
                  placeholder={t("room.createOrUpdate.enterPrice")}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
                {errors.defaultRate && (
                  <p className="text-red-500 text-xs">{errors.defaultRate}</p>
                )}
              </div>
            </div>

            {/* IMAGE UPLOAD PREVIEW */}
            <div>
              <label className="text-sm font-medium">
                {t("room.createOrUpdate.images")}
              </label>

              <div
                onClick={openImageModal}
                className="mt-2 border 
                border-gray-200 rounded-xl bg-gray-50 
                hover:bg-gray-100 p-4 
                sm:p-6 cursor-pointer transition flex flex-col items-center 
                min-h-[200px] sm:h-64"
              >
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {formData.images.map((img, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(img)}
                        className="w-full h-24 sm:h-28 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40">
                    <img
                      src="/defaultImage.png"
                      className="w-[167px] h-[117px] opacity-60"
                    />
                    <p className="text-gray-600 mt-3">
                      {t("room.createOrUpdate.clickSelectImages")}
                    </p>
                    <button
                      className="mt-3 w-full 
                      sm:w-auto px-6 sm:px-20 py-1.5 
                      rounded-full border 
                      border-[#42578E] bg-[#EEF0F7] text-[#42578E] text-sm"
                    >
                      {t("room.createOrUpdate.selectFiles")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CommonModal>

      {/* ===============================
            IMAGE PICKER POPUP
      =============================== */}
      <AnimatePresence>
        {imageModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-[95vw] sm:w-[90vw] lg:w-[900px] max-h-[90vh] rounded-2xl p-4 sm:p-6 lg:p-8 
              shadow-xl relative overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <button
                  className="px-5 py-1.5 rounded-full border hover:bg-gray-100"
                  onClick={() => {
                    setTempImages(formData.images);
                    setImageModalOpen(false);
                  }}
                >
                  <button>{t("common.cancelButton")}</button>
                </button>

                <h2 className="text-xl font-semibold">
                  {t("room.createOrUpdate.selectImages")}
                </h2>

                <button
                  className="px-5 py-1.5 rounded-full bg-black text-white hover:bg-gray-800"
                  onClick={() => {
                    const filtered = tempImages.filter((x) => x !== null);
                    setFormData((prev) => ({
                      ...prev,
                      images: filtered,
                    }));
                    setImageModalOpen(false);
                  }}
                >
                  {t("common.save")}
                </button>
              </div>

              {/* DROPZONE */}
              <div
                className="border-2 border-dashed border-[#D4D4E3] rounded-xl bg-[#FAFAFF] p-8 
     max-h-[500px] overflow-auto custom-scroll"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-blue-500");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("border-blue-500");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-blue-500");

                  const droppedFiles = Array.from(e.dataTransfer.files).filter(
                    (f) => f.type.startsWith("image/"),
                  ) as File[];

                  if (droppedFiles.length > 0) {
                    setTempImages((prev) => [...prev, ...droppedFiles]);
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

                    <p className="mt-4 text-gray-400">
                      {t("room.createOrUpdate.or")}
                    </p>

                    <label
                      htmlFor="filePicker"
                      className="mt-3 px-6 py-2 rounded-full border bg-white cursor-pointer hover:bg-gray-50"
                    >
                      {t("room.createOrUpdate.browseFiles")}
                    </label>

                    <input
                      id="filePicker"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e)}
                    />
                  </div>
                )}

                {/* WITH IMAGES */}
                {tempImages.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* LARGE IMAGE */}
                      <div className="col-span-2 relative">
                        <img
                          src={URL.createObjectURL(tempImages[0])}
                          className="w-full h-[220px] sm:h-[350px] object-cover rounded-xl"
                        />

                        <button
                          onClick={() => {
                            const clone = [...tempImages];
                            clone.splice(0, 1);
                            setTempImages(clone);
                          }}
                          className="absolute top-3 right-3 bg-black/60 text-white p-1.5 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* RIGHT SMALL IMAGES */}
                      <div className="flex flex-col gap-4">
                        {tempImages.slice(1).map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              className="w-full h-[120px] sm:h-[165px] object-cover rounded-xl"
                            />

                            <button
                              onClick={() => {
                                const clone = [...tempImages];
                                clone.splice(index + 1, 1);
                                setTempImages(clone);
                              }}
                              className="absolute top-2 right-2 bg-black/60 text-white p-[3px] rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ALWAYS SHOW {t("room.createOrUpdate.browseFiles")} HERE */}
                    <div className="flex justify-center mt-8">
                      <label
                        htmlFor="filePickerMore"
                        className="px-6 py-2 rounded-full border bg-white cursor-pointer hover:bg-gray-50"
                      >
                        {t("room.createOrUpdate.browseFiles")}
                      </label>

                      <input
                        id="filePickerMore"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e)}
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===============================
            CONFIRM CLOSE
      =============================== */}
      {confirmCloseOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-lg w-[90vw] sm:w-[360px] shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setConfirmCloseOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold">
              {t("room.createOrUpdate.confirmCloseTitle")}
            </h2>

            <p className="text-gray-600 mt-2">
              {t("room.createOrUpdate.confirmCloseDesc")}
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => {
                  setConfirmCloseOpen(false);
                  handleCancel();
                }}
              >
                {t("common.cancelButton")}
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => {
                  setConfirmCloseOpen(false);
                  handleSave();
                }}
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomFormModal;
