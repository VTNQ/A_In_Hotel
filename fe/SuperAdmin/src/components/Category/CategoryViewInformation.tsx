import type { ViewCategoryProps } from "@/type/category.types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getCategoryById } from "@/service/api/Categories";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const CategoryViewInformation: React.FC<ViewCategoryProps> = ({
  isOpen,
  onClose,
  categoryId,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !categoryId) return;

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await getCategoryById(categoryId);
        setCategory(res?.data?.data ?? null);
      } catch (err) {
        console.error("Failed to fetch category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [isOpen, categoryId]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("category.view.title")}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <>
            {/* CONTENT */}
            <div className="mt-4 space-y-3 rounded-lg border bg-gray-50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {t("category.name")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {category?.name || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {t("category.type")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {category?.type || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {t("category.capacity")}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {category?.capacity ?? "-"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {t("common.status")}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                    category?.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {category?.isActive
                    ? t("common.active")
                    : t("common.deActivate")}
                </span>
              </div>
            </div>

            {/* FOOTER */}
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                {t("common.close")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryViewInformation;
