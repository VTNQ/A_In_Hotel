import { Edit, Eye, Power, Wrench } from "lucide-react";
import type { AssetActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";

const AssetActionMenu: React.FC<AssetActionMenuProps> = ({
    asset,
    onView,
    onEdit,
    onActivate,
    onDeactivate,
    onMaintenance
}) => {
    const statusCode = asset.status; // now numeric
    let actions: ActionItem[] = [];
    let statusLabel = "";
    switch (statusCode) {
        case 1:
            statusLabel = "Good";
            actions = [
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(asset) },
                { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(asset) },
                { label: "Deactivate", icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(asset) },
                { label: "Maintenance", icon: <Wrench size={16} />, onClick: () => onMaintenance?.(asset) },
            ];
            break;
        case 2:
            statusLabel = "Maintenance";
            actions = [
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(asset) },
                { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(asset) },
                { label: "Deactivate", icon: <Power size={16} />, onClick: () => onDeactivate?.(asset) },
            ];
            break;
        case 3:
            statusLabel = "Broken"
            actions = [
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(asset) },
                { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(asset) },
                { label: "Deactivate", icon: <Power size={16} />, onClick: () => onDeactivate?.(asset) },
                { label: "Activate", icon: <Power size={16} />, onClick: () => onActivate?.(asset) },
            ];
            break;
        case 4:
            statusLabel = "Deactivated";
            actions = [
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(asset) },
                { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(asset) },
                { label: "Activate", icon: <Power size={16} />, onClick: () => onActivate?.(asset) },
            ];
            break;
        default:
            statusLabel = "Unknown";
            actions = [{ label: "View", icon: <Eye size={16} />, onClick: () => onView?.(asset) }];
    }
    return <ActionMenu title={statusLabel} actions={actions} />;
}
export default AssetActionMenu;