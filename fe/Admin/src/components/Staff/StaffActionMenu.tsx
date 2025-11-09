import { Power } from "lucide-react";
import type { StaffActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";

const StaffActionMenu: React.FC<StaffActionMenuProps> = ({
    staff,
    onActivate,
    onDeactivate,
}) => {
    const actions: ActionItem[] = staff.isActive
        ? [
            { label: "Deactivate", icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(staff) },
        ] :
        [
            { label: "Activate", icon: <Power size={16} />, onClick: () => onActivate?.(staff) },
        ]
    return (
        <ActionMenu
            title={staff.isActive ? "Active" : "Inactive"}
            actions={actions}
        />
    );
}
export default StaffActionMenu;