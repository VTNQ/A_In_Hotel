import { useState } from "react";
import type { VoucherFormModalProps } from "../../type/voucher.types";
import CommonModal from "../ui/CommonModal";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "../ui/CustomDatePicker";
import { useAlert } from "../alert-context";
import { createVoucher } from "../../service/api/Voucher";

const VoucherFormModal = ({
  isOpen,
  onClose,
  onSuccess,
}: VoucherFormModalProps) => {
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState<{
    voucherName: string;
    discountType: string;
    discountValue: string;
    minBookingAmount: string;
    maxDiscount: string;
    startDate: Date | null;
    endDate: Date | null;
    usageLimit: string;
    usageCount: string;
  }>({
    voucherName: "",
    discountType: "",
    discountValue: "",
    minBookingAmount: "",
    maxDiscount: "",
    startDate: null,
    endDate: null,
    usageLimit: "",
    usageCount: "",
  });

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancel = () => {
    setFormData({
      voucherName: "",
      discountType: "",
      discountValue: "",
      minBookingAmount: "",
      maxDiscount: "",
      startDate: null,
      endDate: null,
      usageLimit: "",
      usageCount: "",
    });
    onClose();
  };
  const handleDateChange = (name: "startDate" | "endDate", date: Date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const cleanedData = Object.fromEntries(
        Object.entries({
          voucherName: formData.voucherName,
          discountType: formData.discountType,
          discountValue: formData.discountValue,
          minBookingAmount: formData.minBookingAmount,
          maxDiscount: formData.maxDiscount,
          startDate: formData.startDate
            ? formData.startDate.toISOString().split("T")[0]
            : null,
          endDate: formData.endDate
            ? formData.endDate.toISOString().split("T")[0]
            : null,
          usageLimit: formData.usageLimit,
          usageCount: formData.usageCount,
        }).map(([key, value]) => [
          key,
          value?.toString().trim() === "" ? null : value,
        ])
      );
      const response = await createVoucher(cleanedData);
      const message = response?.data?.message || t("voucher.createOrUpdate.createSucess");
      showAlert({
        title: message,
        type: "success",
        autoClose: 3000,
      });
      setFormData({
        voucherName: "",
        discountType: "",
        discountValue: "",
        minBookingAmount: "",
        maxDiscount: "",
        startDate: null,
        endDate: null,
        usageLimit: "",
        usageCount: "",
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Create error:", err);
      showAlert({
        title: err?.response?.data?.message || t("voucher.createOrUpdate.createError"),
        type: "error",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <CommonModal
      isOpen={isOpen}
      onSave={handleSubmit}
      onClose={handleCancel}
      title={t("voucher.createOrUpdate.titleCreate")}
      saveLabel={loading ? t("common.saving") : t("common.save")}
      cancelLabel={t("common.cancelButton")}
      width="w-[95vw] sm:w-[90vw] lg:w-[1000px]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("voucher.name")} *
          </label>
          <input
            type="text"
            name="voucherName"
            placeholder={t("voucher.createOrUpdate.namePlaceHolder")}
            value={formData.voucherName}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("voucher.discountType")}
          </label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
          >
            <option value="">
              {t("voucher.createOrUpdate.discountTypeSelect")}
            </option>
            <option value="1">{t("voucher.createOrUpdate.percent")}</option>
            <option value="2">{t("voucher.createOrUpdate.fixed")}</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("voucher.discountValue")}
          </label>
          <input
            type="number"
            name="discountValue"
            value={formData.discountValue}
            placeholder={t("voucher.createOrUpdate.discountValuePlaceHolder")}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("voucher.minBookingAmount")}
          </label>
          <input
            type="number"
            name="minBookingAmount"
            value={formData.minBookingAmount}
            placeholder={t(
              "voucher.createOrUpdate.minBookingAmountPlaceHolder"
            )}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("voucher.maxDiscount")}
          </label>
          <input
            type="number"
            name="maxDiscount"
            value={formData.maxDiscount}
            placeholder={t("voucher.createOrUpdate.maxDiscountPlaceHolder")}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("voucher.startDate")}
          </label>
          <CustomDatePicker
            value={formData.startDate}
            minDate={new Date()}
            placeholder={t("voucher.createOrUpdate.selectStartDate")}
            onChange={(date: any) => handleDateChange("startDate", date)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("voucher.endDate")}
          </label>
          <CustomDatePicker
            value={formData.endDate}
              minDate={formData.startDate ?? new Date()}
            placeholder={t("voucher.createOrUpdate.selectEndDate")}
            onChange={(date: any) => handleDateChange("endDate", date)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#253150]">
            {t("voucher.usageLimit")}
          </label>
          <input
            type="number"
            name="usageLimit"
            value={formData.usageLimit}
            placeholder={t("voucher.createOrUpdate.usageLimitPlaceHolder")}
            onChange={handleChange}
            className="w-full border border-[#4B62A0] focus:border-[#3E5286] rounded-lg p-2 outline-none"
            required
          />
        </div>
      </div>
    </CommonModal>
  );
};
export default VoucherFormModal;