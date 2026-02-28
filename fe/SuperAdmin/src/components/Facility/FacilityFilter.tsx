import type { FacilityFilterProps } from "@/type/facility.types";
import { SelectField } from "../ui/select";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { FacilityStatus } from "@/setting/constant/Facility.constant";
import { useTranslation } from "react-i18next";

const FacilityFiler = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: FacilityFilterProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:justify-start">
        {/* STATUS */}
        <div className="w-full sm:col-span-1 lg:w-[180px]">
          <SelectField
            isRequired={false}
            items={[
              { value: "ALL", label: t("common.all") },
              { value: "true", label: t("status.active") },
              { value: "false", label: t("status.inactive") },
            ]}
            value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
            onChange={(v) =>
              onStatusFilterChange(
                v === "ALL" ? "ALL" : (v as FacilityStatus)
              )
            }
            size="sm"
            fullWidth
            getValue={(i) => i.value}
            getLabel={(i) => i.label}
          />
        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:col-span-1 lg:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9 w-full"
            value={search}
            placeholder={t("common.search")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <div className="sm:col-span-2 lg:col-span-1 lg:ml-2">
          <Button asChild className="w-full sm:w-auto h-10 whitespace-nowrap">
            <a href="/Home/facility/create">
              + {t("facility.create.title")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FacilityFiler;