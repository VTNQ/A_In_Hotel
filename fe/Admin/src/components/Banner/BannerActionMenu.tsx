import { Edit } from "lucide-react";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";
import { useTranslation } from "react-i18next";
import type { BannerActionMenuProps } from "../../type/banner.types";

const BannerActionMenu: React.FC<BannerActionMenuProps> = ({
    banner,
    onEdit,

}) => {
    const {t} = useTranslation();
    const actions: ActionItem[] =
        [
            { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(banner) }
        ]
    return (
        <ActionMenu
            actions={actions}
        />
    );
}
export default BannerActionMenu;