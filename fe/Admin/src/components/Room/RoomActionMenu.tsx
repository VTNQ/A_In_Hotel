import { Eye, Edit, Wrench, Power } from "lucide-react";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";
import type { RoomActionMenuProps } from "../../type";

const RoomActionMenu: React.FC<RoomActionMenuProps> = ({
  room,
  onView,
  onEdit,
  onActivate,
  onDeactivate,
  onMaintenance
}) => {
  const statusCode = room.status; // now numeric
  let actions: ActionItem[] = [];
  let statusLabel = "";

  // Map status code → name
  switch (statusCode) {
    case 1:
      statusLabel = "Vacant - Dirty";
      actions = [
        { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: "Maintenance", icon: <Wrench size={16} />, onClick: () => onMaintenance?.(room) },
      ];
      break;
    case 2:
      statusLabel = "Occupied";
      actions = [{ label: "View", icon: <Eye size={16} />, onClick: () => onView?.(room) }];
      break;
    case 3:
      statusLabel = "Available";
      actions = [
        { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: "Deactivate", icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(room) },
        { label: "Maintenance", icon: <Wrench size={16} />, onClick: () => onDeactivate?.(room) },
      ];
      break;
    case 4:
      statusLabel = "Maintenance";
      actions = [
        { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: "Deactivate", icon: <Power size={16} />, onClick: () => onDeactivate?.(room) },
      ];
      break;
    case 5:
      statusLabel = "Blocked";
      actions = [
        { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: "Deactivate", icon: <Power size={16} />, onClick: () => onDeactivate?.(room) },
      ];
      break;
    case 6:
      statusLabel = "Deactivated";
      actions = [
        { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(room) },
        { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(room) },
        { label: "Activate", icon: <Power size={16} />, onClick: () => onActivate?.(room) },
      ];
      break;
    default:
      statusLabel = "Unknown";
      actions = [{ label: "View", icon: <Eye size={16} />, onClick: () => onView?.(room) }];
  }

  return <ActionMenu title={statusLabel} actions={actions} />;
};

export default RoomActionMenu;
