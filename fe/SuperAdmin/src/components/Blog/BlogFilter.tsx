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
    <div className="flex items-center gap-2">
 
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
          fullWidth={false}
          getValue={(i) => i.value}
          getLabel={(i) => i.label}
        />
      
      <div className="relative w-72">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
        <Input
          className="pl-9"
          value={search}
          placeholder={t("blog.searchPlaceholder")}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
       <Button asChild>
        <a href="/Home/post/blog/create">{t("blog.new")}</a>
      </Button>
    </div>
  );
};
export default BlogFilter;