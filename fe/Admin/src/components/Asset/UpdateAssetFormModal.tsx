import { useEffect, useState } from "react";
import type { UpdateAssetFormModalProps } from "../../type";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { findById, updateAsset } from "../../service/api/Asset";
import { getAllCategory } from "../../service/api/Category";

const UpdateAssetFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    room,
    assetId
}: UpdateAssetFormModalProps) => {
    const [formData, setFormData] = useState({
        id: "",
        assetName: "",
        categoryId: "",
        price: "",
        quantity: "",
        note: "",
        roomId: "",

    });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { showAlert } = useAlert();
    useEffect(() => {
        if (!isOpen || !assetId) return;
        setLoading(true);
        fetchCategories();
        findById(assetId)
            .then((res) => {
                const data = res?.data?.data;
                setFormData({
                    id: data.id || "",
                    assetName: data.assetName || "",
                    categoryId: data.categoryId || "",
                    price: data.price || 0,
                    quantity: data.quantity || 0,
                    note: data.note || "",
                    roomId: data.roomId || ""
                })
            })
            .catch(() => {
                showAlert({
                    title: "Failed to load category information!",
                    type: "error",
                });
                onClose();
            })
            .finally(() => setLoading(false));


    }, [isOpen, assetId]);
    const fetchCategories = async () => {
        try {
            const res = await getAllCategory({ page: 1, size: 10, searchField: "type", searchValue: "3", filter: "isActive==1" });
            setCategories(res.content || []);
        } catch (err) {
            console.log(err)
        }
    }
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleUpdate = async () => {
        setSaving(true);
        try {
            const payload = {
                assetName: formData.assetName,
                categoryId: formData.categoryId,
                roomId: formData.roomId,
                price: formData.price,
                quantity: formData.quantity,
                note: formData.note
            }
            const response = await updateAsset(Number(formData.id), payload);
            const message = response?.data?.message || "Asset updated successfully.";
            showAlert({
                title: message,
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
                    "Failed to update asset. Please try again.",
                type: "error",
                autoClose: 4000,
            })
        } finally {
            setSaving(false)
        }
    }
    const handleCancel = () => {
        setFormData({
            id: "",
            assetName: "",
            categoryId: "",
            price: "",
            quantity: "",
            note: "",
            roomId: "",

        })
        onClose();
    }
    if (isOpen && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title="Edit Amenities & Asset Tracking"
                saveLabel="Save"
                cancelLabel="Cancel"
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
            onSave={handleUpdate}
            title="Edit Amenities & Asset Tracking"
            saveLabel={saving ? "Saving..." : "Save"}
            cancelLabel="Cancel"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium text-[#253150]" >
                        Asset Name *
                    </label>
                    <input
                        type="text"
                        name="assetName"
                        placeholder="Enter asset name"
                        value={formData.assetName}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Room Number *
                    </label>
                    <select
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    >
                        <option value="">Enter number room</option>
                        {room.length > 0 ? (
                            room.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.roomNumber}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading...</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Category *
                    </label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.length > 0 ? (
                            categories.map((item) => (
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
                    <label className="block mb-1 font-medium text-[#253150]">
                        Price (VND) *
                    </label>
                    <input
                        type="text"
                        name="price"
                        placeholder="Enter room price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Quantity
                    </label>
                    <input
                        type="text"
                        name="quantity"
                        placeholder="Enter quantity (e.g. 1)"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>

                <div >
                    <label className="block mb-1 font-medium text-[#253150]">
                        Notes
                    </label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Add any notes (e.g. near window, pool view)"
                        className="w-full border border-[#253150] focus:border-[#3E5286] bg-[#EEF0F7] rounded-lg p-2 outline-none"
                        rows={1}
                    />
                </div>
            </div>
        </CommonModal>
    )
}
export default UpdateAssetFormModal;