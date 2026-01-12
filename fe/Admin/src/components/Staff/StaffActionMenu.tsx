import { Power } from "lucide-react";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";
import { useTranslation } from "react-i18next";
import type { StaffActionMenuProps } from "../../type/staff.types";

const StaffActionMenu: React.FC<StaffActionMenuProps> = ({
    staff,
    onActivate,
    onDeactivate,
}) => {
    const { t } = useTranslation();
    const actions: ActionItem[] = staff.isActive
        ? [
            { label: t("common.deActivate"), icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(staff) },
        ] :
        [
            { label: t("common.active"), icon: <Power size={16} />, onClick: () => onActivate?.(staff) },
        ]
    return (
        <ActionMenu
            title={staff.isActive ? t("common.active") : t("common.inactive")}
            actions={actions}
        />
    );
}
export default StaffActionMenu;