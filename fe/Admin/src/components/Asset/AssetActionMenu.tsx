import { Edit, Eye, Power, Wrench } from "lucide-react";
import type { AssetActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";
import { useTranslation } from "react-i18next";

const AssetActionMenu: React.FC<AssetActionMenuProps> = ({
    asset,
    onView,
    onEdit,
    onActivate,
    onDeactivate,
    onMaintenance
}) => {
    const {t} = useTranslation();
    const statusCode = asset.status; // now numeric
    let actions: ActionItem[] = [];
    let statusLabel = "";
    switch (statusCode) {
        case 1:
            statusLabel = t("asset.status.good");
            actions = [
                { label: t("common.view"), icon: <Eye size={16} />, onClick: () => onView?.(asset) },
                { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(asset) },
                { label: t("common.deActivate"), icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(asset) },
                { label: t("asset.action.maintenance"), icon: <Wrench size={16} />, onClick: () => onMaintenance?.(asset) },
            ];
            break;
        case 2:
            statusLabel = t("asset.status.maintenance");
            actions = [
                { label: t("common.view"), icon: <Eye size={16} />, onClick: () => onView?.(asset) },
                { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(asset) },
                { label:t("common.deActivate"), icon: <Power size={16} />, onClick: () => onDeactivate?.(asset) },
            ];
            break;
        case 3:
            statusLabel = t("asset.status.broken")
            actions = [
                { label: t("common.view"), icon: <Eye size={16} />, onClick: () => onView?.(asset) },
                { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(asset) },
                { label: t("common.deActivate"), icon: <Power size={16} />, onClick: () => onDeactivate?.(asset) },
                { label: t("asset.action.active"), icon: <Power size={16} />, onClick: () => onActivate?.(asset) },
            ];
            break;
        case 4:
            statusLabel = t("asset.status.deactivated");
            actions = [
                { label: t("common.view"), icon: <Eye size={16} />, onClick: () => onView?.(asset) },
                { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(asset) },
                { label: t("asset.action.active"), icon: <Power size={16} />, onClick: () => onActivate?.(asset) },
            ];
            break;
        default:
            statusLabel = "Unknown";
            actions = [{ label: t("common.view"), icon: <Eye size={16} />, onClick: () => onView?.(asset) }];
    }
    return <ActionMenu title={statusLabel} actions={actions} />;
}
export default AssetActionMenu;