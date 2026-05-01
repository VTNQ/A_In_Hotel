import type { VoucherFilterProps } from "@/type/voucher.types";
import { SelectField } from "../ui/select";
import type { Status } from "@/type/common";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const VoucherFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: VoucherFilterProps) => {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-col sm:flex-row lg:items-end gap-3 w-full mt-2">
      {/* STATUS */}
      <div className="w-full sm:w-[180px]">
        <SelectField
          isRequired={false}
          items={[
            { value: "ALL", label: t("common.all") },
            { value: "1", label: t("common.active") },
            { value: "0", label: t("common.deActivate") },
          ]}
          value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
          onChange={(v) =>
            onStatusFilterChange(v === "ALL" ? "ALL" : (Number(v) as Status))
          }
          size="sm"
          fullWidth
          getValue={(i) => i.value}
          getLabel={(i) => i.label}
        />
      </div>

      {/* SEARCH */}
      <div className="relative w-full sm:w-[280px] lg:w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-9"
          value={search}
          placeholder={t("voucher.searchPlaceholder")}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* BUTTON */}
      <Button asChild className="w-full sm:w-auto whitespace-nowrap">
        <a href="/Home/coupon/voucher/create">{t("voucher.new")}</a>
      </Button>
    </div>
  );
};
export default VoucherFilter;
