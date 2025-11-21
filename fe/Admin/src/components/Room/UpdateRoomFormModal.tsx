import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { findById, updateRoom } from "../../service/api/Room";
import { File_URL } from "../../setting/constant/app";
import { getAllCategory } from "../../service/api/Category";

interface UpdateRoomFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    roomId: number | null;
}

const UpdateRoomFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    roomId
}: UpdateRoomFormModalProps) => {

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const { showAlert } = useAlert();
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        roomNumber: "",
        roomName: "",
        idRoomType: "",
        defaultRate: "",
        area: "",
        capacity: "",
        status: "",
        floor: "",
        hourlyBasePrice: "",
        hourlyAdditionalPrice: "",
        overnightPrice: "",
        note: "",
        images: [] as File[],
        oldImages: [] as string[],
    });

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [tempImages, setTempImages] = useState<(File | string)[]>([]);
    useEffect(() => {
        if (!isOpen || !roomId) return;

        setFetching(true);
        fetchCategories();
        findById(roomId)
            .then((res) => {
                const room = res?.data?.data;

                const oldImages = room?.images?.map((img: any) => File_URL + img.url) || [];

                setFormData({
                    roomNumber: room?.roomNumber || "",
                    roomName: room?.roomName || "",
                    idRoomType: room?.idRoomType || "",
                    defaultRate: room?.defaultRate || "",
                    area: room?.area || "",
                    capacity: room?.capacity || "",
                    status: room?.status || "",
                    floor: room?.floor || "",
                    hourlyBasePrice: room?.hourlyBasePrice || "",
                    hourlyAdditionalPrice: room?.hourlyAdditionalPrice || "",
                    overnightPrice: room?.overnightPrice || "",
                    note: room?.note || "",
                    images: [],
                    oldImages: oldImages
                });

                setTempImages(oldImages);
            })
            .catch(() => {
                showAlert({
                    title: "Failed to load room!",
                    type: "error"
                });
                onClose();
            })
            .finally(() => setFetching(false));
    }, [isOpen, roomId]);


    const handleChange = (e: any) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const fetchCategories = async () => {
        try {
            const res = await getAllCategory({ page: 1, size: 10, searchField: "type", searchValue: "1", filter: "isActive==1" });
            setCategories(res.content || []);
        } catch (err) {
            console.log(err)
        }
    }
    /** Update API */
    const handleUpdate = async () => {
        setLoading(true);

        try {
            const response = await updateRoom(Number(roomId), formData);

            showAlert({
                title: response?.data?.message || "Room updated successfully!",
                type: "success",
                autoClose: 2500,
            });

            onSuccess?.();
            onClose();
        } catch (err: any) {
            showAlert({
                title: err?.response?.data?.message || "Update failed!",
                type: "error",
                autoClose: 2500,
            });
        } finally {
            setLoading(false);
        }
    };

    /** Cancel */
    const handleCancel = () => {
        setTempImages([]);
        onClose();
    };
    if (isOpen && fetching) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title="Edit Room"
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
            <CommonModal
                isOpen={isOpen}
                onClose={handleCancel}
                onSave={handleUpdate}
                title="Edit Room"
                width="w-[1000px]"
                saveLabel={loading ? "Saving..." : "Save Changes"}
                cancelLabel="Cancel"
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
                                className="w-full border border-[#4B62A0] rounded-lg p-2"
                            >
                                <option value="">Select Room Type</option>
                                {categories.map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Room Number *</label>
                            <input
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                className="w-full border border-[#4B62A0] rounded-lg p-2"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Room Name *</label>
                                <input
                                    name="roomName"
                                    value={formData.roomName}
                                    onChange={handleChange}
                                    className="w-full border border-[#42578E] rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Floor *</label>
                                <input
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleChange}
                                    className="w-full border border-[#42578E] rounded-lg p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Area (m²) *</label>
                            <input
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full border border-[#42578E] rounded-lg p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-[#42578E] rounded-lg p-2"
                            >
                                <option value="0">Select Status</option>
                                <option value="1">Vacant - Dirty</option>
                                <option value="2">Occupied</option>
                                <option value="3">Available</option>
                                <option value="4">Maintenance</option>
                                <option value="5">Blocked</option>
                                <option value="6">Deactivated</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Capacity *</label>
                            <input
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full border border-[#42578E] rounded-lg p-2"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Notes</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                rows={4}
                                onChange={handleChange}
                                className="w-full border border-[#253150] bg-[#EEF0F7] rounded-lg p-2"
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Price (VND)</label>
                                <input
                                    type="number"
                                    name="hourlyBasePrice"
                                    value={formData.hourlyBasePrice}
                                    onChange={handleChange}
                                    className="w-full border border-[#42578E] rounded-lg p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Extra Hour Price</label>
                                <input
                                    type="number"
                                    name="hourlyAdditionalPrice"
                                    value={formData.hourlyAdditionalPrice}
                                    onChange={handleChange}
                                    className="w-full border border-[#42578E] rounded-lg p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Overnight Price</label>
                                <input
                                    type="number"
                                    name="overnightPrice"
                                    value={formData.overnightPrice}
                                    onChange={handleChange}
                                    className="w-full border border-[#42578E] rounded-lg p-2"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Day & Night Price</label>
                                <input
                                    type="number"
                                    name="defaultRate"
                                    value={formData.defaultRate}
                                    onChange={handleChange}
                                    className="w-full border border-[#42578E] rounded-lg p-2"
                                />
                            </div>
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="mt-6">
                            <label className="font-semibold">Images</label>

                            <div
                                onClick={() => setImageModalOpen(true)}
                                className="mt-2 border border-[#F2F2F2] rounded-xl bg-gray-50 p-6 cursor-pointer flex items-center justify-center h-64"
                            >
                                {tempImages.length === 0 ? (
                                    <img
                                        src="/defaultImage.png"
                                        className="w-[180px] h-[130px] opacity-50"
                                    />
                                ) : (
                                    <div className="grid grid-cols-3 gap-3 w-full h-full">
                                        {tempImages.map((img, i) => (
                                            <img
                                                key={i}
                                                src={typeof img === "string" ? img : URL.createObjectURL(img)}
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
                            <div className="flex justify-between mb-4">
                                <h2 className="text-lg font-semibold">Select images</h2>
                                <X
                                    className="cursor-pointer"
                                    onClick={() => setImageModalOpen(false)}
                                />
                            </div>

                            {/* Layout main + small images */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Main */}
                                <div className="col-span-2">
                                    {tempImages.length === 0 ? (
                                        <div className="w-full h-[260px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                            No image selected
                                        </div>
                                    ) : (
                                        <img
                                            src={
                                                typeof tempImages[0] === "string"
                                                    ? tempImages[0]
                                                    : URL.createObjectURL(tempImages[0])
                                            }
                                            className="w-full h-[260px] object-cover rounded-lg"
                                        />
                                    )}
                                </div>

                                {/* Right small images */}
                                <div className="grid grid-cols-2 gap-3">
                                    {tempImages.slice(1).map((img, idx) => (
                                        <div key={idx} className="relative cursor-pointer">
                                            <img
                                                src={
                                                    typeof img === "string"
                                                        ? img
                                                        : URL.createObjectURL(img)
                                                }
                                                className="w-[160px] h-[115px] object-cover rounded-lg"
                                            />

                                            {/* DELETE */}
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

                            {/* Upload */}
                            <div className="text-center mt-6">
                                <label
                                    htmlFor="filePicker"
                                    className="px-6 py-2 rounded-full border border-[#42578E] bg-[#EEF0F7] text-[#42578E] cursor-pointer"
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
                                        const files = Array.from(e.target.files ?? []);

                                        if (files.length > 0) {
                                            setTempImages((prev) => [...prev, ...files]);
                                            setTimeout(() => setImageModalOpen(false), 200);
                                        }
                                    }}
                                />


                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UpdateRoomFormModal;
