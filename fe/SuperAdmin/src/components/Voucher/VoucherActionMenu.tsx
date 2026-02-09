import type { ActionItem } from "@/type/common";
import type { VoucherActionMenuProps } from "@/type/voucher.types";
import { Edit, Eye, Power } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ui/ActionMenu";

const VoucherActionMenu :React.FC<VoucherActionMenuProps> =({
    voucher,
    onView,
    onEdit,
    onDiabled,

})=>{
     const { t } = useTranslation();
  const actions: ActionItem[] = voucher.isActive
    ? [
        {
          label: t("common.view"),
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
          label: t("common.view"),
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
}
export default VoucherActionMenu;