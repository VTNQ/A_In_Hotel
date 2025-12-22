import { useState } from "react"
import SectionHeader from "./SectionHeader";
import { ClipboardList, Mail, User } from "lucide-react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { GUEST_TYPE_OPTIONS } from "../../../type/booking.types";
import TextArea from "../../ui/TextArea";

const StepGuestInfo = ({ data, onNext }: any) => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        idNumber: "",
        guestType: "",
        email: "",
        phone: "",
        companyName: "",
        note: "",
        ...data
    });

    const update = (key: string, value: string) => {
        setForm((prev: any) => ({ ...prev, [key]: value }));
    }
    const isValid =
        form.firstName.trim() !== "" &&
        form.lastName.trim() !== "" &&
        form.idNumber.trim() !== "" &&
        form.guestType !== "" &&
        form.email.trim() !== "" &&
        form.phone.trim() !== "";
    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold mb-4">
                Guest Information
            </h2>
            <p className="text-sm text-gray-500 mb-6">
                Step 1 of 4: Please enter the primary guest’s details to initialize the booking.
            </p>

            <SectionHeader
                title="Indentity"
                icon={<User className="w-5 h-5 text-[#4B62A0]" />}
            />
            <div className="grid grid-cols-2 gap-4 mb-5">
                <Input
                    label="First Name"
                    placeholder="e.g. Jonathan"
                     error={!form.firstName ? "First name is required" : ""}
                    value={form.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update("firstName", e.target.value)}
                />
                <Input
                    label="Last Name"
                    placeholder="e.g. Doe"
                    value={form.lastName}
                      error={!form.lastName ? "Last name is required" : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update("lastName", e.target.value)}
                />

                <Input
                    label="ID / Passport Number"
                    placeholder="Enter ID number"
                     error={!form.idNumber ? "ID number is required" : ""}
                    value={form.idNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update("idNumber", e.target.value)}
                />
                <Select
                    label="Guest Type"
                    value={form.guestType}
                    placeholder="Select type"
                    options={GUEST_TYPE_OPTIONS}
                    onChange={(value) => update("guestType", value)}
                />
            </div>
            <SectionHeader
                title="Contact Details"
                icon={<Mail className="w-5 h-5 text-[#4B62A0]" />}
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                    label="Email Address"
                    placeholder="name@example.com"
                    value={form.email}
                     error={!form.email ? "Email is required" : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update("email", e.target.value)}
                />
                <Input
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    error={!form.idNumber ? "Phone is required" : ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        update("phone", e.target.value)}
                />
            </div>

            <SectionHeader
                title="Booking Specifics"
                icon={<ClipboardList className="w-5 h-5 text-[#4B62A0]" />}
            />

            <TextArea
                label="Notes & Special Requests"
                placeholder="Enter any allergies, room preferences, or special requests here..."
                value={form.note}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("note", e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">

                <button
                    disabled={!isValid}
                    onClick={() => onNext(form)}
                    className={`px-5 py-2 rounded-lg transition ${isValid
                            ? "bg-[#42578E] text-white hover:bg-[#536DB2]"
                            : "bg-gray-300 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    Next: Booking Date & Time →
                </button>

            </div>
        </div>
    )
}
export default StepGuestInfo;