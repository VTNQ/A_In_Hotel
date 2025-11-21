import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { createRoom } from "../../service/api/Room";
import type { RoomFormModalProps } from "../../type";
import { getAllCategory } from "../../service/api/Category";

const RoomFormModal = ({ isOpen, onClose, onSuccess }: RoomFormModalProps) => {
  // ============================
  // FORM STATE
  // ============================
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
  const fetchCategories = async () => {
    try {
      setFetching(true)
      const res = await getAllCategory({ page: 1, size: 10, searchField: "type", searchValue: "1", filter: "isActive==1" });
      setCategory(res.content || []);
    } catch (err) {
      console.log(err)
    } finally {
      setFetching(false);
    }
  }
  useEffect(() => {
    fetchCategories();
  }, [isOpen])
  // ============================
  // POPUP STATE
  // ============================
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [tempImages, setTempImages] = useState<File[]>([]);

  // ============================
  // OPEN POPUP
  // ============================
  const openImageModal = () => {
    setTempImages(formData.images); // copy ảnh hiện tại sang popup
    setImageModalOpen(true);
  };


  // ============================
  // HANDLE INPUT CHANGE
  // ============================
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ============================
  // SAVE FORM
  // ============================
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await createRoom(formData);

      showAlert({
        title: response?.data?.message || "Room created successfully!",
        type: "success",
        autoClose: 3000
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      showAlert({
        title: err?.response?.data?.message || "Failed to create room.",
        type: "error",
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // CANCEL FORM
  // ============================
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
  if (isOpen && fetching) {
    return (
      <CommonModal
        isOpen={true}
        onClose={handleCancel}
        title="Create New Room"
        saveLabel="Save"
        cancelLabel="Cancel"
        width="w-[1000px]"
      >
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      </CommonModal>
    );
  }
  return (

    <>
      {/* MAIN CREATE ROOM MODAL */}
      <CommonModal
        isOpen={isOpen}
        onClose={handleCancel}
        title="Create New Room"
        onSave={handleSave}
        saveLabel={loading ? "Saving..." : "Save"}
        cancelLabel="Cancel"
        width="w-[1000px]"
      >
        <div className="grid grid-cols-2 gap-10">

          {/* LEFT SIDE FORM */}
          <div className="space-y-5">

            <div>
              <label className="block mb-1 font-medium">Room Type *</label>
              <select
                name="idRoomType"
                value={formData.idRoomType}
                onChange={handleChange}
                className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
              >
                <option value="">Select Room Type</option>
                {category.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Room Number *</label>
              <input
                name="roomNumber"
                placeholder="Enter Room"
                value={formData.roomNumber}
                onChange={handleChange}
                className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Room Name *</label>
                <input
                  name="roomName"
                  placeholder="Enter room name"
                  value={formData.roomName}
                  onChange={handleChange}
                  className="w-full border border-[#42578E] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Floor *</label>
                <input
                  name="floor"
                  value={formData.floor}
                  placeholder="Enter floor"
                  onChange={handleChange}
                  className="w-full border border-[#42578E] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Area (m²) *</label>
              <input
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter area"
                className="w-full border border-[#42578E] focus:border-[#3E5286] rounded-lg p-2 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Capacity *</label>
              <input
                name="capacity"
                value={formData.capacity}
                placeholder="Enter capacity"
                onChange={handleChange}
                className="w-full border border-[#42578E] focus:border-[#3E5286] rounded-lg p-2 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                name="note"
                value={formData.note}
                placeholder="Add any notes (e.g. near window, pool view)"
                onChange={handleChange}
                rows={4}
                className="w-full border border-[#253150] focus:border-[#3E5286] bg-[#EEF0F7] rounded-lg p-2 outline-none"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              {/* Price fields */}
              <div>
                <label className="block mb-1 font-medium">Price (VND) *</label>
                <input
                  type="number"
                  name="hourlyBasePrice"
                  placeholder="Enter room price"
                  value={formData.hourlyBasePrice}
                  onChange={handleChange}
                  className="w-full border border-[#42578E] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Extra Hour Price</label>
                <input
                  type="number"
                  name="hourlyAdditionalPrice"
                  placeholder="Enter room price"
                  value={formData.hourlyAdditionalPrice}
                  onChange={handleChange}
                  className="w-full border border-[#42578E] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Price Overnight (VND) *</label>
                <input
                  type="number"
                  name="overnightPrice"
                  placeholder="Enter room price"
                  value={formData.overnightPrice}
                  onChange={handleChange}
                  className="w-full border border-[#42578E] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Price day & night (VND) *</label>
                <input
                  type="number"
                  name="defaultRate"
                  placeholder="Enter room price"
                  value={formData.defaultRate}
                  onChange={handleChange}
                  className="w-full border border-[#42578E] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="text-sm font-medium">Image</label>

              <div
                onClick={openImageModal}
                className="
                  mt-2 border border-[#F2F2F2] rounded-xl bg-gray-50 hover:bg-gray-100 p-6 
                  cursor-pointer transition
                  flex flex-col items-center justify-center 
                  text-center h-64
                "
              >
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index}>
                        <img
                          src={URL.createObjectURL(img)}
                          className="w-full h-28 object-cover rounded-lg"
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center h-40">
                      <img
                        src="/defaultImage.png"
                        className="w-[167px] h-[117px] opacity-60"
                        alt=""
                      />
                      <p className="text-gray-600 mt-3">Click to select images</p>
                      <button className="mt-3 px-20 py-1.5 rounded-full border border-[#42578E] bg-[#EEF0F7] text-[#42578E] text-sm">
                        Select files
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CommonModal>

      {/* ==============================
          IMAGE SELECT POPUP
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
              className="bg-white w-[840px] rounded-xl p-6 shadow-xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">Select images</h2>
                <X className="w-6 h-6 cursor-pointer" onClick={() => setImageModalOpen(false)} />
              </div>
              {tempImages.length === 0 && (
                <div className="w-full h-[260px] bg-gray-100 rounded-lg border border-gray-300 
                  flex items-center justify-center text-gray-400">
                  No image selected
                </div>
              )}

              {/* MAIN LAYOUT: LEFT = MAIN IMAGE, RIGHT = SMALL GRID */}
              {tempImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4">

                  {/* LEFT — MAIN IMAGE */}
                  <div className="col-span-2">
                    {tempImages.length > 0 ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(tempImages[0])}
                          className="w-full h-[260px] object-cover rounded-lg border border-gray-300"
                        />

                        {/* DELETE MAIN IMAGE */}
                        <button
                          onClick={() => {
                            const clone = [...tempImages];
                            clone.splice(0, 1);
                            setTempImages(clone);
                          }}
                          className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-[260px] bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400">
                        No image selected
                      </div>

                    )}
                  </div>

                  {/* RIGHT — SMALL IMAGES */}
                  <div className="grid grid-cols-2 gap-3">
                    {tempImages.slice(1).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group cursor-pointer flex justify-center"
                        onClick={() => {
                          const clone = [...tempImages];
                          const clicked = clone[idx + 1];
                          clone[idx + 1] = clone[0];
                          clone[0] = clicked;
                          setTempImages(clone);
                        }}
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          className="
w-[160px]
h-[115px]
object-cover
rounded-lg
border border-gray-300
group-hover:opacity-80
"
                        />

                        {/* nút xóa */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const clone = [...tempImages];
                            clone.splice(idx + 1, 1);
                            setTempImages(clone);
                          }}
                          className="absolute top-2 right-2 bg-black/60 text-white p-[2px] rounded-full"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}


              {/* FILE PICKER + CONFIRM */}
              <div className="text-center mt-6">
                <label
                  htmlFor="filePicker"
                  className="mt-4 px-6 py-2 bg-[#42578E] text-white rounded-lg ml-4 cursor-pointer"
                >
                  Add images
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
                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, ...files],
                      }));


                      setImageModalOpen(false);
                    }
                  }}

                />

                {/* Confirm */}

                <p className="text-xs text-gray-500 mt-2">
                  Supported: JPG, PNG • Min 600×600px
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default RoomFormModal;
