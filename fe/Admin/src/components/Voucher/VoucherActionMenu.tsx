import { useTranslation } from "react-i18next";
import type { VoucherActionMenuProps } from "../../type/voucher.types";
import type { ActionItem } from "../ui/ActionMenu";
import { Edit, Eye, Power } from "lucide-react";
import ActionMenu from "../ui/ActionMenu";

const VoucherActionMenu: React.FC<VoucherActionMenuProps> = ({
  voucher,
  onView,
  onEdit,
  onDiabled,
}) => {
  const { t } = useTranslation();
  const actions: ActionItem[] = voucher.isActive
    ? [
        {
          label: t("voucher.view"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(voucher),
        },
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(voucher),
        },
        {
          label: t("voucher.disable"),
          icon: <Power size={16} />,
          danger: true,
          onClick: () => onDiabled?.(voucher),
        },
      ]
    : [
        {
          label: t("voucher.view"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(voucher),
        },
      ];
  return (
    <ActionMenu
      title={voucher.isActive ? t("voucher.enable") : t("voucher.disable")}
      actions={actions}
    />
  );
};
export default VoucherActionMenu;