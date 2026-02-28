import { getAllCategories } from "@/service/api/Categories";
import { getVoucherById, updateVoucher } from "@/service/api/Voucher";
import {
  CUSTOMER_TYPE_OPTIONS,
  USAGE_TYPE_OPTIONS,
  type UpdateVoucherModalProps,
  type voucherFormProps,
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

const UpdateVoucher = ({
  isOpen,
  onClose,
  onSuccess,
  voucherId,
}: UpdateVoucherModalProps) => {
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<voucherFormProps>({
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
  });

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
        const categories = categoryRes.content || [];
        setRoomTypes(categories);

        // 2. Load voucher detail
        const voucherRes = await getVoucherById(voucherId);
        const voucher = voucherRes?.data?.data;

        setFormData({
          voucherCode: voucher.voucherCode,
          voucherName: voucher.voucherName,
          type: voucher.type,
          description: voucher.description,
          value: voucher.value,
          maxDiscountValue: voucher.maxDiscountValue,
          bookingType: voucher.bookingType,
          minimumStay: voucher.minimumStay,
          customerType: voucher.customerType,
          usageType: voucher.usageType,
          usageLimit: voucher.usageLimit,
          usagePerCustomer: voucher.usagePerCustomer,
          startDate: voucher.startDate,
          endDate: voucher.endDate,
          stackWithPromotion: voucher.stackWithPromotion,
          stackWithOtherVoucher: voucher.stackWithOtherVoucher,
          priority: voucher.priority,

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
    setFormData({
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
    setFormData((prev: any) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((r: any) => ({
        ...r,
        excluded: true,
      })),
    }));
  };
  const unselectAllRoomTypes = () => {
    setFormData((prev: any) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((r: any) => ({
        ...r,
        excluded: false,
      })),
    }));
  };
  const toggleRoomType = (roomTypeId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((r: any) =>
        r.roomTypeId === roomTypeId ? { ...r, excluded: !r.excluded } : r,
      ),
    }));
  };
  const isPercent = formData.type === "2";
  const handleSubmit = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const payload = {
        voucherCode: formData.voucherCode,
        voucherName: formData.voucherName,
        type: formData.type,
        description: formData.description,
        value: formData.value,
        maxDiscountValue: isPercent ? formData.maxDiscountValue : "",
        bookingType: formData.bookingType,
        minimumStay: formData.minimumStay,
        customerType: formData.customerType,
        usageType: formData.usageType,
        usageLimit: formData.usageLimit,
        usagePerCustomer:
          formData.usagePerCustomer == "" ? null : formData.usagePerCustomer,
        startDate: formData.startDate,
        endDate: formData.endDate,
        stackWithPromotion: formData.stackWithPromotion,
        stackWithOtherVoucher: formData.stackWithOtherVoucher,
        priority: formData.priority,
        roomTypes: formData.roomTypes.map((r: any) => ({
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
      setFormData({
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
                    <label className="block mb-1 font-medium text-[#253150]">
                      {t("voucher.createOrUpdate.voucherName")}
                    </label>
                    <Input
                      value={formData.voucherName}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          voucherName: e.target.value,
                        }));
                      }}
                      type="text"
                      placeholder={t(
                        "voucher.createOrUpdate.voucherNamePlaceHolder",
                      )}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                      {t("voucher.createOrUpdate.voucherCode")}
                    </label>
                    <Input
                      type="text"
                      value={formData.voucherCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          voucherCode: e.target.value,
                        }))
                      }
                      placeholder={t(
                        "voucher.createOrUpdate.voucherCodePlaceHolder",
                      )}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-[#253150]">
                      {t("voucher.createOrUpdate.description")}
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
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
                      <label className="block mb-1 font-medium text-[#253150]">
                        {t("voucher.createOrUpdate.startDate")}
                      </label>
                      <div className="relative">
                        <DatePickerField
                          value={formData.startDate}
                          onChange={(d?: Date) =>
                            setFormData((p) => ({ ...p, startDate: d }))
                          }
                          className="mt-1"
                          placeholder={t("staff.birthdayPlaceholder")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-[#253150]">
                        {t("voucher.createOrUpdate.endDate")}
                      </label>
                      <div className="relative">
                        <DatePickerField
                          value={formData.endDate}
                          onChange={(d?: Date) =>
                            setFormData((p) => ({ ...p, endDate: d }))
                          }
                          className="mt-1"
                          placeholder={t("staff.birthdayPlaceholder")}
                        />
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
                      checked={formData.stackWithPromotion}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          stackWithPromotion: value,
                        }))
                      }
                    />
                    <Toggle
                      label={t("voucher.createOrUpdate.stackWithOtherVoucher")}
                      description={t(
                        "voucher.createOrUpdate.stackWithOtherVoucherDesc",
                      )}
                      checked={formData.stackWithOtherVoucher}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          stackWithOtherVoucher: value,
                        }))
                      }
                    />

                    <div>
                      <label className="block mb-1 font-medium text-[#253150]">
                        {t("voucher.createOrUpdate.priority")}{" "}
                        <span className="text-gray-400 font-normal">
                          ({t("voucher.createOrUpdate.priorityOptional")})
                        </span>
                      </label>
                      <Input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            priority: e.target.value,
                          }));
                        }}
                        placeholder="1"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-[#E3E7F2] bg-white">
                    {roomTypes.map((room) => {
                      const roomState = formData.roomTypes.find(
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
                            onChange={() => toggleRoomType(room.id)}
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
                    <SelectField
                      isRequired={true}
                      items={[
                        { value: "1", label: t("promotion.offer.fixed") },
                        { value: "2", label: t("promotion.offer.percent") },
                        { value: "3", label: t("promotion.offer.special") },
                      ]}
                      value={formData.type}
                      onChange={(v) => setFormData((p) => ({ ...p, type: v }))}
                      size="sm"
                      fullWidth={true}
                      getValue={(i) => i.value}
                      getLabel={(i) => i.label}
                    />
                  </div>

                  <div
                    className={`grid gap-4 ${isPercent ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-4`}
                  >
                    <div>
                      <label className="block mb-1 font-medium text-[#253150]">
                        {t("voucher.createOrUpdate.value")}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.value}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }));
                          }}
                          placeholder={t(
                            "voucher.createOrUpdate.valuePlaceholder",
                          )}
                          className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">
                          {isPercent ? "%" : "VND"}
                        </span>
                      </div>
                    </div>

                    {isPercent && (
                      <div>
                        <label className="block mb-1 font-medium text-[#253150]">
                          {t("voucher.createOrUpdate.maxDiscount")}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={formData.maxDiscountValue}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                maxDiscountValue: e.target.value,
                              }))
                            }
                            placeholder={t(
                              "voucher.createOrUpdate.maxDiscountPlaceholder",
                            )}
                            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2.5 outline-none pr-12"
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
                      <label className="block mb-1 font-medium text-[#253150]">
                        {t("voucher.createOrUpdate.bookingType")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#253150]">
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
                          value={formData.bookingType}
                          onChange={(v) =>
                            setFormData((prev) => ({ ...prev, bookingType: v }))
                          }
                          size="sm"
                          fullWidth
                          getValue={(i) => i.value}
                          getLabel={(i) => i.label}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-[#253150]">
                        {t("voucher.createOrUpdate.minimumStay")}
                      </label>
                      <Input
                        value={formData.minimumStay}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            minimumStay: e.target.value,
                          }));
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
                      <span className="block mb-1 font-medium text-[#253150]">
                        {t("voucher.createOrUpdate.customerType")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-[#E3E7F2] bg-white">
                      {CUSTOMER_TYPE_OPTIONS.map((type) => {
                        const checked = formData.customerType === type.value;
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
                                setFormData((prev) => ({
                                  ...prev,
                                  customerType: type.value,
                                }));
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-[#E3E7F2] bg-white">
                      {USAGE_TYPE_OPTIONS.map((opt) => {
                        const checked = formData.usageType === opt.value;
                        return (
                          <div
                            key={opt.value}
                            role="radio"
                            aria-checked={checked}
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                usageType: opt.value,
                              }));
                            }}
                            className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer  ${
                              checked
                                ? " bg-[#253150]/5"
                                : "border-[#D6DBEA] hover:bg-gray-50"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                checked
                                  ? "border-[#253150]"
                                  : "border-[#C6CCDD]"
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
                      <Input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            usageLimit: e.target.value,
                          }));
                        }}
                        placeholder="100"
                      />
                    </div>

                    <Toggle
                      label={t("voucher.createOrUpdate.usagePerCustomer")}
                      description={t(
                        "voucher.createOrUpdate.usagePerCustomerDesc",
                      )}
                      checked={formData.usagePerCustomer !== ""}
                      onChange={(checked) => {
                        setFormData((prev) => ({
                          ...prev,
                          usagePerCustomer: checked ? "1" : "",
                        }));
                      }}
                    />
                    {formData.usagePerCustomer !== "" && (
                      <div>
                        <label className="block mb-1 font-medium text-[#253150]">
                          {t("voucher.createOrUpdate.usageLimitPerCustomer")}
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={formData.usagePerCustomer}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              usagePerCustomer: e.target.value,
                            }))
                          }
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
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSubmit} disabled={loading}
              className="w-full sm:w-auto min-w-[140px]"
              >
                {loading ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default UpdateVoucher;
