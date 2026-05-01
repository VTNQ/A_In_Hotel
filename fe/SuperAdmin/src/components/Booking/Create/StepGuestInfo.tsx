import { useState } from "react";
import { useTranslation } from "react-i18next";
import SectionHeader from "./SectionHeader";
import { ClipboardList, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { getGuestTypeOptions, GuestType } from "@/type/booking.types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const StepGuestInfo = ({ data, onNext, onCancel }: any) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    guestType: "",
    email: "",
    phone: "",
    companyName: "",
    note: "",
    ...data,
  });
  const update = (key: string, value: string) => {
    setForm((p: any) => ({ ...p, [key]: value }));
  };
  const isValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.idNumber.trim() &&
    form.guestType &&
    form.email.trim() &&
    form.phone.trim();
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          {t("bookingGuest.title")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{t("bookingGuest.step")}</p>
      </div>
      <SectionHeader
        title={t("bookingGuest.identity")}
        icon={<User className="w-5 h-5 text-indigo-500" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
        <div>
          <label className="text-sm font-medium ">
            {t("bookingGuest.firstName")}
          </label>
          <Input
            placeholder="e.g. Jonathan"
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.lastName")}
          </label>
          <Input
            placeholder="e.g. Doe"
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.idNumber")}
          </label>
          <Input
            placeholder="Enter ID number"
            value={form.idNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              update("idNumber", e.target.value)
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.guestType")}
          </label>
          <SelectField
            items={getGuestTypeOptions(t)}
            value={form.guestType}
            onChange={(v) => update("guestType", v as GuestType)}
            isRequired={true}
            placeholder={t("booking.createOrUpdate.selectType")}
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
          />
        </div>
      </div>
      <SectionHeader
        title={t("bookingGuest.contact")}
        icon={<Mail className="w-5 h-5 text-indigo-500" />}
      />
      <div className="grid  grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.email")}
          </label>
          <Input
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.phone")}
          </label>
          <Input
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
      </div>
      <SectionHeader
        title={t("bookingGuest.specifics")}
        icon={<ClipboardList className="w-5 h-5 text-indigo-500" />}
      />

      <div>
        <label className="text-sm font-medium">{t("bookingGuest.note")}</label>
        <Textarea
          placeholder={t("bookingGuest.notePlaceholder")}
          value={form.note}
          onChange={(e) => update("note", e.target.value)}
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-5">
        <Button
          onClick={onCancel}
          className="
            px-4 py-2 rounded-lg text-sm font-medium
            text-gray-600 border border-gray-300 bg-white
            hover:bg-gray-50 transition
          "
        >
          {t("bookingGuest.cancel")}
        </Button>

        <Button
          disabled={!isValid}
          onClick={() => onNext(form)}
          className={`
    px-5 py-2 rounded-lg text-sm font-medium transition
    ${
      isValid
        ? "bg-indigo-500 text-white hover:bg-indigo-600"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }
  `}
        >
          {t("bookingGuest.next")}
        </Button>
      </div>
    </div>
  );
};
export default StepGuestInfo;
