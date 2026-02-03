import { useState } from "react";
import CommonModal from "../ui/CommonModal";
import { useAlert } from "../alert-context";
import { create } from "../../service/api/Staff";
import CustomDatePicker from "../ui/CustomDatePicker";
import { useTranslation } from "react-i18next";
import type { StaffFormModalProps } from "../../type/staff.types";
const StaffFormModal = ({
    isOpen,
    onClose,
    onSuccess,
}: StaffFormModalProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        gender: "0",
        phone: "",
        role: "3",
        birthday: null as Date | null,
    })
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSave = async () => {
        setLoading(true);
        try {
            const cleanedData = Object.fromEntries(
                Object.entries({
                    email: formData.email,
                    fullName: formData.fullName,
                    gender: formData.gender,
                    phone: formData.phone,
                    idRole: formData.role,
                    birthday: formData.birthday
                        ? formData.birthday.toISOString().split("T")[0]
                        : null,
                    isActive: true
                }).map(([key, value]) => [
                    key,
                    value?.toString().trim() === "" ? null : value,
                ])
            )
            const response = await create(cleanedData);
            const message =
                response?.data?.message ||
                t("staff.createSucess");

            showAlert({
                title: message,
                type: "success",
                autoClose: 3000,
            });
            setFormData({
                email: "",
                fullName: "",
                gender: "0",
                phone: "",
                role: "3",
                birthday: null as Date | null,

            })
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Create error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    t("staff.createError"),
                type: "error",
                autoClose: 4000,
            });
        } finally {
            setLoading(false)
        }
    }
    const handleCancel = () => {
        setFormData({
            email: "",
            fullName: "",
            gender: "0",
            phone: "",
            role: "3",
            birthday: null as Date | null,

        })
        onClose();
    }
    return (
        <CommonModal
            isOpen={isOpen}
            onClose={handleCancel}

            title={t("staff.create.titleCreate")}
            onSave={handleSave}
            saveLabel={loading ? t("common.saving") : t("common.save")}
             cancelLabel={t("common.cancelButton")}
            width="w-[95vw] sm:w-[90vw] lg:w-[700px]"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("staff.fullName")} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        onChange={handleChange}
                        value={formData.fullName}
                        placeholder={t("staff.create.enterFullName")}
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                        className="w-full border border-[#4B62A0] rounded-lg px-3 py-2.5 sm:py-2 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1">
                        {t("staff.gender")} <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-2">

                        {/* MALE */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="0"
                                checked={formData.gender === "0"}
                                onChange={handleChange}
                                className="hidden peer"
                            />

                            {/* Custom radio */}
                            <span
                                className="
          h-4 w-4 rounded-full border
          border-gray-400 
          peer-checked:border-[#42578E]
          peer-checked:bg-[#42578E]
          transition
        "
                            ></span>

                            <span
                                className="
          text-gray-700 
          peer-checked:text-[#42578E]
        "
                            >
                                {t("staff.create.male")}
                            </span>
                        </label>

                        {/* FEMALE */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="1"
                                checked={formData.gender === "1"}
                                onChange={handleChange}
                                className="hidden peer"
                            />

                            {/* Custom radio */}
                            <span
                                className="
          h-4 w-4 rounded-full border
          border-gray-400 
          peer-checked:border-[#42578E]
          peer-checked:bg-[rgb(66,87,142)]
          transition
        "
                            ></span>

                            <span
                                className="
          text-gray-700 
          peer-checked:text-[#42578E]
        "
                            >
                                {t("staff.create.female")}
                            </span>
                        </label>
                    </div>

                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("staff.phone")}
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t("staff.create.enterphone")}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("staff.dob")} <span className="text-red-500">*</span>
                    </label>
                    <CustomDatePicker
                        value={formData.birthday}
                        onChange={(date) => setFormData((prev) => ({ ...prev, birthday: date }))}
                        placeholder={t("staff.create.selectDate")}
                    />


                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("staff.role")} <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    >
                        <option value="3">{t("staff.create.receiption")}</option>
                        <option value="4">Marketing</option>
                    </select>
                </div>
            </div>

        </CommonModal>
    )
}
export default StaffFormModal;