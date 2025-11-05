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
        type: ""
    })
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const handleChange =(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    )=>{
        const { name, value } = e.target;   
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const handleSave = async () => {    
        setLoading(true);
        try {
            const cleanedData = Object.fromEntries(
                Object.entries({
                    name: formData.name,
                    type: formData.type
                }).map(([key, value]) => [
                  key,
                  value?.toString().trim() === "" ? null : value,
                ])
              );
            const response = await addCategory(cleanedData);
            showAlert({
                title: response?.data?.message||"Category created successfully.",
                type: "success",
                autoClose: 3000,
            });
            setFormData({
                name: "",
                type: ""
            });
            onSuccess();
        } catch (err:any) {
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
    const handleCancel=()=>{
        setFormData({
            name: "",
            type: ""
        })
        onClose();
    }
    return (
        <CommonModal
            isOpen={isOpen}
            onClose={handleCancel}
            title="Create Category Service"
            onSave={handleSave}
            saveLabel={loading ? "Saving..." : "Save"}
            cancelLabel="Cancel"
        >
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter service name"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    >
                        <option value="">Select type</option>
                        <option value="1">Room</option>
                        <option value="2">Extra Service</option>
                        <option value="3">Asset</option>
                    </select>
                </div>

            </div>
        </CommonModal>
    )
}
export default CategoryFormModal;