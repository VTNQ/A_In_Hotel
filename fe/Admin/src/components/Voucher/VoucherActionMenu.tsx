import { useTranslation } from "react-i18next";
import type { VoucherActionMenuProps } from "../../type/voucher.types";
import type { ActionItem } from "../ui/ActionMenu";
import { Edit, Power } from "lucide-react";
import ActionMenu from "../ui/ActionMenu";

const VoucherActionMenu: React.FC<VoucherActionMenuProps> = ({
  voucher,
  onEdit,
  onActivate,
  onDeactivate,
}) => {
  const { t } = useTranslation();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = voucher.endDate ? new Date(voucher.endDate) : null;

  const isExpired = endDate && endDate < today;
  let statusLabel = "";
  let actions: ActionItem[] = [];

  if (isExpired) {
    statusLabel = t("voucher.expired");
    actions = [
      {
        label: t("common.edit"),
        icon: <Edit size={16} />,
        onClick: () => onEdit?.(voucher),
      },
    ];
  } else {
    if (voucher.status === 1) {
      status;
      statusLabel = t("common.active");
      actions = [
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(voucher),
        },
        {
          label: t("common.deActivate"),
          icon: <Power size={16} />,
          danger: true,
          onClick: () => onDeactivate?.(voucher),
        },
      ];
    } else if (voucher.status === 2) {
      statusLabel = t("common.deActivate");
      actions = [
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(voucher),
        },
        {
          label: t("common.active"),
          icon: <Power size={16} />,
          onClick: () => onActivate?.(voucher),
        },
      ];
    } else {
      actions = [
        {
          label: t("common.edit"),
          icon: <Edit size={16} />,
          onClick: () => onEdit?.(voucher),
        },
      ];
    }
  }
  return <ActionMenu title={statusLabel} actions={actions} />;
};
export default VoucherActionMenu;