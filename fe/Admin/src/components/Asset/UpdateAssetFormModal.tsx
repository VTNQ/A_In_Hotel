import { useEffect, useState } from "react";
import type { UpdateAssetFormModalProps } from "../../type";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { updateAsset } from "../../service/api/Asset";

const UpdateAssetFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    category,
    room,
    assetData
}: UpdateAssetFormModalProps) => {
    const [formData, setFormData] = useState({
        assetName: "",
        categoryId: "",
        price: "",
        quantity: "",
        note: "",
        roomId: ""
    });
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    useEffect(() => {
        if (assetData) {
            setFormData({
                assetName: assetData.assetName || "",
                categoryId: assetData.categoryId || "",
                price: assetData.price || 0,
                quantity: assetData.quantity || 0,
                note: assetData.note || "",
                roomId: assetData.roomId || ""
            })
        }
    }, [assetData, isOpen])
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleUpdate = async () => {
        setLoading(true);
        try {
            const payload = {
                assetName: formData.assetName,
                categoryId: formData.categoryId,
                roomId: formData.roomId,
                price: formData.price,
                quantity: formData.quantity,
                note: formData.note
            }
            const response=await updateAsset(assetData.id,payload);
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
        }finally{
            setLoading(false)
        }
    }
    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleUpdate}
            title="Update Asset"
            saveLabel={loading ? "Updating..." : "Update"}
            cancelLabel="Cancel"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asset Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="assetName"
                        value={formData.assetName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    >
                        <option value="">Select Room</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    >
                        <option value="">Select Category</option>
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
                        Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                    </label>
                    <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />

                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note
                    </label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Enter any additional notes"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        rows={2}
                    />
                </div>
            </div>
        </CommonModal>
    )
}
export default UpdateAssetFormModal;