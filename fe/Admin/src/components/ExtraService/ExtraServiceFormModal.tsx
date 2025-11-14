import { useEffect, useState } from "react";
import CommonModal from "../ui/CommonModal";
import type { ExtraServiceFormModalProps } from "../../type";
import { addExtraService } from "../../service/api/ExtraService";
import { useAlert } from "../alert-context";
import { getAllCategory } from "../../service/api/Category";

const ExtraServiceFormModal = ({
    isOpen,
    onClose,
    onSuccess,
}: ExtraServiceFormModalProps) => {
    const [formData, setFormData] = useState({
        serviceName: "",
        price: "",
        categoryId: "",
        unit: "",
        description: "",
        note: "",
        priceType: "1",
        extraCharge: ""
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const [categories, setCategories] = useState<any[]>([]);
    const fetchCategories = async () => {
        try {
            setLoading(true)
            const res = await getAllCategory({ page: 1, size: 10, searchField: "type", searchValue: "2", filter: "isActive==1" });
            setCategories(res.content || []);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCategories()
    }, [isOpen])
    // ✅ Xử lý thay đổi input
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleCancel = () => {
        setFormData({
            serviceName: "",
            price: "",
            categoryId: "",
            unit: "",
            description: "",
            note: "",
            priceType: "1",
            extraCharge: ""
        })
        onClose();
    }
    // ✅ Xử lý lưu (khi bấm Save)
    const handleSave = async () => {
        setSaving(true);
        try {
            const cleanedData = Object.fromEntries(
                Object.entries({
                    serviceName: formData.serviceName.trim(),
                    price: Number(formData.price),
                    categoryId: Number(formData.categoryId),
                    unit: formData.unit.trim(),
                    description: formData.description.trim(),
                    currency: "VNĐ",
                    isActive: true,
                    note: formData.note.trim(),
                    extraCharge: formData.extraCharge
                }).map(([key, value]) => [
                    key,
                    value?.toString().trim() === "" ? null : value,
                ])
            );
            const response = await addExtraService(cleanedData);

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
                priceType: "1",
                extraCharge: ""
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
            setSaving(false);
        }
    };
    if (isOpen && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title="Create New Extra Service"
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
            title="Create New Extra Service"
            onSave={handleSave}
            saveLabel={saving ? "Saving..." : "Save"}
            cancelLabel="Cancel"
        >
            <div className="grid grid-cols-2 gap-4">
                {/* Service Name */}
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Service Name *
                    </label>
                    <input
                        type="text"
                        name="serviceName"
                        value={formData.serviceName}
                        onChange={handleChange}
                        placeholder="Enter service name"
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />
                </div>
                <div >
                    <label className="block mb-1 font-medium text-[#253150]">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Short description"
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        rows={1}
                    />
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
                {/* Unit */}
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Unit *
                    </label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    >
                        <option value="">Select Unit</option>
                        <option value="PERNIGHT">Per Night</option>
                        <option value="PERDAY">Per Day</option>
                        <option value="PERUSE">Per Use</option>
                        <option value="PERTRIP">Per Trip</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Price (VNĐ) *
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter service price"
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        min={0}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Extra Charge (%) *
                    </label>
                    <input
                        type="number"
                        name="extraCharge"
                        value={formData.extraCharge}
                        onChange={handleChange}
                        placeholder="Enter service extra charge"
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        min={0}
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
    );
};

export default ExtraServiceFormModal;
