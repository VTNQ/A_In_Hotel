import { Edit } from "lucide-react";
import type { BannerActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";

const BannerActionMenu: React.FC<BannerActionMenuProps> = ({
    banner,
    onEdit,

}) => {
    const actions: ActionItem[] =
        [
            { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(banner) }
        ]
    return (
        <ActionMenu
            actions={actions}
        />
    );
}
export default BannerActionMenu;