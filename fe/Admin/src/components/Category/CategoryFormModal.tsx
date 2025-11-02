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
            const response = await addCategory(formData);
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
        } catch (error) {
            console.error("Error creating category:", error);
            showAlert({
                title: "Failed to create category.",
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