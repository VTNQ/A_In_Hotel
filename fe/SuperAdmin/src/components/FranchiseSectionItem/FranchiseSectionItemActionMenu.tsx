import type { ActionItem } from "@/type/common";
import type { FranchiseSectionItemMenuProps } from "@/type/franchiseSectionItem.types";
import { Edit, Power } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ui/ActionMenu";

const FranchiseSectionItemActionMenu: React.FC<
  FranchiseSectionItemMenuProps
> = ({ franchiseSectionItem, onEdit, onActive, onDeActive }) => {
  const { t } = useTranslation();
  const actions: ActionItem[] = franchiseSectionItem.active
    ? [
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(franchiseSectionItem),
        },
        {
          label: t("common.deActivate"),
          icon: <Power size={16} />,
          danger: true,
          onClick: () => onDeActive?.(franchiseSectionItem),
        },
      ]
    : [
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(franchiseSectionItem),
        },
        {
          label: t("common.active"),
          icon: <Power size={16} />,
          onClick: () => onActive?.(franchiseSectionItem),
        },
      ];
  return (
    <ActionMenu
      title={
        franchiseSectionItem.active
          ? t("common.active")
          : t("common.deActivate")
      }
      actions={actions}
    />
  );
};
export default FranchiseSectionItemActionMenu;
