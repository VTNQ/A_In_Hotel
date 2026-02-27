import type { AssetFilterProps, AssetStatus } from "@/type/asset.types";
import { useTranslation } from "react-i18next";
import { SelectField } from "../ui/select";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { Category } from "@/type/category.types";
import { getAllCategories } from "@/service/api/Categories";
import { getAllHotel } from "@/service/api/Hotel";
import type { HotelRow } from "@/type/hotel.types";

const AssetFilter = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  hotelFilter,
  onHotelFilterChange,
}: AssetFilterProps) => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [hotels, setHotels] = useState<HotelRow[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchHotels();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories({
        all: true,
        filter: "type==3 and isActive==1",
      });
      setCategories(response?.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await getAllHotel({
        all: true,
        filter: "status==1",
      });
      setHotels(response?.data?.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 lg:flex lg:items-center lg:justify-between">
        {/* LEFT: filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:gap-3">
          {/* Status */}
          <div className="w-full lg:w-[180px]">
            <SelectField
              isRequired={false}
              items={[
                { value: "ALL", label: t("common.all") },
                { value: "1", label: t("asset.status.good") },
                { value: "2", label: t("asset.status.maintenance") },
                { value: "3", label: t("asset.status.broken") },
                { value: "4", label: t("asset.status.deactivated") },
              ]}
              value={statusFilter === "ALL" ? "ALL" : String(statusFilter)}
              onChange={(v) =>
                onStatusFilterChange(
                  v === "ALL" ? "ALL" : (Number(v) as AssetStatus)
                )
              }
              size="sm"
              fullWidth
              getValue={(i) => i.value}
              getLabel={(i) => i.label}
            />
          </div>

          {/* Category */}
          <div className="w-full lg:w-[220px]">
            <SelectField
              isRequired={false}
              items={categories}
              value={categoryFilter}
              onChange={(v) => onCategoryFilterChange(String(v))}
              size="sm"
              fullWidth
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
            />
          </div>

          {/* Hotel */}
          <div className="w-full lg:w-[220px]">
            <SelectField
              isRequired={false}
              items={hotels}
              value={hotelFilter}
              onChange={(v) => onHotelFilterChange(String(v))}
              size="sm"
              fullWidth
              getValue={(i) => String(i.id)}
              getLabel={(i) => i.name}
            />
          </div>
        </div>

        {/* RIGHT: search + button */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center lg:gap-3">
          <div className="relative w-full lg:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 w-full"
              value={search}
              placeholder={t("asset.searchPlaceholder")}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Button asChild className="w-full sm:w-auto whitespace-nowrap">
            <a href="/Home/asset/create">{t("asset.new")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetFilter;