import { useState } from "react";
import CommonModal from "../ui/CommonModal";
import type { ExtraServiceFormModalProps } from "../../type";
import { addExtraService } from "../../service/api/ExtraService";
import { useAlert } from "../alert-context";

const ExtraServiceFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    category,
}: ExtraServiceFormModalProps) => {
    const [formData, setFormData] = useState({
        serviceName: "",
        price: "",
        categoryId: "",
        unit: "",
        description: "",
        note: "",
    });

    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    // ✅ Xử lý thay đổi input
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Xử lý lưu (khi bấm Save)
    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                serviceName: formData.serviceName.trim(),
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
                unit: formData.unit.trim(),
                description: formData.description.trim(),
                currency: "VNĐ",
                isActive: true,
                note: formData.note.trim(),
            };

            const response = await addExtraService(payload);

            // ✅ response có thể là AxiosResponse hoặc đã unwrap data
            const message =
                response?.data?.message ||
                "Extra service created successfully!";

            showAlert({
                title: message,
                type: "success",
                autoClose: 3000,
            });

            // Reset form và callback
            setFormData({
                serviceName: "",
                price: "",
                categoryId: "",
                unit: "",
                description: "",
                note: "",
            });

            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Create error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to create extra service. Please try again.",
                type: "error",
                autoClose: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Extra Service"
            onSave={handleSave}
            saveLabel={loading ? "Saving..." : "Save"}
            cancelLabel="Cancel"
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Service Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                        placeholder="Enter service name"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        min={0}
                        required
                    />
                </div>

                {/* Category */}
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

                {/* Unit */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    >
                        <option value="">Select Unit</option>
                        <option value="PERNIGHT">Per Night</option>
                        <option value="PERDAY">Per Day</option>
                        <option value="PERUSE">Per Use</option>
                        <option value="PERTRIP">Per Trip</option>
                    </select>
                </div>

                {/* Description */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter service description"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        rows={3}
                    />
                </div>

                {/* Note */}
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
    );
};

export default ExtraServiceFormModal;
