import { useEffect, useState } from "react";
import { useAlert } from "../alert-context";
import type { UpdateCategoryFormModalProps } from "../../type";
import CommonModal from "../ui/CommonModal";
import { findById, updateCategory } from "../../service/api/Category";

const UpdateCategoryFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    categoryId,
}: UpdateCategoryFormModalProps) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        type: "",
        description: ""
    });

    const { showAlert } = useAlert();

    // 🟦 Load data by ID khi mở modal
    useEffect(() => {
        if (!isOpen || !categoryId) return;

        setLoading(true);

        findById(categoryId)
            .then((res) => {
                const data = res?.data?.data;
                setFormData({
                    id: data?.id || "",
                    name: data?.name || "",
                    type: data?.idType || "",
                    description: data?.description || ""
                });
            })
            .catch(() => {
                showAlert({
                    title: "Failed to load category information!",
                    type: "error",
                });
                onClose();
            })
            .finally(() => setLoading(false));
    }, [isOpen, categoryId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
    const handleUpdate = async () => {
        setSaving(true);
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

            const response = await updateCategory(Number(formData.id), cleanedData);
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
            setSaving(false);
        }
    }

    const handleCancel = () => {
        setFormData({ id: "", name: "", type: "", description: "" });
        onClose();
    };
    if (isOpen && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title="Edit Category"
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
            title="Edit Category"
            saveLabel={saving ? "Saving..." : "Save"}
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
    );
};

export default UpdateCategoryFormModal;
