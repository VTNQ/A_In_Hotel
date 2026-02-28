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
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT: Status */}
        <div className="w-full sm:w-[180px]">
          <SelectField
            isRequired={false}
            items={[
              { value: "All", label: t("common.all") },
              { value: "ACTIVE", label: t("common.active") },
              { value: "INACTIVE", label: t("common.deActivate") },
            ]}
            value={statusFilter === "All" ? "All" : String(statusFilter)}
            onChange={(v) => onStatusFilterChange(v as string)}
            size="sm"
            fullWidth
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
          />
        </div>

        {/* RIGHT: Search + Button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center min-w-0">
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-full"
              value={search}
              placeholder={t("banner.searchPlaceholder")}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Button asChild className="whitespace-nowrap w-full sm:w-auto">
            <a href="/Home/post/banner/create">{t("banner.new")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default BannerFilter;
