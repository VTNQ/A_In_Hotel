import { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import type { UpdateCategoryFormModalProps } from "../../type";
import CommonModal from "../ui/CommonModal";
import { updateCategory } from "../../service/api/Category";

const UpdateCategoryFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    categoryData,
}: UpdateCategoryFormModalProps) => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        type: ""
    });
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    useEffect(() => {
        if (categoryData) {
            setFormData({
                id: categoryData.id || "",
                name: categoryData.name || "",
                type: categoryData.idType || ""
            });
        }
    }, [categoryData, isOpen]);
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
            const cleanedData = Object.fromEntries(
                Object.entries({
                    name: formData.name,
                    type: formData.type
                }).map(([key, value]) => [
                  key,
                  value?.toString().trim() === "" ? null : value,
                ])
              );
            
            const response = await updateCategory(Number(formData.id),cleanedData);
            const message = response?.data?.message || "Category updated successfully.";
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
                    "Failed to update category. Please try again.",
                type: "error",
                autoClose: 4000,
            });
        } finally {
            setLoading(false);
        }
    }
    const handleCancel=()=>{
        setFormData({
            id: "",
            name: "",
            type: ""
        })
        onClose();
    }
    return (
        <CommonModal
            isOpen={isOpen}
            onClose={handleCancel}
            onSave={handleUpdate}
            title="Update Category"
            saveLabel={loading ? "Updating..." : "Update"}
            cancelLabel="Cancel">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name"
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
    );
}
export default UpdateCategoryFormModal;