import type { PromotionFilterProps } from "@/type/Promotion.types";
import { useTranslation } from "react-i18next";
import { SelectField } from "../ui/select";
import type { Status } from "@/type/common";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const PromotionFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: PromotionFilterProps) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < 640);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    });
  return (
    <div className="flex flex-col sm:flex-row lg:items-end gap-3 w-full mt-2">
      <div className="w-full sm:w-48">
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
          fullWidth={isMobile}
          getValue={(i) => i.value}
          getLabel={(i) => i.label}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:ml-auto">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
          <Input
            className="pl-9"
            value={search}
            placeholder={t("promotion.searchPlaceholder")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <Button asChild>
        <a href="/Home/coupon/promotion/create">{t("promotion.new")}</a>
      </Button>
    </div>
  );
};
export default PromotionFilter;
