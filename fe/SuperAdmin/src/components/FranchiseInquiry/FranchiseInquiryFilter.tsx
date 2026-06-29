import type { franchiseInquiryFilterProps } from "@/type/franchiseInquiry.types";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";

const FranchiseInquiryFilter = ({
  search,
  onSearchChange,
}: franchiseInquiryFilterProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center min-w-0">
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-1 top-2 translate-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-full"
              value={search}
              placeholder={t("franchiseInquiry.searchPlaceholder")}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
         
        </div>
      </div>
    </div>
  );
};
export default FranchiseInquiryFilter;
