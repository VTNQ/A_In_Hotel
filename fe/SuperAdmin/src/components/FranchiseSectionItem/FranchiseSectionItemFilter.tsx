import type { FranchiseSectionItemFilterProps } from "@/type/franchiseSectionItem.types";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const FranchiseSectionItemFilter = ({
  search,
  onSearchChange,
  SectionId,
}: FranchiseSectionItemFilterProps) => {
  const {t} = useTranslation();
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center min-w-0">
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-full"
              value={search}
              placeholder={t("franchiseSectionItem.placeholder.search")}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button asChild className="whitespace-nowrap w-full sm:w-auto">
            <a href={`/Home/franchise-section/${SectionId}/items/create`}>
             + {t("franchiseSectionItem.button.create")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default FranchiseSectionItemFilter;
