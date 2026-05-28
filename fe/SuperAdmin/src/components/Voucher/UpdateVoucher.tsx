import { getAllCategories } from "@/service/api/Categories";
import { getVoucherById, updateVoucher } from "@/service/api/Voucher";
import {
  CUSTOMER_TYPE_OPTIONS,
  USAGE_TYPE_OPTIONS,
  type UpdateVoucherModalProps,
} from "@/type/voucher.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAlert } from "../alert-context";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Toggle from "../ui/Toogle";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DatePickerField } from "../ui/DatePickerField";
import { SelectField } from "../ui/select";
import { Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const UpdateVoucher = ({
  isOpen,
  onClose,
  onSuccess,
  voucherId,
}: UpdateVoucherModalProps) => {
  const { t } = useTranslation();
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

      startDate: z
        .date()
        .optional()
        .refine((val) => val !== undefined, {
          message: t("voucher.validation.startDateRequired"),
        }),
      endDate: z
        .date()
        .optional()
        .refine((val) => val !== undefined, {
          message: t("voucher.validation.endDateRequired"),
        }),

      stackWithPromotion: z.boolean(),

      stackWithOtherVoucher: z.boolean(),

      priority: z.string().optional(),

      roomTypes: z.array(
        z.object({
          roomTypeId: z.any(),
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
      startDate: undefined,
      endDate: undefined,
      stackWithPromotion: false,
      stackWithOtherVoucher: false,
      priority: "",
      roomTypes: [],
    },
  });

  const { showAlert } = useAlert();

  useEffect(() => {
    if (!isOpen || !voucherId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Load room types
        const categoryRes = await getAllCategories({
          all: true,
          filter: "isActive==1 and type==1",
        });
        const categories = categoryRes?.data?.content || [];
        setRoomTypes(categories);

        // 2. Load voucher detail
        const voucherRes = await getVoucherById(voucherId);
        const voucher = voucherRes?.data?.data;

        reset({
          voucherCode: voucher.voucherCode,
          voucherName: voucher.voucherName,
          type: String(voucher.type),
          description: voucher.description,
          value: String(voucher.value),
          maxDiscountValue: String(voucher.maxDiscountValue),
          bookingType: String(voucher.bookingType),
          minimumStay: String(voucher.minimumStay),
          customerType: voucher.customerType,
          usageType: voucher.usageType,
          usageLimit: String(voucher.usageLimit),
          usagePerCustomer: String(voucher.usagePerCustomer),
          startDate: voucher.startDate
            ? new Date(voucher.startDate)
            : undefined,

          endDate: voucher.endDate ? new Date(voucher.endDate) : undefined,
          stackWithPromotion: voucher.stackWithPromotion,
          stackWithOtherVoucher: voucher.stackWithOtherVoucher,
          priority: String(voucher.priority),

          // 3. Map roomTypes theo voucher
          roomTypes: categories.map((room: any) => {
            const matched = (voucher.roomTypes || []).find(
              (v: any) => v.roomTypeId === room.id,
            );

            return {
              roomTypeId: room.id,
              excluded: matched ? matched.excluded : false,
            };
          }),
        });
      } catch (err) {
        console.error(err);
        showAlert({
          title: "Failed to load voucher!",
          type: "error",
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, voucherId]);
  const handleCancel = () => {
    reset({
      voucherCode: "",
      voucherName: "",
      type: "",
      description: "",
      value: "",
      maxDiscountValue: "",
      bookingType: "",
      minimumStay: "",
      customerType: 0,
      usageType: 1,
      usageLimit: "",
      usagePerCustomer: "",
      startDate: undefined,
      endDate: undefined,
      stackWithPromotion: false,
      stackWithOtherVoucher: false,
      priority: "",
      roomTypes: [],
    });
    onClose();
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
  const toggleRoomType = (roomTypeId: string) => {
    const currentRoomTypes = watch("roomTypes") || [];

    setValue(
      "roomTypes",
      currentRoomTypes.map((r) =>
        r.roomTypeId === roomTypeId ? { ...r, excluded: !r.excluded } : r,
      ),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    trigger("roomTypes");
  };
  const onSubmit = async (data: VoucherFormData) => {
    try {
      const payload = {
        voucherCode: data.voucherCode,
        voucherName: data.voucherName,
        type: data.type,
        description: data.description,
        value: data.value,
        maxDiscountValue: watch("type") === "2" ? data.maxDiscountValue : "",
        bookingType: data.bookingType,
        minimumStay: data.minimumStay,
        customerType: data.customerType,
        usageType: data.usageType,
        usageLimit: data.usageLimit,
        usagePerCustomer:
          data.usagePerCustomer == "" ? null : data.usagePerCustomer,
        startDate: data.startDate,
        endDate: data.endDate,
        stackWithPromotion: data.stackWithPromotion,
        stackWithOtherVoucher: data.stackWithOtherVoucher,
        priority: data.priority,
        roomTypes: data.roomTypes.map((r: any) => ({
          roomTypeId: r.roomTypeId,
          excluded: r.excluded,
        })),
      };
      const response = await updateVoucher(voucherId, payload);
      showAlert({
        title:
          response?.data?.message || t("voucher.createOrUpdate.updateSucess"),
        type: "success",
        autoClose: 3000,
      });
      reset({
        voucherCode: "",
        voucherName: "",
        type: "",
        description: "",
        value: "",
        maxDiscountValue: "",
        bookingType: "",
        minimumStay: "",
        customerType: 0,
        usageType: 1,
        usageLimit: "",
        usagePerCustomer: "",
        startDate: undefined,
        endDate: undefined,
        stackWithPromotion: false,
        stackWithOtherVoucher: false,
        priority: "",
        roomTypes: [],
      });
      onClose();
      onSuccess();
    } catch (err: any) {
      showAlert({
        title:
          err?.response?.data?.message ||
          t("voucher.createOrUpdate.updateError"),
        type: "error",
      });
    }
  };
  if (!isOpen) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        size="xl"
        className="w-[calc(100vw-24px)] sm:w-[calc(100vw-48px)] lg:w-[1100px]
        max-w-none p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <DialogHeader>
          <DialogTitle>{t("voucher.createOrUpdate.titleEdit")}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 ">
              {/* ================= LEFT ================= */}
              <div className="space-y-10">
                {/* General Information */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("voucher.createOrUpdate.generalInformation")}
                  </h2>

                  <div>
                    <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                      {t("voucher.createOrUpdate.voucherName")}
                    </label>
                    <Input
                      {...register("voucherName")}
                      type="text"
                      placeholder={t(
                        "voucher.createOrUpdate.voucherNamePlaceHolder",
                      )}
                    />
                    {errors.voucherName && (
                      <span className="text-red-500">
                        {errors.voucherName.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                      {t("voucher.createOrUpdate.voucherCode")}
                    </label>
                    <Input
                      type="text"
                      {...register("voucherCode")}
                      placeholder={t(
                        "voucher.createOrUpdate.voucherCodePlaceHolder",
                      )}
                    />
                    {errors.voucherCode && (
                      <span className="text-red-500">
                        {errors.voucherCode.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                      {t("voucher.createOrUpdate.description")}
                    </label>
                    <Textarea
                      {...register("description")}
                      placeholder={t(
                        "voucher.createOrUpdate.descriptionPlaceholder",
                      )}
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
                      <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                        {t("voucher.createOrUpdate.startDate")}
                      </label>
                      <div className="relative">
                        <DatePickerField
                          value={watch("startDate")}
                          onChange={(d?: Date) => {
                            setValue("startDate", d, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            trigger("startDate");
                          }}
                          className="mt-1"
                          placeholder={t("staff.birthdayPlaceholder")}
                        />
                        {errors.startDate && (
                          <span className="text-red-500">
                            {errors.startDate.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                        {t("voucher.createOrUpdate.endDate")}
                      </label>
                      <div className="relative">
                        <DatePickerField
                          value={watch("endDate")}
                          onChange={(d?: Date) => {
                            setValue("endDate", d, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            trigger("endDate");
                          }}
                          className="mt-1"
                          placeholder={t("staff.birthdayPlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Stack & Priority Rules */}
                <section className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("voucher.createOrUpdate.stackAndPriority")}
                  </h2>

                  <div
                    className="p-5 rounded-xl border border-[#E3E7F2] bg-gray-50 space-y-5
                  dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <Toggle
                      label={t("voucher.createOrUpdate.stackWithPromotion")}
                      description={t(
                        "voucher.createOrUpdate.stackWithPromotionDesc",
                      )}
                      checked={watch("stackWithPromotion")}
                      onChange={(value) => {
                        setValue("stackWithPromotion", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        trigger("stackWithPromotion");
                      }}
                    />
                    <Toggle
                      label={t("voucher.createOrUpdate.stackWithOtherVoucher")}
                      description={t(
                        "voucher.createOrUpdate.stackWithOtherVoucherDesc",
                      )}
                      checked={watch("stackWithOtherVoucher")}
                      onChange={(value) => {
                        setValue("stackWithOtherVoucher", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        trigger("stackWithOtherVoucher");
                      }}
                    />

                    <div>
                      <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                        {t("voucher.createOrUpdate.priority")}{" "}
                        <span className="text-gray-400 font-normal dark:text-slate-500">
                          ({t("voucher.createOrUpdate.priorityOptional")})
                        </span>
                      </label>
                      <Input
                        type="number"
                        value={watch("priority")}
                        onChange={(e) => {
                          setValue("priority", e.target.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          trigger("priority");
                        }}
                        placeholder="1"
                      />
                    </div>
                  </div>
                </section>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                      {t("voucher.createOrUpdate.roomTypes")}
                    </span>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={selectAllRoomTypes}
                        className="text-xs text-[#253150] font-semibold hover:underline dark:text-slate-200"
                      >
                        {t("voucher.createOrUpdate.selectAll")}
                      </button>

                      <button
                        type="button"
                        onClick={unselectAllRoomTypes}
                        className="text-xs text-gray-500 hover:underline dark:text-slate-400"
                      >
                        {t("voucher.createOrUpdate.clear")}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-[#E3E7F2] bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    {roomTypes.map((room) => {
                      const roomState = watch("roomTypes").find(
                        (r) => r.roomTypeId === room.id,
                      );

                      const checked = roomState?.excluded === true;

                      return (
                        <label
                          key={room.id}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
            ${checked ? "bg-[#253150]/5 dark:bg-[#42578E]/20" : "hover:bg-gray-50 dark:hover:bg-slate-700/40"}
          `}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleRoomType(room.id)}
                            className="hidden"
                          />

                          {/* Custom checkbox */}
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
              ${checked ? "bg-[#253150] border-[#253150]" : "border-[#C6CCDD] dark:border-slate-500"}
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

                          <span className="text-sm font-medium text-[#253150] dark:text-slate-200">
                            {room.name}
                          </span>
                        </label>
                      );
                    })}
                  </div>
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
                    <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                      {t("voucher.createOrUpdate.discountType")}
                    </label>
                    <SelectField
                      isRequired={true}
                      items={[
                        { value: "1", label: t("promotion.offer.fixed") },
                        { value: "2", label: t("promotion.offer.percent") },
                        { value: "3", label: t("promotion.offer.special") },
                      ]}
                      value={watch("type")}
                      onChange={(v) => {
                        setValue("type", String(v), {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        trigger("type");
                      }}
                      size="sm"
                      fullWidth={true}
                      getValue={(i) => String(i.value)}
                      getLabel={(i) => i.label}
                    />
                  </div>

                  <div
                    className={`grid gap-4 ${watch("type") === "2" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-4`}
                  >
                    <div>
                      <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                        {t("voucher.createOrUpdate.value")}
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={watch("value")}
                          onChange={(e) => {
                            setValue("value", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            trigger("value");
                          }}
                          placeholder={t(
                            "voucher.createOrUpdate.valuePlaceholder",
                          )}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">
                          {watch("type") === "2" ? "%" : "VND"}
                        </span>
                      </div>
                    </div>

                    {watch("type") === "2" && (
                      <div>
                        <label className="block mb-1 font-medium text-[#253150]">
                          {t("voucher.createOrUpdate.maxDiscount")}
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={watch("maxDiscountValue")}
                            onChange={(e) => {
                              setValue("maxDiscountValue", e.target.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              trigger("maxDiscountValue");
                            }}
                            placeholder={t(
                              "voucher.createOrUpdate.maxDiscountPlaceholder",
                            )}
                          />
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
                      <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                        {t("voucher.createOrUpdate.bookingType")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150] dark:text-slate-300 z-10">
                          <Calendar size={18} />
                        </span>

                        <SelectField
                          isRequired={true}
                          items={[
                            {
                              value: "1",
                              label: t("bookingDateTime.packageDayUse"),
                            },
                            {
                              value: "2",
                              label: t("bookingDateTime.packageOvernight"),
                            },
                            {
                              value: "3",
                              label: t("bookingDateTime.packageFullDay"),
                            },
                          ]}
                          value={watch("bookingType")}
                          onChange={(v) => {
                            setValue("bookingType", String(v), {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            trigger("bookingType");
                          }}
                          size="sm"
                          fullWidth
                          getValue={(i) => i.value}
                          getLabel={(i) => i.label}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                        {t("voucher.createOrUpdate.minimumStay")}
                      </label>

                      <Input
                        value={watch("minimumStay")}
                        onChange={(e) => {
                          setValue("minimumStay", e.target.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          trigger("minimumStay");
                        }}
                        type="number"
                        placeholder="2"
                      />
                    </div>
                  </div>
                  {/* Room Types */}

                  {/* Customer Type */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                        {t("voucher.createOrUpdate.customerType")}
                      </span>
                    </div>

                    <div
                      className="
                         grid grid-cols-2 gap-3 p-4 rounded-xl
                         border border-[#E3E7F2]
                         bg-white
                         dark:bg-neutral-900
                         dark:border-neutral-800
                       "
                    >
                      {CUSTOMER_TYPE_OPTIONS.map((type) => {
                        const checked = watch("customerType") === type.value;

                        return (
                          <label
                            key={type.value}
                            className={`
                               flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors
                               ${
                                 checked
                                   ? "bg-[#253150]/5 dark:bg-slate-700/50"
                                   : "hover:bg-gray-50 dark:hover:bg-slate-800"
                               }
                             `}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setValue("customerType", type.value, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                              className="hidden"
                            />

                            <div
                              className={`
                                 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                                 ${
                                   checked
                                     ? "bg-[#253150] border-[#253150] dark:bg-blue-500 dark:border-blue-500"
                                     : "border-[#C6CCDD] dark:border-slate-600"
                                 }
                               `}
                            >
                              {checked && (
                                <div className="w-2.5 h-2.5 bg-white rounded" />
                              )}
                            </div>

                            <span className="text-sm font-medium text-[#253150] dark:text-slate-200">
                              {t(type.labelKey)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Usage Frequency */}
                  <div className="space-y-2">
                    <span className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                      {t("voucher.createOrUpdate.usageFrequency")}
                    </span>

                    <div
                      className="
        grid grid-cols-2 gap-4 p-4 rounded-xl
        border border-[#E3E7F2]
        bg-white
        dark:bg-neutral-900
        dark:border-neutral-800
      "
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
                            className={`
              flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors
              ${
                checked
                  ? "bg-[#253150]/5 dark:bg-slate-700/50"
                  : "border-[#D6DBEA] dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
              }
            `}
                          >
                            <div
                              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${
                  checked
                    ? "border-[#253150] dark:border-blue-400"
                    : "border-[#C6CCDD] dark:border-slate-600"
                }
              `}
                            >
                              {checked && (
                                <div className="w-2.5 h-2.5 bg-[#253150] dark:bg-blue-400 rounded-full" />
                              )}
                            </div>

                            <span
                              className={`
                text-sm font-medium
                ${
                  checked
                    ? "text-[#253150] dark:text-white"
                    : "text-[#4B5563] dark:text-slate-300"
                }
              `}
                            >
                              {t(opt.labelKey)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total Usage + Usage per customer */}
                  <div
                    className="
      p-5 rounded-xl space-y-4
      border border-[#E3E7F2]
      bg-gray-50
      dark:bg-neutral-900
        dark:border-neutral-800
    "
                  >
                    <div>
                      <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                        {t("voucher.createOrUpdate.totalUsageLimit")}
                      </label>

                      <Input
                        type="number"
                        value={watch("usageLimit")}
                        onChange={(e) => {
                          setValue("usageLimit", e.target.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          trigger("usageLimit");
                        }}
                        placeholder="100"
                      />
                    </div>

                    <Toggle
                      label={t("voucher.createOrUpdate.usagePerCustomer")}
                      description={t(
                        "voucher.createOrUpdate.usagePerCustomerDesc",
                      )}
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
                        <label className="block mb-1 font-medium text-[#253150] dark:text-slate-200">
                          {t("voucher.createOrUpdate.usageLimitPerCustomer")}
                        </label>

                        <Input
                          type="number"
                          min={1}
                          value={watch("usagePerCustomer")}
                          onChange={(e) => {
                            setValue("usagePerCustomer", e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });

                            trigger("usagePerCustomer");
                          }}
                          placeholder={t(
                            "voucher.createOrUppdate.usageLimitPerCustomerPlaceholder",
                          )}
                        />
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading || isSubmitting}
                className="w-full sm:w-auto"
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={loading || isSubmitting || !isValid}
                className="w-full sm:w-auto min-w-[140px]"
              >
                {isSubmitting ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default UpdateVoucher;
