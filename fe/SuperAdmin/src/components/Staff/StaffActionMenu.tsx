import type { ActionItem } from "@/type/common";
import type { StaffActionMenuProps } from "@/type/Staff.type";
import { Power } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ui/ActionMenu";

const StaffActionMenu: React.FC<StaffActionMenuProps> = ({
  staff,
  onActive,
  onInActive,
}) => {
  const { t } = useTranslation();
  const actions: ActionItem[] = staff.isActive
    ? [
        {
          label: t("staff.inactive"),
          danger: true,
          icon: <Power size={16} />,
          onClick: () => onInActive?.(staff),
        },
      ]
    : [
        {
          label: t("staff.active"),
          icon: <Power size={16} />,
          
          onClick: () => onActive?.(staff),
        },
      ];
  return (
    <ActionMenu
      title={staff.isActive ? t("staff.active") : t("staff.inactive")}
      actions={actions}
    />
  );
};
export default StaffActionMenu;
