import { Calendar } from "lucide-react";
import {
  CUSTOMER_TYPE_OPTIONS,
  USAGE_TYPE_OPTIONS,
  type CreateVoucherModalProps,
  type voucherFormProps,
} from "../../type/voucher.types";
import CommonModal from "../ui/CommonModal";
import { useEffect, useState } from "react";
import Toggle from "../ui/Toggle";
import { getAllCategory } from "../../service/api/Category";
import { useTranslation } from "react-i18next";
import { createVoucher } from "../../service/api/Voucher";
import { useAlert } from "../alert-context";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateVoucher = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateVoucherModalProps) => {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const voucherSchema = z
    .object({
      voucherCode: z
        .string()
        .min(1, t("voucher.validation.codeRequired"))
        .min(3, t("voucher.validation.codeMinLength"))
        .max(20, t("voucher.validation.codeMaxLength")),

      voucherName: z
        .string()
        .min(1, t("voucher.validation.nameRequired"))
        .min(3, t("voucher.validation.nameMinLength"))
        .max(100, t("voucher.validation.nameMaxLength")),

      type: z.string().min(1, t("voucher.validation.typeRequired")),

      description: z.string().optional(),

      value: z.string().min(1, t("voucher.validation.valueRequired")),

      maxDiscountValue: z.string().optional(),

      bookingType: z
        .string()
        .min(1, t("voucher.validation.bookingTypeRequired")),

      minimumStay: z
        .string()
        .min(1, t("voucher.validation.minimumStayRequired")),

      customerType: z.number(),

      usageType: z.number(),

      usageLimit: z.string().min(1, t("voucher.validation.usageLimitRequired")),

      usagePerCustomer: z.string().optional(),

      startDate: z.string().min(1, t("voucher.validation.startDateRequired")),

      endDate: z.string().min(1, t("voucher.validation.endDateRequired")),

      stackWithPromotion: z.boolean(),

      stackWithOtherVoucher: z.boolean(),

      priority: z.string().optional(),

      roomTypes: z.array(
        z.object({
          roomTypeId: z.number(),
          excluded: z.boolean(),
        }),
      ),
    })
    .superRefine((data, ctx) => {
      const value = Number(data.value);

      // value
      if (data.type === "2") {
        // percent
        if (value <= 0 || value > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: t("voucher.validation.valuePercentRange"),
          });
        }

        if (!data.maxDiscountValue) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxDiscountValue"],
            message: t("voucher.validation.maxDiscountRequired"),
          });
        } else if (Number(data.maxDiscountValue) <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["maxDiscountValue"],
            message: t("voucher.validation.maxDiscountPositive"),
          });
        }
      } else {
        // fixed amount
        if (value <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: t("voucher.validation.valueMoneyPositive"),
          });
        }

        if (value > 1000000000) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["value"],
            message: t("voucher.validation.valueMoneyMax"),
          });
        }
      }

      // endDate > startDate
      if (data.startDate && data.endDate && data.endDate < data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: t("voucher.validation.endDateAfterStart"),
        });
      }

      // minimumStay
      if (Number(data.minimumStay) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["minimumStay"],
          message: t("voucher.validation.minimumStayPositive"),
        });
      }

      if (Number(data.minimumStay) > 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["minimumStay"],
          message: t("voucher.validation.minimumStayMax"),
        });
      }

      // usageLimit
      if (Number(data.usageLimit) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["usageLimit"],
          message: t("voucher.validation.usageLimitPositive"),
        });
      }

      // usagePerCustomer
      if (data.usagePerCustomer && Number(data.usagePerCustomer) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["usagePerCustomer"],
          message: t("voucher.validation.usagePerCustomerPositive"),
        });
      }

      // roomTypes
      const hasRoom = data.roomTypes.some((r) => r.excluded);

      if (!hasRoom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roomTypes"],
          message: t("voucher.validation.roomTypeRequired"),
        });
      }
    });

  type VoucherFormData = z.infer<typeof voucherSchema>;

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    mode: "onChange",
    defaultValues: {
      voucherCode: "",
      voucherName: "",
      type: "1",
      description: "",
      value: "",
      maxDiscountValue: "",
      bookingType: "1",
      minimumStay: "",
      customerType: 0,
      usageType: 1,
      usageLimit: "",
      usagePerCustomer: "",
      startDate: "",
      endDate: "",
      stackWithPromotion: false,
      stackWithOtherVoucher: false,
      priority: "",
      roomTypes: [],
    },
  });
  const [loadingRoom, setLoadingRoom] = useState(false);
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoadingRoom(true);
      try {
        const response = await getAllCategory({
          all: true,
          filter: "isActive==1 and type==1",
        });

        const data = response.data.content || [];
        setRoomTypes(data);
        setValue(
          "roomTypes",
          data.map((room: any) => ({
            roomTypeId: room.id,
            excluded: false,
          })),
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchData();
  }, [isOpen]);

  const toggleRoomType = (roomTypeId: string) => {
    const currentRoomTypes = watch("roomTypes") || [];

    setValue(
      "roomTypes",
      currentRoomTypes.map((r) =>
        r.roomTypeId === Number(roomTypeId) ? { ...r, excluded: !r.excluded } : r,
      ),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    trigger("roomTypes");
  };
  const selectAllRoomTypes = () => {
    const currentRoomTypes = watch("roomTypes") || [];

    setValue(
      "roomTypes",
      currentRoomTypes.map((r) => ({
        ...r,
        excluded: true,
      })),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    trigger("roomTypes");
  };

  const unselectAllRoomTypes = () => {
    const currentRoomTypes = watch("roomTypes") || [];

    setValue(
      "roomTypes",
      currentRoomTypes.map((r) => ({
        ...r,
        excluded: false,
      })),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    trigger("roomTypes");
  };
  const isPercent = watch("type") === "2";
  const onSubmit = async (data: VoucherFormData) => {
    try {
      const payload: voucherFormProps = {
        voucherCode: data.voucherCode,
        voucherName: data.voucherName,
        type: data.type,
        description: data.description || "",
        value: data.value,
        maxDiscountValue: isPercent ? data.maxDiscountValue || "" : "",
        bookingType: data.bookingType,
        minimumStay: data.minimumStay,
        customerType: data.customerType,
        usageType: data.usageType,
        usageLimit: data.usageLimit,
        usagePerCustomer:
          data.usagePerCustomer == null ? "" : data.usagePerCustomer,
        startDate: data.startDate,
        endDate: data.endDate,
        stackWithPromotion: data.stackWithPromotion,
        stackWithOtherVoucher: data.stackWithOtherVoucher,
        priority: data.priority || "",
        roomTypes: data.roomTypes.map((r) => ({
          roomTypeId: String(r.roomTypeId),
          excluded: r.excluded,
        })),
      };
      const response = await createVoucher(payload);
      showAlert({
        title:
          response?.data?.message || t("voucher.createOrUpdate.createSucess"),
        type: "success",
        autoClose: 3000,
      });
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          t("voucher.createOrUpdate.createError"),
        type: "error",
      });
    }
  };

  if (!isOpen) return null;
  const handleCancel = () => {
    reset();
    onClose();
  };
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t("voucher.createOrUpdate.titleCreate")}
      saveLabel={isSubmitting ? t("common.saving") : t("common.save")}
      onSave={handleSubmit(onSubmit)}
      cancelLabel={t("common.cancelButton")}
      diabled={!isValid || isSubmitting}
      width="w-[95vw] sm:w-[90vw] lg:w-[1000px]"
    >
      {loadingRoom ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-[#2E3A8C] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 
        grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12"
        >
          {/* ================= LEFT ================= */}
          <div className="space-y-10">
            {/* General Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("voucher.createOrUpdate.generalInformation")}
              </h2>

              <div>
                <label className="block mb-1 font-medium text-[#253150]">
                  {t("voucher.createOrUpdate.voucherName")}
                </label>
                <input
                  {...register("voucherName")}
                  type="text"
                  placeholder={t(
                    "voucher.createOrUpdate.voucherNamePlaceHolder",
                  )}
                  className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none"
                />
                {errors.voucherName && (
                  <span className="text-red-500">
                    {errors.voucherName.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium text-[#253150]">
                  {t("voucher.createOrUpdate.voucherCode")}
                </label>
                <input
                  type="text"
                  {...register("voucherCode")}
                  placeholder={t(
                    "voucher.createOrUpdate.voucherCodePlaceHolder",
                  )}
                  className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none"
                />
                {errors.voucherCode && (
                  <span className="text-red-500">
                    {errors.voucherCode.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium text-[#253150]">
                  {t("voucher.createOrUpdate.description")}
                </label>
                <textarea
                  {...register("description")}
                  placeholder={t(
                    "voucher.createOrUpdate.descriptionPlaceholder",
                  )}
                  className="w-full border border-[#4B62A0] bg-[#EEF0F7] rounded-lg p-2 outline-none"
                  rows={4}
                />
              </div>
            </section>

            {/* Validity Range */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("voucher.createOrUpdate.validityRange")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-[#253150]">
                    {t("voucher.createOrUpdate.startDate")}
                  </label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150]"
                    />
                    <input
                      type="date"
                      {...register("startDate")}
                      className="h-12 w-full rounded-lg border pl-12 pr-4 border-[#4B62A0] outline-none"
                    />
                    {errors.startDate && (
                      <span className="text-red-500">
                        {errors.startDate.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-[#253150]">
                    {t("voucher.createOrUpdate.endDate")}
                  </label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150]"
                    />
                    <input
                      type="date"
                      {...register("endDate")}
                      className="h-12 w-full rounded-lg border pl-12 pr-4 border-[#4B62A0] outline-none"
                    />
                    {errors.endDate && (
                      <span className="text-red-500">
                        {errors.endDate.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Stack & Priority Rules */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                {t("voucher.createOrUpdate.stackAndPriority")}
              </h2>

              <div className="p-5 rounded-xl border border-[#E3E7F2] bg-gray-50 space-y-5">
                <Toggle
                  label={t("voucher.createOrUpdate.stackWithPromotion")}
                  description={t(
                    "voucher.createOrUpdate.stackWithPromotionDesc",
                  )}
                  checked={watch("stackWithPromotion")}
                  onChange={(value) =>
                    setValue("stackWithPromotion", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                <Toggle
                  label={t("voucher.createOrUpdate.stackWithOtherVoucher")}
                  description={t(
                    "voucher.createOrUpdate.stackWithOtherVoucherDesc",
                  )}
                  checked={watch("stackWithOtherVoucher")}
                  onChange={(value) =>
                    setValue("stackWithOtherVoucher", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />

                <div>
                  <label className="block mb-1 font-medium text-[#253150]">
                    {t("voucher.createOrUpdate.priority")}{" "}
                    <span className="text-gray-400 font-normal">
                      ({t("voucher.createOrUpdate.priorityOptional")})
                    </span>
                  </label>
                  <input
                    type="number"
                    {...register("priority")}
                    placeholder="1"
                    className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>
            </section>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="block mb-1 font-medium text-[#253150]">
                  {t("voucher.createOrUpdate.roomTypes")}
                </span>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={selectAllRoomTypes}
                    className="text-xs text-[#253150] font-semibold hover:underline"
                  >
                    {t("voucher.createOrUpdate.selectAll")}
                  </button>

                  <button
                    type="button"
                    onClick={unselectAllRoomTypes}
                    className="text-xs text-gray-500 hover:underline"
                  >
                    {t("voucher.createOrUpdate.clear")}
                  </button>
                </div>
              </div>
              <div
                className="grid grid-cols-1  sm:grid-cols-2 gap-3 p-3 sm:p-4 rounded-xl border 
              border-[#E3E7F2] bg-white"
              >
                {roomTypes.map((room) => {
                  const roomState = watch("roomTypes").find(
                    (r) => r.roomTypeId === room.id,
                  );

                  const checked = roomState?.excluded === true;

                  return (
                    <label
                      key={room.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
            ${checked ? "bg-[#253150]/5" : "hover:bg-gray-50"}
          `}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          toggleRoomType(room.id);
                        }}
                        className="hidden"
                      />

                      {/* Custom checkbox */}
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
              ${checked ? "bg-[#253150] border-[#253150]" : "border-[#C6CCDD]"}
            `}
                      >
                        {checked && (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>

                      <span className="text-sm font-medium text-[#253150]">
                        {room.name}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.roomTypes && (
                <span className="text-red-500">{errors.roomTypes.message}</span>
              )}
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-10">
            {/* Discount Config */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("voucher.createOrUpdate.discountConfig")}
              </h2>

              <div>
                <label className="block mb-1 font-medium text-[#253150]">
                  {t("voucher.createOrUpdate.discountType")}
                </label>
                <select
                  {...register("type")}
                  className="h-12 w-full rounded-lg border px-4 border-[#4B62A0] bg-white outline-none appearance-none"
                >
                  <option value="1">{t("voucher.createOrUpdate.fixed")}</option>
                  <option value="2">
                    {t("voucher.createOrUpdate.percent")}
                  </option>
                  <option value="3">
                    {t("voucher.createOrUpdate.discountTypeSpecial")}
                  </option>
                </select>
                {errors.type && (
                  <span className="text-red-500">{errors.type.message}</span>
                )}
              </div>

              <div
                className={`grid ${isPercent ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-4`}
              >
                <div>
                  <label className="block mb-1 font-medium text-[#253150]">
                    {t("voucher.createOrUpdate.value")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("value")}
                      placeholder={t("voucher.createOrUpdate.valuePlaceholder")}
                      className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">
                      {isPercent ? "%" : "VND"}
                    </span>
                  </div>
                  {errors.value && (
                    <span className="text-red-500">{errors.value.message}</span>
                  )}
                </div>

                {isPercent && (
                  <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                      {t("voucher.createOrUpdate.maxDiscount")}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register("maxDiscountValue")}
                        placeholder={t(
                          "voucher.createOrUpdate.maxDiscountPlaceholder",
                        )}
                        className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none pr-12"
                      />
                      {errors.maxDiscountValue && (
                        <span className="text-red-500">
                          {errors.maxDiscountValue.message}
                        </span>
                      )}
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] font-medium">
                        VND
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Usage Rules */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("voucher.createOrUpdate.usageRules")}
              </h2>

              {/* Booking Type + Minimum Stay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-[#253150]">
                    {t("voucher.createOrUpdate.bookingType")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150]">
                      <Calendar size={18} />
                    </span>
                    <select
                      {...register("bookingType")}
                      className="h-12 w-full rounded-lg border border-[#4B62A0] bg-white pl-12 pr-4 outline-none appearance-none"
                    >
                      <option value="1">
                        {t("bookingDateTime.packageDayUse")}
                      </option>
                      <option value="2">
                        {t("bookingDateTime.packageOvernight")}
                      </option>
                      <option value="3">
                        {t("bookingDateTime.packageFullDay")}
                      </option>
                    </select>
                    {errors.bookingType && (
                      <span className="text-red-500">
                        {errors.bookingType.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-[#253150]">
                    {t("voucher.createOrUpdate.minimumStay")}
                  </label>
                  <input
                    {...register("minimumStay")}
                    type="number"
                    placeholder="2"
                    className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none"
                  />
                  {errors.minimumStay && (
                    <span className="text-red-500">
                      {errors.minimumStay.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Room Types */}

              {/* Customer Type */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="block mb-1 font-medium text-[#253150]">
                    {t("voucher.createOrUpdate.customerType")}
                  </span>
                </div>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4 
                rounded-xl border border-[#E3E7F2] bg-white"
                >
                  {CUSTOMER_TYPE_OPTIONS.map((type) => {
                    const checked = watch("customerType") === type.value;
                    return (
                      <label
                        key={type.value}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                          checked ? "bg-[#253150]/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setValue("customerType", type.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });

                            trigger("customerType");
                          }}
                          className="hidden"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            checked
                              ? "bg-[#253150] border-[#253150]"
                              : "border-[#C6CCDD]"
                          }`}
                        >
                          {checked && (
                            <div className="w-2.5 h-2.5 bg-white rounded" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-[#253150]">
                          {t(type.labelKey)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Usage Frequency */}
              <div className="space-y-2">
                <span className="block mb-1 font-medium text-[#253150]">
                  {t("voucher.createOrUpdate.usageFrequency")}
                </span>

                <div
                  className="grid grid-cols-1 
                sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 
                rounded-xl border border-[#E3E7F2] bg-white"
                >
                  {USAGE_TYPE_OPTIONS.map((opt) => {
                    const checked = watch("usageType") === opt.value;
                    return (
                      <div
                        key={opt.value}
                        role="radio"
                        aria-checked={checked}
                        onClick={() => {
                          setValue("usageType", opt.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });

                          trigger("usageType");
                        }}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer  ${
                          checked
                            ? " bg-[#253150]/5"
                            : "border-[#D6DBEA] hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            checked ? "border-[#253150]" : "border-[#C6CCDD]"
                          }`}
                        >
                          {checked && (
                            <div className="w-2.5 h-2.5 bg-[#253150] rounded-full" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${checked ? "text-[#253150]" : "text-[#4B5563]"}`}
                        >
                          {t(opt.labelKey)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Usage + Usage per customer */}
              <div className="p-5 rounded-xl border border-[#E3E7F2] bg-gray-50 space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-[#253150]">
                    {t("voucher.createOrUpdate.totalUsageLimit")}
                  </label>
                  <input
                    type="number"
                    {...register("usageLimit")}
                    placeholder="100"
                    className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none"
                  />
                  {errors.usageLimit && (
                    <span className="text-red-500">
                      {errors.usageLimit.message}
                    </span>
                  )}
                </div>

                <Toggle
                  label={t("voucher.createOrUpdate.usagePerCustomer")}
                  description={t("voucher.createOrUpdate.usagePerCustomerDesc")}
                  checked={watch("usagePerCustomer") !== ""}
                  onChange={(checked) => {
                    setValue("usagePerCustomer", checked ? "1" : "", {
                      shouldValidate: true,
                      shouldDirty: true,
                    });

                    trigger("usagePerCustomer");
                  }}
                />
                {watch("usagePerCustomer") !== "" && (
                  <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                      {t("voucher.createOrUpdate.usageLimitPerCustomer")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register("usagePerCustomer")}
                      placeholder={t(
                        "voucher.createOrUppdate.usageLimitPerCustomerPlaceholder",
                      )}
                      className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none"
                    />
                    {errors.usagePerCustomer && (
                      <span className="text-red-500">
                        {errors.usagePerCustomer.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </CommonModal>
  );
};

export default CreateVoucher;
