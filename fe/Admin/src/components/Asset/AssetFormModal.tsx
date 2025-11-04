import { useState } from "react"
import type { AssetFormModalProps } from "../../type"
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { createAsset } from "../../service/api/Asset";

const AssetFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    category,
    room
}: AssetFormModalProps) => {
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        assetName: "",
        categoryId: "",
        price: "",
        quantity: "",
        note: "",
        roomId: ""
    });
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSave = async () => {
        setLoading(true)
        try {
            const cleanedData = Object.fromEntries(
                Object.entries({
                  assetName: formData.assetName,
                  categoryId: formData.categoryId,
                  roomId: formData.roomId,
                  price: formData.price,
                  quantity: formData.quantity,
                  note: formData.note,
                }).map(([key, value]) => [
                  key,
                  value?.toString().trim() === "" ? null : value,
                ])
              );
            const response = await createAsset(cleanedData);
            showAlert({
                title: response?.data?.message || "Asset created successfully.",
                type: "success",
                autoClose: 3000,
            });
            setFormData({
                assetName: "",
                categoryId: "",
                price: "",
                quantity: "",
                note: "",
                roomId: ""
            });
            onSuccess();
        } catch (err: any) {
            console.error("Create error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to create asset. Please try again.",
                type: "error",
                autoClose: 4000,
            });
        } finally {
            setLoading(false)
        }
    }
    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={handleSave}
            title="Create New Asset"
            saveLabel={loading ? "Saving..." : "Save"}
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
export default AssetFormModal