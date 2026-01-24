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
        <div className="flex items-center gap-2">
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
                fullWidth={false}
                getValue={(i) => i.value}
                getLabel={(i) => i.label}
            />
            <div className="relative w-72">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
                <Input
                    className="pl-9"
                    value={search}
                    placeholder={t("common.search")}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <Button asChild>
                <a href="/Home/facility/create"> + {t("facility.create.title")}</a>
            </Button>
        </div>
    )
}
export default FacilityFiler;