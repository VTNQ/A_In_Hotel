import type { FacilityFilterProps } from "@/type/facility.types";
import { SelectField } from "../ui/select";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { FacilityStatus } from "@/setting/constant/Facility.constant";

const FacilityFiler = ({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
}: FacilityFilterProps) => {
    return (
        <div className="flex items-center gap-2">
            <SelectField
                items={[
                    { value: "ALL", label: "Tất cả" },
                    { value: "true", label: "Hoạt động" },
                    { value: "false", label: "Không hoạt động" },
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
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <Button asChild>
                <a href="/Home/hotel/create">+ Thêm tiện ích</a>
            </Button>
        </div>
    )
}
export default FacilityFiler;