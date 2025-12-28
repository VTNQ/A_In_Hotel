import { useEffect, useState } from "react";
import type { UpdateAssetFormModalProps } from "../../type";
import { useAlert } from "../alert-context";
import CommonModal from "../ui/CommonModal";
import { findById, updateAsset } from "../../service/api/Asset";
import { getAllCategory } from "../../service/api/Category";
import { getAllRoom } from "../../service/api/Room";
import { getTokens } from "../../util/auth";
import { File_URL } from "../../setting/constant/app";

const UpdateAssetFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    assetId
}: UpdateAssetFormModalProps) => {
    const [formData, setFormData] = useState({
        id: "",
        assetName: "",
        categoryId: "",
        price: "",
        quantity: "",
        note: "",
        roomId: "",
        image: null as File | null,

    });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [room,setRooms]= useState<any[]>([]);
    const { showAlert } = useAlert();
    useEffect(() => {
        if (!isOpen || !assetId) return;
        setLoading(true);
        fetchCategories();
        fetchRooms();
        findById(assetId)
            .then((res) => {
                const data = res?.data?.data;
                setFormData({
                    id: data.id || "",
                    assetName: data.assetName || "",
                    categoryId: data.categoryId || "",
                    price: data.price || 0,
                    quantity: data.quantity || 0,
                    note: data.note || "",
                    roomId: data.roomId || "",
                    image: null
                })
                setPreview(File_URL + data.thumbnail?.url || null)
            })
            .catch(() => {
                showAlert({
                    title: "Failed to load asset information!",
                    type: "error",
                });
                onClose();
            })
            .finally(() => setLoading(false));


    }, [isOpen, assetId]);
    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };
    const fetchCategories = async () => {
        try {
            const res = await getAllCategory({ all: true, filter: "isActive==1 and type==3" });
            setCategories(res.content || []);
        } catch (err) {
            console.log(err)
        }
    }
    const fetchRooms=async()=>{
        try {
            setLoading(true)
            let filters: string[] = [];
            filters.push(`hotel.id==${getTokens()?.hotelId}`)
            filters.push(`status==3`)
            const filterQuery = filters.join(" and ");
            
            const res = await getAllRoom(
            { 
                 all:true,
                filter: filterQuery
            });
            setRooms(res.data.content || []);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleUpdate = async () => {
        setSaving(true);
        try {
            const payload = {
                assetName: formData.assetName,
                categoryId: formData.categoryId,
                roomId: formData.roomId,
                price: formData.price,
                quantity: formData.quantity,
                note: formData.note,
                image:formData.image
            }
            const response = await updateAsset(Number(formData.id), payload);
            const message = response?.data?.message || "Asset updated successfully.";
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
                    "Failed to update asset. Please try again.",
                type: "error",
                autoClose: 4000,
            })
        } finally {
            setSaving(false)
        }
    }
    const handleCancel = () => {
        setFormData({
            id: "",
            assetName: "",
            categoryId: "",
            price: "",
            quantity: "",
            note: "",
            roomId: "",
            image:null

        })
        onClose();
    }
    if (isOpen && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title="Edit Amenities & Asset Tracking"
                saveLabel="Save"
                cancelLabel="Cancel"
                 width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
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
            title="Edit Amenities & Asset Tracking"
            saveLabel={saving ? "Saving..." : "Save"}
            cancelLabel="Cancel"
             width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
        >
                  <div className="mb-4">
                <label className="block mb-1 font-medium text-[#253150]">Asset Icon</label>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#EEF0F7] border border-[#4B62A0] rounded-xl overflow-hidden cursor-pointer">

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />

                    {preview ? (
                        <img
                            src={preview}
                            className="w-full h-full object-cover absolute inset-0"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src="https://backoffice-uat.affina.com.vn/assets/images/ffc6ce5b09395834f6c02a056de78121.png"
                                className="w-full h-full object-cover absolute inset-0"
                            />
                        </div>
                    )}

                    <div className="absolute bottom-2 right-2 bg-[#4B62A0] p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 5a3 3 0 110 6 3 3 0 010-6z" />
                            <path d="M12 13c-4 0-7 2-7 5v2h14v-2c0-3-3-5-7-5z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
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
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
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
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
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
                        type="number"
                        name="price"
                        placeholder="Enter room price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        Quantity
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Enter quantity (e.g. 1)"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
                        required
                    />

                </div>

                <div className="sm:col-span-2">
                    <label className="block mb-1 font-medium text-[#253150]">
                        Notes
                    </label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Add any notes (e.g. near window, pool view)"
                        className="w-full border border-[#253150] focus:border-[#3E5286] bg-[#EEF0F7] rounded-lg p-2 outline-none"
                        rows={2}
                    />
                </div>
            </div>
        </CommonModal>
    )
}
export default UpdateAssetFormModal;