import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImagePlus } from "lucide-react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { updateRoom } from "../../service/api/Room";
import type { RoomFormModalProps } from "../../type";
import { File_URL } from "../../setting/constant/app";

interface UpdateRoomFormModalProps
    extends Omit<RoomFormModalProps, "onSuccess"> {
    roomData: any;
    onSuccess?: () => void;
}

const UpdateRoomFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    category,
    roomData,
}: UpdateRoomFormModalProps) => {
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
        oldImages: [] as string[], // chứa URL ảnh cũ
    });

    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    // 🟢 Load dữ liệu phòng khi mở modal
    useEffect(() => {
        if (roomData) {
            setFormData({
                roomNumber: roomData.roomNumber || "",
                roomName: roomData.roomName || "",
                idRoomType: roomData.idRoomType || "",
                defaultRate: roomData.defaultRate || "",
                area: roomData.area || "",
                capacity: roomData.capacity || "",
                floor: roomData.floor || "",
                hourlyBasePrice: roomData.hourlyBasePrice || "",
                hourlyAdditionalPrice: roomData.hourlyAdditionalPrice || "",
                overnightPrice: roomData.overnightPrice || "",
                note: roomData.note || "",
                images: [],
                oldImages: roomData.images?.map((img: any) => img.url) || [],
            });
        }
    }, [roomData]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []) as File[];
        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...files],
            }));
        }
    };

    const handleRemoveImage = (index: number, isOld: boolean) => {
        setFormData((prev) => {
            if (isOld) {
                const updatedOld = [...prev.oldImages];
                updatedOld.splice(index, 1);
                return { ...prev, oldImages: updatedOld };
            } else {
                const updatedNew = [...prev.images];
                updatedNew.splice(index, 1);
                return { ...prev, images: updatedNew };
            }
        });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await updateRoom(roomData.id, formData);
            showAlert({
                title: response?.data?.message || "Room updated successfully!",
                type: "success",
                autoClose: 3000,
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Update error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to update room. Please try again.",
                type: "error",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Room"
            onSave={handleUpdate}
            saveLabel={loading ? "Saving..." : "Save Changes"}
            cancelLabel="Cancel"
        >
            {/* Tabs */}
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

            {/* Nội dung từng tab */}
            <AnimatePresence mode="wait">
                {activeTab === "basic" ? (
                    <motion.div
                        key="basic"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* --- Basic Fields --- */}
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Room Number
                                </label>
                                <input
                                    type="text"
                                    name="roomNumber"
                                    value={formData.roomNumber}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Room Name
                                </label>
                                <input
                                    type="text"
                                    name="roomName"
                                    value={formData.roomName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Capacity
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Floor
                                </label>
                                <input
                                    type="number"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Area (m²)
                                </label>
                                <input
                                    type="number"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
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
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select Room Type</option>
                                    {category.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
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
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        {/* --- Image Section --- */}
                        <div className="mt-8">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Room Images
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...formData.oldImages.map((url) => ({ url, isOld: true })),
                                ...formData.images.map((file) => ({ file, isOld: false }))].map(
                                    (img, index) => {
                                        const isMain = index === 0;
                                        const src = "url" in img ? File_URL + img.url : URL.createObjectURL(img.file);

                                        return (
                                            <div
                                                key={index}
                                                className={`relative group rounded-xl overflow-hidden shadow-md border-2 transition-all duration-300 ${isMain
                                                    ? "border-blue-500"
                                                    : "border-transparent hover:border-gray-300"
                                                    }`}
                                            >
                                                <img
                                                    src={src}
                                                    alt={`room-${index}`}
                                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index, img.isOld)}
                                                    className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={16} />
                                                </button>
                                                {isMain && (
                                                    <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                                        🏠 Main Image
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }
                                )}

                            </div>

                            {/* Upload */}
                            <label
                                htmlFor="imageUpload"
                                className="flex flex-col items-center justify-center h-48 mt-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer"
                            >
                                <ImagePlus className="w-10 h-10 text-blue-500 mb-2" />
                                <p className="text-sm text-gray-700 font-medium">
                                    Click to upload or drag & drop
                                </p>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                multiple
                                className="hidden"
                                id="imageUpload"
                            />
                        </div>

                        {/* Notes */}
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

export default UpdateRoomFormModal;
