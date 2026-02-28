import { useTranslation } from "react-i18next";
import { SelectField } from "../ui/select";
import type { CategoryFilterProps } from "@/type/category.types";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Status } from "@/type/common";

export const CategoryFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}: CategoryFilterProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT: Status + Type */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap min-w-0">
          <div className="w-full sm:w-[160px]">
            <SelectField
              isRequired={false}
              items={[
                { value: "ALL", label: t("common.all") },
                { value: "1", label: t("common.active") },
                { value: "0", label: t("common.deActivate") },
              ]}
              value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
              onChange={(v) =>
                onStatusFilterChange(
                  v === "ALL" ? "ALL" : (Number(v) as Status),
                )
              }
              size="sm"
              fullWidth
              getValue={(i) => i.value}
              getLabel={(i) => i.label}
            />
          </div>

          <div className="w-full sm:w-[180px]">
            <SelectField
              isRequired={false}
              items={[
                { label: t("category.room"), value: "1" },
                { label: t("category.service"), value: "2" },
                { label: t("category.asset"), value: "3" },
              ]}
              value={typeFilter}
              onChange={(v) => onTypeFilterChange(String(v))}
              size="sm"
              fullWidth
              getValue={(i) => i.value}
              getLabel={(i) => i.label}
            />
          </div>
        </div>

        {/* RIGHT: Search + Button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center min-w-0">
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-full"
              value={search}
              placeholder={t("category.searchPlaceholder")}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Button asChild className="whitespace-nowrap w-full sm:w-auto">
            <a href="/Home/category/create">{t("category.new")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
