import { useEffect, useState } from "react";
import { type UpdateBookingModalProps } from "../../type/booking.types";
import { editInformationGuest, GetBookingById } from "../../service/api/Booking";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { useTranslation } from "react-i18next";

const EditBookingModal = ({
    open,
    onClose,
    id,
    onSuccess
}: UpdateBookingModalProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        guestName: "",
        surname: "",
        email: "",
        phoneNumber: "",
        guestType: ""
    });
    const { showAlert } = useAlert();
    const [saving, setSaving] = useState(false);
    const handleCancel = () => {
        setFormData({
            id: "",
            guestName: "",
            surname: "",
            email: "",
            phoneNumber: "",
            guestType: ""
        });
        onClose();
    }
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
        if (!open || !id) return;
        setLoading(true);
        GetBookingById(id)
            .then((res) => {
                const data = res?.data?.data;
                setFormData({
                    id: data.id,
                    guestName: data.guestName,
                    surname: data.surname,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    guestType: data.guestType
                })
            }).catch(() => {
                onClose();
            }).finally(() => setLoading(false));
    }, [open, id]);
    const handleEditBooking = async () => {
        setSaving(true);
        try {
            const cleanedData = Object.fromEntries(
                Object.entries({
                    guestName: formData.guestName,
                    surname: formData.surname,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    guestType: formData.guestType,
                }).map(([key, value]) => [
                    key,
                    value?.toString().trim() === "" ? null : value,
                ])
            );
            const response = await editInformationGuest(id, cleanedData);
            showAlert({
                title: response?.data?.message ||   t("bookingEdit.updateSuccess"),
                type: "success",
                autoClose: 3000,
            });
            setFormData({
                id: "",
                guestName: "",
                surname: "",
                email: "",
                phoneNumber: "",
                guestType: ""
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Update error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                     t("bookingEdit.updateError"),
                type: "error",
                autoClose: 4000,
            });
        } finally {
            setSaving(false)
        }
    }
    if (open && loading) {
        return (
            <CommonModal
                isOpen={true}
                onClose={handleCancel}
                title={t("bookingEdit.title")}
                saveLabel={t("common.save")}
                cancelLabel={t("common.cancelButton")}
                width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
            >
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
                </div>
            </CommonModal>
        )
    }
    return (
        <CommonModal
            isOpen={open}
            onClose={handleCancel}
            title={t("bookingEdit.title")}
            saveLabel={saving ? t("common.saving") : t("common.save")}
            cancelLabel={t("common.cancelButton")}
            onSave={handleEditBooking}
            width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">{t("bookingEdit.guestName")} </label>
                    <input type="text"
                        name="guestName"
                        placeholder={t("bookingEdit.guestName")}
                        value={formData.guestName}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">{t("bookingEdit.surname")}</label>
                    <input type="text"
                        name="surname"
                        placeholder={t("bookingEdit.surname")}
                        value={formData.surname}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none" />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">{t("bookingEdit.email")}</label>
                    <input type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none" />

                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">{t("bookingEdit.phoneNumber")}</label>
                    <input type="text"
                        name="phoneNumber"
                        placeholder={t("bookingEdit.phoneNumber")}
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none" />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-[#253150]">{t("bookingEdit.guestType")}</label>
                    <select
                        name="guestType"
                        value={formData.guestType}
                        onChange={handleChange}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
                        required
                    >

                        <option value="1">{t("bookingEdit.guestTypeOptions.individual")}</option>
                        <option value="2">{t("bookingEdit.guestTypeOptions.company")}</option>
                        <option value="3">{t("bookingEdit.guestTypeOptions.vip")}</option>
                    </select>
                </div>
            </div>
        </CommonModal>
    )
}
export default EditBookingModal;