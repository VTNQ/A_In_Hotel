import { Edit, Power } from "lucide-react";
import type { ExtraServiceActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";
import { useTranslation } from "react-i18next";

const ExtraServiceActionMenu: React.FC<ExtraServiceActionMenuProps> = ({
    service,
    onEdit,
    onActivate,
    onDeactivate,
  }) => {
    const { t } = useTranslation();
    const actions: ActionItem[] = service.isActive
      ? [

          { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(service) },
          { label: t("common.deActivate"), icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(service) },
        ]
      : [

          { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(service) },
          { label: t("common.active"), icon: <Power size={16} />, onClick: () => onActivate?.(service) },
        ];
  
    return (
      <ActionMenu
        title={service.isActive ? t("common.active") : t("common.inactive")}
        actions={actions}
      />
    );
  };
  
  export default ExtraServiceActionMenu;