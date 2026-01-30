import type { BannerFilterProps } from "@/type/banner.types";
import { useTranslation } from "react-i18next";
import { SelectField } from "../ui/select";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const BannerFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: BannerFilterProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <div className="w-50">
        <SelectField
          isRequired={false}
          items={[
            { value: "All", label: t("common.all") },
            { value: "ACTIVE", label: t("common.active") },
            { value: "INACTIVE", label: t("common.deActivate") },
          ]}
          value={statusFilter === "All" ? "All" : String(statusFilter)}
          onChange={(v) => onStatusFilterChange(v === "" ? "" : (v as string))}
          size="sm"
          fullWidth
          getValue={(i) => i.value}
          getLabel={(i) => i.label}
        />
      </div>
      <div className="relative w-72">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
        <Input
          className="pl-9"
          value={search}
          placeholder={t("banner.searchPlaceholder")}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button asChild>
        <a href="/Home/post/banner/create">{t("banner.new")}</a>
      </Button>
    </div>
  );
};
export default BannerFilter;
