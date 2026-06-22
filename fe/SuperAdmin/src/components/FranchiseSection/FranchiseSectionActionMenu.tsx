import type { ActionItem } from "@/type/common";
import type { FranchiseSectionMenuProps } from "@/type/franchiseSection.types";
import { Edit, List, Power } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ui/ActionMenu";
import { useNavigate } from "react-router-dom";

const FranchiseSectionActionMenu: React.FC<FranchiseSectionMenuProps> = ({
  franchiseSection,
  onEdit,
  onActive,
  onDeactivate,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const actions: ActionItem[] = franchiseSection.active
    ? [
        {
          label: t("franchiseSection.actions.manageItems"),
          icon: <List size={16} />,
          onClick: () =>
            navigate(`/Home/franchise-section/${franchiseSection.id}/items`),
        },
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(franchiseSection),
        },
        {
          label: t("common.deActivate"),
          icon: <Power size={16} />,
          danger: true,
          onClick: () => onDeactivate?.(franchiseSection),
        },
      ]
    : [
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(franchiseSection),
        },
        {
          label: t("common.active"),
          icon: <Power size={16} />,
          onClick: () => onActive?.(franchiseSection),
        },
      ];
  return (
    <ActionMenu
      title={
        franchiseSection.active ? t("common.active") : t("common.deActivate")
      }
      actions={actions}
    />
  );
};
export default FranchiseSectionActionMenu;
