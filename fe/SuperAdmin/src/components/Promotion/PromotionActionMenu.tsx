import type { ActionItem } from "@/type/common";
import type { PromotionActionMenuProps } from "@/type/Promotion.types";
import { Edit, Eye, Power } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ui/ActionMenu";

const PromotionActionMenu: React.FC<PromotionActionMenuProps> = ({
  promotion,
  onView,
  onEdit,
  onDiabled,
}) => {
  const { t } = useTranslation();
  const actions: ActionItem[] = promotion.isActive
    ? [
        {
          label: t("common.view"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(promotion),
        },
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(promotion),
        },
        {
          label: t("promotion.disable"),
          icon: <Power size={16} />,
          danger: true,
          onClick: () => onDiabled?.(promotion),
        },
      ]
    : [
        {
          label: t("common.view"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(promotion),
        },
      ];
  return (
    <ActionMenu
      title={
        promotion.isActive ? t("promotion.enable") : t("promotion.disable")
      }
      actions={actions}
    />
  );
};
export default PromotionActionMenu;