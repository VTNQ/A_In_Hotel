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
  const fetchCategories = async () => {
    try {
      const param = {
        all: true,
        filter: "type==3 and isActive==1",
      };
      const response = await getAllCategories(param);
      setCategories(response?.content || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchHotels = async () => {
    try {
      const param = {
        all: true,
        filter: "status==1",
      };
      const response = await getAllHotel(param);
      setHotels(response?.data?.content || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(()=>{
    fetchCategories();
    fetchHotels();
  },[])
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-3">
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
              v === "ALL" ? "ALL" : (Number(v) as AssetStatus),
            )
          }
          size="sm"
          fullWidth={false}
          getValue={(i) => i.value}
          getLabel={(i) => i.label}
        />
        <SelectField
          isRequired={false}
          items={categories}
          value={categoryFilter}
          onChange={(v) => onCategoryFilterChange(String(v))}
          size="sm"
          fullWidth={false}
          getValue={(i) => String(i.id)}
          getLabel={(i) => i.name}
        />
        <SelectField
          isRequired={false}
          items={hotels}
          value={hotelFilter}
          onChange={(v) => onHotelFilterChange(String(v))}
          size="sm"
          fullWidth={false}
          getValue={(i) => String(i.id)}
          getLabel={(i) => i.name}
        />
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <div className="relative w-72">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2" />
          <Input
            className="pl-9"
            value={search}
            placeholder={t("asset.searchPlaceholder")}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button asChild>
          <a href="/Home/asset/create">{t("asset.new")}</a>
        </Button>
      </div>
    </div>
  );
};
export default AssetFilter;
