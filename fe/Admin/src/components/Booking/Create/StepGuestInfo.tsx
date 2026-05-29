import SectionHeader from "./SectionHeader";
import { ClipboardList, Mail, User } from "lucide-react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { GUEST_TYPE_OPTIONS } from "../../../type/booking.types";
import TextArea from "../../ui/TextArea";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const StepGuestInfo = ({ data, onNext, onCancel }: any) => {
  const { t } = useTranslation();

  const schema = z.object({
    firstName: z.string().min(1, t("validation.firstNameRequired")).max(100),
    lastName: z.string().min(1, t("validation.lastNameRequired")).max(100),
    idNumber: z.string().min(6, t("validation.idNumberMin")).max(20).max(20),
    guestType: z.string().min(1, t("validation.guestTypeRequired")),
    email: z.string().min(1, t("validation.emailRequired")).email(t("validation.emailInvalid")),
    phone: z.string().regex(/^[0-9+\-\s()]{8,15}$/, t("validation.phoneInvalid")),
    note: z.string().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      guestType: "",
      email: "",
      phone: "",
      note: "",
      ...data,
    },
  });

  const submit = (values: FormValues) => onNext(values);

  return (
    <div className="dark:text-gray-100">

      {/* TITLE */}
      <h2 className="text-lg sm:text-xl font-semibold mb-2 dark:text-gray-100">
        {t("bookingGuest.title")}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {t("bookingGuest.step")}
      </p>

      {/* Identity */}
      <SectionHeader
        title={t("bookingGuest.identity")}
        icon={<User className="w-5 h-5 text-[#4B62A0] dark:text-blue-400" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

        <Input
          label={t("bookingGuest.firstName")}
          placeholder="e.g. Jonathan"
          error={errors.firstName?.message?.toString()}
          {...register("firstName")}
        />

        <Input
          label={t("bookingGuest.lastName")}
          placeholder="e.g. Doe"
          error={errors.lastName?.message?.toString()}
          {...register("lastName")}
        />

        <Input
          label={t("bookingGuest.idNumber")}
          placeholder="Enter ID number"
          error={errors.idNumber?.message?.toString()}
          {...register("idNumber")}
        />

        <Controller
          control={control}
          name="guestType"
          render={({ field }) => (
            <Select
              label={t("bookingGuest.guestType")}
              placeholder="Select type"
              options={GUEST_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {errors.guestType?.message && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">
            {errors.guestType.message.toString()}
          </p>
        )}
      </div>

      {/* Contact */}
      <SectionHeader
        title={t("bookingGuest.contact")}
        icon={<Mail className="w-5 h-5 text-[#4B62A0] dark:text-blue-400" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

        <Input
          type="email"
          label={t("bookingGuest.email")}
          placeholder="name@example.com"
          {...register("email")}
          error={errors.email?.message?.toString()}
        />

        <Input
          type="tel"
          label={t("bookingGuest.phone")}
          placeholder="+1 (555) 000-0000"
          {...register("phone")}
          error={errors.phone?.message?.toString()}
        />
      </div>

      {/* Specifics */}
      <SectionHeader
        title={t("bookingGuest.specifics")}
        icon={<ClipboardList className="w-5 h-5 text-[#4B62A0] dark:text-blue-400" />}
      />

      <TextArea
        label={t("bookingGuest.note")}
        placeholder={t("bookingGuest.notePlaceholder")}
        {...register("note")}
      />

      {errors.note?.message && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {errors.note.message.toString()}
        </p>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8">

        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium
          text-red-600 border border-red-200 bg-red-50
          hover:bg-red-100 hover:border-red-300 transition
          dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/20"
        >
          {t("bookingGuest.cancel")}
        </button>

        <button
          disabled={!isValid}
          onClick={handleSubmit(submit)}
          className={`w-full sm:w-auto 
            flex items-center justify-center
            gap-2 px-6 py-3 text-sm sm:text-base font-medium rounded-xl 
            transition-all duration-200
            ${
              isValid
                ? "bg-[#42578E] text-white hover:bg-[#536DB2] active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-700"
                : "bg-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
            }`}
        >
          {t("bookingGuest.next")}
        </button>

      </div>
    </div>
  );
};

export default StepGuestInfo;