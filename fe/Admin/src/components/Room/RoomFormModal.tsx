import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImagePlus } from "lucide-react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { createRoom } from "../../service/api/Room";
import type { RoomFormModalProps } from "../../type";

const RoomFormModal = ({ isOpen, onClose, onSuccess, category }: RoomFormModalProps) => {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

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
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await createRoom(formData);
      showAlert({
        title: response?.data?.message || "Room created successfully!",
        type: "success",
        autoClose: 3000
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
        images: [] as File[],
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Create error:", err);
      showAlert({
        title: err?.response?.data?.message || "Failed to create room. Please try again.",
        type: "error",
        autoClose: 3000
      })
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []) as File[];
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Room"
      onSave={handleSave}
      saveLabel={loading ? "Saving..." : "Save"}
      cancelLabel="Cancel"
    >
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 mb-6">
        {["basic", "advanced"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2 text-sm font-semibold transition-all ${activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab === "basic" ? "Basic Info" : "Advanced Pricing"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "basic" ? (
          <motion.div
            key="basic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Basic Info Fields */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="Enter room number"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleChange}
                  placeholder="Enter room name"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Enter room name"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor
                </label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="Enter floor"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Enter Area"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  name="idRoomType"
                  value={formData.idRoomType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                >
                  <option value="">Select Room Type</option>
                  {category.length > 0 ? (
                    category.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading...</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price / Full Day
                </label>
                <input
                  type="number"
                  name="defaultRate"
                  value={formData.defaultRate}
                  onChange={handleChange}
                  placeholder="e.g. 1,000,000"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="mt-8">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Room Images
              </label>

              {/* Upload Input */}
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer"
              >
                <ImagePlus className="w-10 h-10 text-blue-500 mb-2" />
                <p className="text-sm text-gray-700 font-medium">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, PNG, JPEG
                </p>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []) as File[];
                  if (files.length > 0) {
                    setFormData((prev) => ({
                      ...prev,
                      images: [...prev.images, ...files],
                    }));

                    // 🟢 Nếu chưa có ảnh chính → set ảnh đầu tiên
                    if (mainImageIndex === null) setMainImageIndex(0);
                  }
                }}
                multiple
                className="hidden"
                id="imageUpload"
              />

              {formData.images.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.images.map((file, index) => {
                    const isMain = mainImageIndex === index;
                    return (
                      <div
                        key={index}
                        className={`relative group rounded-xl overflow-hidden shadow-md border-2 transition-all duration-300 ${isMain
                            ? "border-blue-500"
                            : "border-transparent hover:border-gray-300"
                          }`}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`room-${index}`}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));

                            // 🟡 Nếu xóa ảnh đang là main → gán main mới
                            if (mainImageIndex === index) {
                              setMainImageIndex(
                                formData.images.length > 1 ? 0 : null
                              );
                            } else if (
                              mainImageIndex !== null &&
                              index < mainImageIndex
                            ) {
                              // Nếu xóa ảnh trước ảnh chính, index chính bị giảm
                              setMainImageIndex(mainImageIndex - 1);
                            }
                          }}
                          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <X size={16} />
                        </button>

                        {/* Main Label */}
                        {isMain && (
                          <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                             Main Image
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional info..."
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Advanced Pricing Fields */}
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price / First 2 Hours
                </label>
                <input
                  type="number"
                  name="hourlyBasePrice"
                  value={formData.hourlyBasePrice}
                  onChange={handleChange}
                  placeholder="e.g. 300,000"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price / Extra Hour
                </label>
                <input
                  type="number"
                  name="hourlyAdditionalPrice"
                  value={formData.hourlyAdditionalPrice}
                  onChange={handleChange}
                  placeholder="e.g. 80,000"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price / Overnight
                </label>
                <input
                  type="number"
                  name="overnightPrice"
                  value={formData.overnightPrice}
                  onChange={handleChange}
                  placeholder="e.g. 500,000"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>


          </motion.div>
        )}
      </AnimatePresence>
    </CommonModal>
  );
};

export default RoomFormModal;
