import { Eye, Edit, Wrench, Power } from "lucide-react";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";
import { useTranslation } from "react-i18next";
import type { RoomActionMenuProps } from "../../type/room.types";

const RoomActionMenu: React.FC<RoomActionMenuProps> = ({
  room,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onMaintenance
}) => {
   const { t } = useTranslation();
  const statusCode = room.status; // now numeric
  let actions: ActionItem[] = [];
  let statusLabel = "";

  // Map status code → name
  switch (statusCode) {
    case 1:
      statusLabel = t("room.roomStatus.vacantDirty");
      actions = [
        { label: t("room.viewRoom"), icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: t("room.roomStatus.maintenance"), icon: <Wrench size={16} />, onClick: () => onMaintenance?.(room) },
      ];
      break;
    case 2:
      statusLabel = t("room.roomStatus.occupied");
      actions = [{ label: t("room.viewRoom"), icon: <Eye size={16} />, onClick: () => onView?.(room) }];
      break;
    case 3:
      statusLabel = t("room.roomStatus.available");
      actions = [
        { label: t("room.viewRoom"), icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: t("common.deActivate"), icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(room) },
        { label: t("room.roomStatus.maintenance"), icon: <Wrench size={16} />, onClick: () => onDeactivate?.(room) },
      ];
      break;
    case 4:
      statusLabel = t("room.roomStatus.maintenance");
      actions = [
        { label:  t("room.viewRoom"), icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label:  t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label:  t("common.deActivate"), icon: <Power size={16} />, onClick: () => onDeactivate?.(room) },
      ];
      break;
    case 5:
      statusLabel = t("room.roomStatus.blocked");
      actions = [
        { label: t("room.viewRoom"), icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: t("common.deActivate"), icon: <Power size={16} />, onClick: () => onDeactivate?.(room) },
      ];
      break;
    case 6:
      statusLabel = t("common.deActivate");
      actions = [
        { label: t("room.viewRoom"), icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: t("common.active"), icon: <Power size={16} />, onClick: () => onActivate?.(room) },
      ];
      break;
    default:
      statusLabel = "Unknown";
      actions = [{ label: t("room.viewRoom"), icon: <Eye size={16} />, onClick: () => onView?.(room) }];
  }

  return <ActionMenu title={statusLabel} actions={actions} />;
};

export default RoomActionMenu;
