import { useEffect, useState } from "react";
import type { UpdateExtraServiceFormModalProps } from "../../type";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { findById, updateExtraService } from "../../service/api/ExtraService";
import { getAllCategory } from "../../service/api/Category";

const UpdateExtraServiceFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    serviceId,
}: UpdateExtraServiceFormModalProps) => {
    const [formData, setFormData] = useState({
        id: "",
        serviceName: "",
        price: "",
        categoryId: "",
        unit: "",
        description: "",
        note: "",
        priceType: "1",
        extraCharge: ""
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { showAlert } = useAlert();
    useEffect(() => {
        if (!isOpen || !serviceId) return;
        setLoading(true);
        fetchCategories();
        findById(serviceId)
            .then((res) => {
                const data = res?.data?.data;
             
                setFormData({
                    id: data?.id || "",
                    serviceName: data?.serviceName || "",
                    price: data?.price || "",
                    categoryId: data?.categoryId || "",
                    unit: data?.unit || "",
                    description: data?.description || "",
                    note: data?.note || "",
                    priceType: data?.priceTypeId || "",
                    extraCharge: data?.extraCharge || ""
                });
            })
            .catch(() => {
                showAlert({
                    title: "Failed to load extra service information!",
                    type: "error",
                });
                onClose();
            })
            .finally(() => setLoading(false));
          
    }, [isOpen, serviceId]);
   
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const fetchCategories = async () => {
        try {
            const res = await getAllCategory({ all:true, searchField: "type", searchValue: "2", filter: "isActive==1" });
            setCategories(res.content || []);
        } catch (err) {
            console.log(err)
        }
    }
    const handleUpdate = async () => {
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
                    note: formData.note.trim(),
                    extraCharge: formData.extraCharge
                }).map(([key, value]) => [
                    key,
                    value?.toString().trim() === "" ? null : value,
                ])
            );

            const response = await updateExtraService(Number(formData.id), cleanedData);
            const message =
                response?.data?.message || "Extra service updated successfully!";

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
                    "Failed to update extra service. Please try again.",
                type: "error",
                autoClose: 4000,
            });
        } finally {
            setSaving(false);
        }
    };
    const handleCancel = () => {
        setFormData({
            id: "",
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
    if (isOpen && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title="Edit Extra Service"
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
            title="Edit Extra Service"
            onSave={handleUpdate}
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
}
export default UpdateExtraServiceFormModal;