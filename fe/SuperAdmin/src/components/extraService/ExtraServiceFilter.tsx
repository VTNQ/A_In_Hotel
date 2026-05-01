import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { ExtraServiceFilterProps } from "@/type/extraService.types";
import { SelectField } from "../ui/select";
import type { Status } from "@/type/common";
import { useEffect, useState } from "react";
import type { Category } from "@/type/category.types";
import { getAllCategories } from "@/service/api/Categories";
import { getAllHotel } from "@/service/api/Hotel";

const ExtraServiceFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  hotelFilter,
  onHotelFilterChange,
}: ExtraServiceFilterProps) => {
  const [category, setCategory] = useState<Category[]>([]);
  const [hotel, setHotel] = useState<any[]>([]);
  const fetchHotels = async () => {
    try {
      const param = {
        all: true,
        filter: "status==1",
      };
      const response = await getAllHotel(param);
      setHotel(response?.data?.content || []);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const param = {
          all: true,
          filter: "type==2 and isActive==1",
        };
        const response = await getAllCategories(param);
        setCategory(response?.content || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    fetchHotels();
  }, []);
  const { t } = useTranslation();
  return (
    <div className="w-full min-w-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT: Filters */}
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

          <div className="w-full sm:w-[200px]">
            <SelectField
              isRequired={false}
              items={category}
              value={categoryFilter}
              onChange={(v) => onCategoryFilterChange(String(v))}
              size="sm"
              fullWidth
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
            />
          </div>

          <div className="w-full sm:w-[240px]">
            <SelectField
              isRequired={false}
              items={hotel}
              value={hotelFilter}
              onChange={(v) => onHotelFilterChange(String(v))}
              size="sm"
              fullWidth
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
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
              placeholder={t("extraService.searchPlaceholder")}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Button asChild className="whitespace-nowrap w-full sm:w-auto">
            <a href="/Home/service/create">{t("extraService.new")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ExtraServiceFilter;
