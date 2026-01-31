import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select";
import { PACKAGE_TIME_MAP } from "@/type/booking.types";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

const BookingDetailsPanel = ({ form, nights, onChange }: any) => {
  const isAutoTimePackage = form.package === "2" || form.package === "3";
  const { t } = useTranslation();
  const PACKAGE_OPTIONS = [
    { label: t("bookingDateTime.packageDayUse"), value: "1" },
    { label: t("bookingDateTime.packageOvernight"), value: "2" },
    { label: t("bookingDateTime.packageFullDay"), value: "3" },
  ];

  const packageOptions = useMemo(() => {
    return PACKAGE_OPTIONS.map((opt) => ({
      ...opt,
      disabled: opt.value === "2" && nights > 1, // ✅ chỉ overnight
    }));
  }, [nights, t]);
  useEffect(() => {
    if (!form.checkInDate || !form.checkOutDate) return;

    if (nights === 0 && form.package !== "1") {
      onChange("package", "1");
    }

    if (nights === 1 && form.package !== "2") {
      onChange("package", "2");
    }

    if (nights >= 2 && form.package !== "3") {
      onChange("package", "3");
    }
  }, [nights, form.checkInDate, form.checkOutDate]);

  /* ======================
     AUTO SET TIME BY PACKAGE
  ====================== */
  useEffect(() => {
    const time = PACKAGE_TIME_MAP[form.package];
    if (!time) return;

    onChange("checkInTime", time.checkIn);
    onChange("checkOutTime", time.checkOut);
  }, [form.package]);
  return (
    <div className="border rounded-xl p-4 bg-white space-y-4">
      <h3 className="font-semibold text-gray-900">
        {t("bookingDateTime.bookingDetails")}
      </h3>
      <div>
        <label className="text-sm font-medium">
          {t("bookingDateTime.checkInDate")}
        </label>
        <Input value={form.checkInDate} readOnly />
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("bookingDateTime.checkInTime")}
        </label>
        <Input
          type="time"
          value={form.checkInTime}
          disabled={isAutoTimePackage}
          onChange={(e) => onChange("checkInTime", e.target.value)}
        />
      </div>
  
      <div>
        <label className="text-sm font-medium">
          {t("bookingDateTime.checkOutDate")}
        </label>
        <Input value={form.checkOutDate} readOnly />
      </div>
          <div>
        <label className="text-sm font-medium">
          {t("bookingDateTime.checkOutTime")}
        </label>
        <Input
          type="time"
          value={form.checkOutTime}
          disabled={isAutoTimePackage}
          onChange={(e) => onChange("checkOutTime", e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium">
          {t("bookingDateTime.package")}
        </label>
        <SelectField
          items={packageOptions}
          value={form.package}
          onChange={(v) => onChange("package", v)}
          isRequired={true}
          placeholder={t("bookingDateTime.selectPackage")}
          getValue={(i) => i.value}
          getLabel={(i) => i.label}
          getDisabled={(i) => !!i.disabled}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">
            {t("bookingDateTime.adults")}
          </label>
          <Input
            min={1}
            value={form.adults}
            onChange={(e) => onChange("adults", Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">
            {t("bookingDateTime.children")}
          </label>
          <Input
            min={0}
            value={form.children}
            onChange={(e) => onChange("children", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="border-t pt-4 text-sm flex justify-between">
        <span>{t("bookingDateTime.duration")}</span>
        <span className="font-medium text-indigo-600">
          {nights}{" "}
          {nights > 1
            ? t("bookingDateTime.nights")
            : t("bookingDateTime.night")}
        </span>
      </div>
    </div>
  );
};

export default BookingDetailsPanel;
