import { useTranslation } from "react-i18next";
import SectionHeader from "./SectionHeader";
import { ClipboardList, Mail, User, Watch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { getGuestTypeOptions } from "@/type/booking.types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const StepGuestInfo = ({ data, onNext, onCancel }: any) => {
  const { t } = useTranslation();
  const schema = z.object({
    firstName: z.string().min(1, t("bookingGuest.validation.firstName")),
    lastName: z.string().min(1, t("bookingGuest.validation.lastName")),
    idNumber: z.string().min(1, t("bookingGuest.validation.idNumber")),
    guestType: z.string().min(1, t("bookingGuest.validation.guestType")),
    email: z
      .string()
      .min(1, t("bookingGuest.validation.emailRequired"))
      .email(t("bookingGuest.validation.emailInvalid")),
    phone: z.string().min(1, t("bookingGuest.validation.phone")),
    companyName: z.string().optional(),
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
      companyName: "",
      note: "",
      ...data,
    },
  });
  const onSubmit = (form: FormValues) => {
    onNext(form);
  };
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
          <Input placeholder="e.g. Jonathan" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.lastName")}
          </label>
          <Input placeholder="e.g. Doe" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.idNumber")}
          </label>
          <Input placeholder="Enter ID number" {...register("idNumber")} />
          {errors.idNumber && (
            <p className="text-red-500 text-sm">{errors.idNumber.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.guestType")}
          </label>
          <Controller
            control={control}
            name="guestType"
            render={({ field }) => (
              <SelectField
                items={getGuestTypeOptions(t)}
                value={field.value}
                onChange={field.onChange}
                isRequired
                placeholder={t("booking.createOrUpdate.selectType")}
                getValue={(i) => i.value}
                getLabel={(i) => i.label}
              />
            )}
          />
          {errors.guestType && (
            <p className="text-red-500 text-sm">{errors.guestType.message}</p>
          )}
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
            {...register("email")}
          />
            {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingGuest.phone")}
          </label>
          <Input
            placeholder="+1 (555) 000-0000"
            {...register("phone")}
          />
           {errors.phone && (
            <p className="text-red-500 text-sm">
              {errors.phone.message}
            </p>
          )}
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
        {...register("note")}
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
          onClick={() => handleSubmit(onSubmit)}
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
