import { useEffect, useState } from "react"
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { createAsset } from "../../service/api/Asset";
import { getAllCategory } from "../../service/api/Category";
import { getAllRoom } from "../../service/api/Room";
import { getTokens } from "../../util/auth";
import { useTranslation } from "react-i18next";
import type { AssetFormModalProps } from "../../type/asset.types";

const AssetFormModal = ({
    isOpen,
    onClose,
    onSuccess,
}: AssetFormModalProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const [saving, setSaving] = useState(false);
    const [previewIcon, setPreviewIcon] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [room, setRooms] = useState<any[]>([]);
    const fetchCategories = async () => {
        try {
            setLoading(true)
            const res = await getAllCategory(
                {
                    all: true,
                    filter: "isActive==1 and type==3"
                });
            setCategories(res.content || []);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setPreviewIcon(URL.createObjectURL(file));
        }
    };
    const fetchRooms = async () => {
        try {
            setLoading(true)
            let filters: string[] = [];
            filters.push(`hotel.id==${getTokens()?.hotelId}`)
            const filterQuery = filters.join(" and ");

            const res = await getAllRoom(
                {
                    all: true,
                    filter: filterQuery
                });
            setRooms(res.data.content || []);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCategories()
        fetchRooms()
    }, [isOpen])
    const [formData, setFormData] = useState({
        assetName: "",
        categoryId: "",
        price: "",
        quantity: "",
        note: "",
        roomId: "",
        image: null as File | null,
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
                    image: formData.image,
                }).map(([key, value]) => [
                    key,
                    value?.toString().trim() === "" ? null : value,
                ])
            );
            const response = await createAsset(cleanedData);
            showAlert({
                title: response?.data?.message || t("asset.createOrUpdate.createSucess"),
                type: "success",
                autoClose: 3000,
            });
            setFormData({
                assetName: "",
                categoryId: "",
                price: "",
                quantity: "",
                note: "",
                roomId: "",
                image: null
            });

            onSuccess();
        } catch (err: any) {
            console.error("Create error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    t("asset.createOrUpdate.createError"),
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
            roomId: "",
            image: null
        })
        onClose();
    }
    if (isOpen && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title={t("asset.createOrUpdate.titleCreate")}
                saveLabel={t("common.save")}
                cancelLabel={t("common.cancelButton")}
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
            onSave={handleSave}
           title={t("asset.createOrUpdate.titleCreate")}
            saveLabel={saving ? t("common.saving") : t("common.save")}
            cancelLabel={t("common.cancelButton")}
            width="w-[95vw] sm:w-[90vw] lg:w-[700px]"


        >
            <div className="mb-4">
                <label className="block mb-1 font-medium text-[#253150]">{t("asset.createOrUpdate.icon")}</label>
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-[#EEF0F7] border border-[#4B62A0] rounded-xl overflow-hidden cursor-pointer">

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />

                    {previewIcon ? (
                        <img
                            src={previewIcon}
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
                        {t("asset.name")} *
                    </label>
                    <input
                        type="text"
                        name="assetName"
                        placeholder={t("asset.createOrUpdate.namePlaceHolder")}
                        value={formData.assetName}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        {t("asset.createOrUpdate.room")} *
                    </label>
                    <select
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    >
                        <option value="">{t("asset.createOrUpdate.selectRoom")}</option>
                        {room.length > 0 ? (
                            room.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.roomNumber}
                                </option>
                            ))
                        ) : (
                            <option disabled>{t("common.loading")}</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        {t("asset.category")} *
                    </label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    >
                        <option value="">{t("asset.createOrUpdate.selectCategory")}</option>
                        {categories.length > 0 ? (
                            categories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>{t("common.loading")}</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        {t("asset.createOrUpdate.price")} *
                    </label>
                    <input
                        type="number"
                        name="price"
                        placeholder={t("asset.createOrUpdate.pricePlaceHolder")}
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                        {t("asset.createOrUpdate.quantity")}
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        placeholder={t("asset.createOrUpdate.quantityPlaceHolder")}
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    />

                </div>

                <div className="sm:col-span-2">
                    <label className="block mb-1 font-medium text-[#253150]">
                        {t("asset.createOrUpdate.note")}
                    </label>
                    <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder={t("asset.createOrUpdate.notePlaceholder")}
                        className="w-full border border-[#253150] focus:border-[#3E5286] bg-[#EEF0F7] rounded-lg p-2 outline-none"
                        rows={2}
                    />
                </div>
            </div>
        </CommonModal>
    )
}
export default AssetFormModal