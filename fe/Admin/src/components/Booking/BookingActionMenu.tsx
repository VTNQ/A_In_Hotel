import { Edit, Eye } from "lucide-react";
import type { BookingActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";
import { useTranslation } from "react-i18next";

const BookingActionMenu: React.FC<BookingActionMenuProps> = ({
    booking,
    onView,
    onEdit,
    onCheckIn,
    onCheckOut,
    onSwitchRoom,
}) => {
    const statusCode = booking.status; // now numeric
    let actions: ActionItem[] = [];
    const { t } = useTranslation();
    let statusLabel = "";
    switch (statusCode) {
       
        case 1:
            statusLabel = t("booking.booked");
            actions = [
                { label: t("booking.viewBooking"), icon: <Eye size={16} />, onClick: () => onView?.(booking) },
                { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(booking) },
                { label: t("booking.checkIn"), icon: <Edit size={16} />, onClick: () => onCheckIn?.(booking) },

            ];
            break;

        case 2:
            statusLabel = t("booking.checkIn")
            actions = [
                { label: t("booking.viewBooking"), icon: <Eye size={16} />, onClick: () => onView?.(booking) },
                { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(booking) },
                { label: t("booking.switchRoom"), icon: <Edit size={16} />, onClick: () => onSwitchRoom?.(booking) },
                { label: t("booking.checkOut"), icon: <Edit size={16} />, onClick: () => onCheckOut?.(booking) },

            ];
            break;
        case 3:
            statusLabel = "Checked-out"
            actions = [
                { label:  t("booking.viewBooking"), icon: <Eye size={16} />, onClick: () => onView?.(booking) },
            ];
            break;
        case 4:
            statusLabel = "Cancelled"
            actions = [
                { label: t("booking.viewBooking"), icon: <Eye size={16} />, onClick: () => onView?.(booking) },

            ];
            break;

    }
    return <ActionMenu title={statusLabel} actions={actions} />;
}
export default BookingActionMenu;
