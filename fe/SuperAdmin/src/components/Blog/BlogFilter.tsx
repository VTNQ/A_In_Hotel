import type { BlogFilterProps, BlogStatus } from "@/type/blog.types";
import { useTranslation } from "react-i18next";
import { SelectField } from "../ui/select";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const BlogFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: BlogFilterProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT: Status */}
        <div className="w-full sm:w-[180px]">
          <SelectField
            isRequired={false}
            placeholder={t("common.enterStatus")}
            items={[
              { value: "ALL", label: t("common.all") },
              { value: "1", label: t("blog.draft") },
              { value: "2", label: t("blog.published") },
              { value: "3", label: t("blog.archived") },
            ]}
            value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
            onChange={(v) =>
              onStatusFilterChange(
                v === "ALL" ? "ALL" : (Number(v) as BlogStatus),
              )
            }
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
              placeholder={t("blog.searchPlaceholder")}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Button asChild className="whitespace-nowrap w-full sm:w-auto">
            <a href="/Home/post/blog/create">{t("blog.new")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default BlogFilter;
