import { useState } from "react"
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import type { CategoryFormModalProps } from "../../type";
import { addCategory } from "../../service/api/Category";

const CategoryFormModal = ({
    isOpen,
    onClose,
    onSuccess,
}: CategoryFormModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        description: ""
    })
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const handleSave = async () => {
        setLoading(true);
        try {
            const cleanedData = Object.fromEntries(
                Object.entries({
                    name: formData.name,
                    type: formData.type,
                    description: formData.description
                }).map(([key, value]) => [
                    key,
                    value?.toString().trim() === "" ? null : value,
                ])
            );
            const response = await addCategory(cleanedData);
            showAlert({
                title: response?.data?.message || "Category created successfully.",
                type: "success",
                autoClose: 3000,
            });
            setFormData({
                name: "",
                type: "",
                description: ""
            });
            onSuccess();
        } catch (err: any) {
            console.error("Create error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to create category. Please try again.",
                type: "error",
                autoClose: 4000,
            });
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setFormData({
            name: "",
            type: "",
            description: ""
        })
        onClose();
    }
    return (
        <CommonModal
            isOpen={isOpen}
            onClose={handleCancel}
            title="Create Category "
            onSave={handleSave}
            saveLabel={loading ? "Saving..." : "Save"}
            cancelLabel="Cancel"
            width="w-[95vw] sm:w-[600px] lg:w-[800px]"
        >
            <h3 className="text-base sm:text-[18px] font-semibold text-[#000000] mb-3">
                Category Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter service name"
                        className="w-full border 
                        border-[#4B62A0] 
                        focus:border-[#3E5286] 
                        rounded-lg 
                        p-2.5
                        text-sm
                        sm:text-base
                        outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Type *
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border 
                        border-[#4B62A0] 
                        focus:border-[#3E5286] 
                        rounded-lg 
                        p-2.5
                        text-sm
                        sm:text-base
                        outline-none"
                        required
                    >
                        <option value="">Select type</option>
                        <option value="1">Room</option>
                        <option value="2">Extra Service</option>
                        <option value="3">Asset</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block mb-1 font-medium text-[#253150]">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Short description"
                        className="w-full border 
                        border-[#4B62A0] 
                        focus:border-[#3E5286] 
                        rounded-lg 
                        p-2.5
                        text-sm
                        sm:text-base
                        outline-none"
                        rows={3}
                    />
                </div>
            </div>
        </CommonModal>
    )
}
export default CategoryFormModal;