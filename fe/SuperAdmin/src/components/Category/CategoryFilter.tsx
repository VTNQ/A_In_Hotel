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
    <div className="flex items-center gap-2">
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
        fullWidth={false}
        getValue={(i) => i.value}
        getLabel={(i) => i.label}
      />
      <SelectField
        isRequired={false}
        items={[
          {
            label: t("category.room"),
            value: "1",
          },
          {
            label: t("category.service"),
            value: "2",
          },
          {
            label: t("category.asset"),
            value: "3",
          },
        ]}
        value={typeFilter}
        onChange={(v) => onTypeFilterChange(String(v))}
        size="sm"
        fullWidth={false}
        getValue={(i) => i.value}
        getLabel={(i) => i.label}
      />
      <div className="relative w-72">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
        <Input
          className="pl-9"
          value={search}
          placeholder={t("category.searchPlaceholder")}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button asChild>
        <a href="/Home/category/create">{t("category.new")}</a>
      </Button>
    </div>
  );
};
