import { useState } from "react";
import type { StaffFormModalProps } from "../../type";
import CommonModal from "../ui/CommonModal";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useAlert } from "../alert-context";
import { create } from "../../service/api/Staff";
const StaffFormModal = ({
    isOpen,
    onClose,
    onSuccess,
}: StaffFormModalProps) => {
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
    const handleSave=async()=>{
        setLoading(true);
        try{
            const cleanedData = Object.fromEntries(
                Object.entries({
                    email:formData.email,
                    fullName:formData.fullName,
                    gender:formData.gender,
                    phone:formData.phone,
                    idRole:formData.role,
                    birthday:formData.birthday
                    ? formData.birthday.toISOString().split("T")[0] 
                    : null,
                    isActive:true
                }).map(([key, value]) => [
                    key,
                    value?.toString().trim() === "" ? null : value,
                  ])
            )
            const response=await create(cleanedData);
            const message =
                response?.data?.message ||
                "staff created successfully!";

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
        }catch(err:any){
            console.error("Create error:", err);
            showAlert({
                title:
                    err?.response?.data?.message ||
                    "Failed to create staff. Please try again.",
                type: "error",
                autoClose: 4000,
            });
        }finally{
            setLoading(false)
        }
    }
    const handleCancel=()=>{
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
            title="Create Staff"
            onSave={handleSave}
            saveLabel={loading ? "Saving..." : "Save"}
            cancelLabel="Cancel"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        onChange={handleChange}
                        value={formData.fullName}
                        placeholder="Enter Full Name"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    >
                        <option defaultValue="0">Nam</option>
                        <option value="1">Nữ</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter Phone"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of birth <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                        selected={formData.birthday}
                        onChange={(date: Date | null) =>
                            setFormData((prev) => ({ ...prev, birthday: date }))
                        }
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()} // không cho chọn ngày tương lai
                        placeholderText="Select date of birth"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                    >
                        <option value="3">Receptionist</option>
                        <option value="4">Marketing</option>
                    </select>
                </div>
            </div>
     
        </CommonModal>
    )
}
export default StaffFormModal;