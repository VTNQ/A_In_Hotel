import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { createRoom } from "../../service/api/Room";
import type { RoomFormModalProps } from "../../type";
import { getAllCategory } from "../../service/api/Category";

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
        searchField: "type",
        searchValue: "1",
        filter: "isActive==1",
      });
      setCategory(res.content || []);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
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
      if (formData[key as keyof typeof formData] !== initialData[key as keyof typeof formData]) {
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
    setLoading(true);
    try {
      const response = await createRoom(formData);

      showAlert({
        title: response?.data?.message || "Room created successfully!",
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
        title: err?.response?.data?.message || "Failed to create room.",
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
    onClose();
  };

  /* ===============================
      CONFIRM CLOSE MODAL
  =============================== */
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);

  if (isOpen && fetching) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title="Create New Room"
        saveLabel="Save"
        cancelLabel="Cancel"
        width="w-[95vw] sm:w-[90vw] lg:w-[1000px]"

      >
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      </CommonModal>
    );
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

        title="Create New Room"
        onSave={handleSave}
        saveLabel={loading ? "Saving..." : "Save"}
        cancelLabel="Cancel"
        width="w-[95vw] sm:w-[90vw] lg:w-[1000px]"
      >
        {/* FORM CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">


          {/* LEFT */}
          <div className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Room Type *</label>
              <select
                name="idRoomType"
                value={formData.idRoomType}
                onChange={handleChange}
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              >
                <option value="">Select Room Type</option>
                {category.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Room Number *</label>
              <input
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="Enter room number"
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Room Name *</label>
                <input
                  name="roomName"
                  placeholder="Enter room name"
                  value={formData.roomName}
                  onChange={handleChange}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Floor *</label>
                <input
                  type="number"
                  name="floor"
                  placeholder="Enter floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Area (m²) *</label>
              <input
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter area"
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Capacity *</label>
              <input
                name="capacity"
                type="number"
                value={formData.capacity}
                placeholder="Enter capacity"
                onChange={handleChange}
                className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Add any notes (e.g. near window, pool view)"
                className="w-full border border-[#4B62A0] bg-[#EEF0F7] rounded-lg p-2 outline-none"
                rows={4}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Price (VND) *</label>
                <input
                  name="hourlyBasePrice"
                  type="number"
                  placeholder="Enter room price"
                  value={formData.hourlyBasePrice}
                  onChange={handleChange}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Price Extra Hour (VND)*</label>
                <input
                  name="hourlyAdditionalPrice"
                  type="number"
                  placeholder="Enter room price"
                  value={formData.hourlyAdditionalPrice}
                  onChange={handleChange}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Price Overnight (VND)*
                </label>
                <input
                  name="overnightPrice"
                  type="number"
                  placeholder="Enter room price"
                  value={formData.overnightPrice}
                  onChange={handleChange}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Price day & night (VND) *
                </label>
                <input
                  name="defaultRate"
                  type="number"
                  value={formData.defaultRate}
                  placeholder="Enter room price"
                  onChange={handleChange}
                  className="w-full border border-[#4B62A0] rounded-lg p-2 outline-none"
                />
              </div>
            </div>

            {/* IMAGE UPLOAD PREVIEW */}
            <div>
              <label className="text-sm font-medium">Images</label>

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
                    <p className="text-gray-600 mt-3">Click to select images</p>
                    <button
                      className="mt-3 w-full 
                      sm:w-auto px-6 sm:px-20 py-1.5 
                      rounded-full border 
                      border-[#42578E] bg-[#EEF0F7] text-[#42578E] text-sm"
                    >
                      Select files
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
                  Cancel
                </button>

                <h2 className="text-xl font-semibold">Select images</h2>

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
                  Save
                </button>
              </div>

              {/* DROPZONE */}
              <div className="border-2 border-dashed border-[#D4D4E3] rounded-xl bg-[#FAFAFF] p-8 
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
                    (f) => f.type.startsWith("image/")
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

                    <p className="mt-4 font-medium">Drag and drop an image</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG | Max. ....MB | Min. 600px x 600px
                    </p>

                    <p className="mt-4 text-gray-400">OR</p>

                    <label
                      htmlFor="filePicker"
                      className="mt-3 px-6 py-2 rounded-full border bg-white cursor-pointer hover:bg-gray-50"
                    >
                      Browse Files
                    </label>

                    <input
                      id="filePicker"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []) as File[];
                        if (files.length > 0) {
                          setTempImages(files);
                        }
                      }}
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

                    {/* ALWAYS SHOW BROWSE FILES HERE */}
                    <div className="flex justify-center mt-8">
                      <label
                        htmlFor="filePickerMore"
                        className="px-6 py-2 rounded-full border bg-white cursor-pointer hover:bg-gray-50"
                      >
                        Browse Files
                      </label>

                      <input
                        id="filePickerMore"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files ?? []) as File[];

                          if (files.length > 0) {
                            const clone = [...tempImages, ...files];
                            setTempImages(clone);
                          }
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
              Do you want to save changes?
            </h2>

            <p className="text-gray-600 mt-2">
              Your changes will be lost if you don't save.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">

              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => {
                  setConfirmCloseOpen(false);
                  handleCancel();
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => {
                  setConfirmCloseOpen(false);
                  handleSave();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomFormModal;
