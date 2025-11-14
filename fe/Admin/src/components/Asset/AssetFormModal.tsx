import {  useEffect, useState } from "react"
import type { AssetFormModalProps } from "../../type"
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { createAsset } from "../../service/api/Asset";
import { getAllCategory } from "../../service/api/Category";

const AssetFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    room
}: AssetFormModalProps) => {
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const fetchCategories = async () => {
        try {
            setLoading(true)
            const res = await getAllCategory({ page: 1, size: 10, searchField: "type", searchValue: "3", filter: "isActive==1" });
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
        setSaving(true)
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
            setSaving(false)
        }
    }
    const handleCancel = () => {
        setFormData({
            assetName: "",
            categoryId: "",
            price: "",
            quantity: "",
            note: "",
            roomId: ""
        })
        onClose();
    }
    if (isOpen && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title="Create New Asset"
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
            onSave={handleSave}
            title="Create New Asset"
            saveLabel={saving ? "Saving..." : "Save"}
            cancelLabel="Cancel"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium text-[#253150]" >
                        Asset Name *
                    </label>
                    <input
                        type="text"
                        name="assetName"
                        placeholder="Enter asset name"
                        value={formData.assetName}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Room Number *
                    </label>
                    <select
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    >
                        <option value="">Enter number room</option>
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
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Price (VND) *
                    </label>
                    <input
                        type="text"
                        name="price"
                        placeholder="Enter room price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Quantity
                    </label>
                    <input
                        type="text"
                        name="quantity"
                        placeholder="Enter quantity (e.g. 1)"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>

                <div >
                    <label className="block mb-1 font-medium text-[#253150]">
                        Notes
                    </label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Add any notes (e.g. near window, pool view)"
                        className="w-full border border-[#253150] focus:border-[#3E5286] bg-[#EEF0F7] rounded-lg p-2 outline-none"
                        rows={1}
                    />
                </div>
            </div>
        </CommonModal>
    )
}
export default AssetFormModal