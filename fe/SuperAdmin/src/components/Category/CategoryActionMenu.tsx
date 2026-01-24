import type { CategoryActionMenuProps } from "@/type/category.types";
import { useTranslation } from "react-i18next";
import type { ActionItem } from "@/type/common";
import { Edit, Eye, Power } from "lucide-react";
import ActionMenu from "../ui/ActionMenu";
const CategoryActionMenu: React.FC<CategoryActionMenuProps> = ({
  category,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
}) => {
  const { t } = useTranslation();
  const actions: ActionItem[] = category.isActive
    ? [
        {
          label: t("category.viewCategory"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(category),
        },
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(category),
        },
        {
          label: t("common.deActivate"),
          icon: <Power size={16} />,
          danger: true,
          onClick: () => onDeactivate?.(category),
        },
      ]
    : [
        {
          label: t("common.view"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(category),
        },
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(category),
        },
        {
          label: t("common.deActivate"),
          icon: <Power size={16} />,
          onClick: () => onActivate?.(category),
        },
      ];
  return (
    <ActionMenu
      title={category.isActive ? t("common.active") : t("common.deActivate")}
      actions={actions}
    />
  );
};
export default CategoryActionMenu;