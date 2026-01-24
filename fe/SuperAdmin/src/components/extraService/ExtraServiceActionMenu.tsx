import type { ActionItem } from "@/type/common";
import type { ExtraServiceActionMenuProps } from "@/type/extraService.types";
import { Edit, Eye, Power } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ui/ActionMenu";

const ExtraServiceActionMenu: React.FC<ExtraServiceActionMenuProps> = ({
  extraService,

  onEdit,
  onActivate,
  onDeactivate,
}) => {
  const { t } = useTranslation();
  const actions: ActionItem[] = extraService.isActive
    ? [
       
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(extraService),
        },
        {
          label: t("common.deActivate"),
          icon: <Power size={16} />,
          danger: true,
          onClick: () => onDeactivate?.(extraService),
        },
      ]
    : [
        
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(extraService),
        },
        {
          label: t("common.deActivate"),
          icon: <Power size={16} />,
          onClick: () => onActivate?.(extraService),
        },
      ];
  return (
    <ActionMenu
      title={
        extraService.isActive ? t("common.active") : t("common.deActivate")
      }
      actions={actions}
    />
  );
};
export default ExtraServiceActionMenu;
