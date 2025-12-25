import { Edit, Eye } from "lucide-react";
import type { BookingActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";

const BookingActionMenu: React.FC<BookingActionMenuProps> = ({
    booking,
    onView,
    onEdit,
    onCheckIn,
    onCheckOut,
    onSwitchRoom,
    onRebook
}) => {
    const statusCode = booking.status; // now numeric
    let actions: ActionItem[] = [];
    let statusLabel = "";
    switch (statusCode) {
       
        case 1:
            statusLabel = "Booked";
            actions = [
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(booking) },
                { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(booking) },
                { label: "Check-in", icon: <Edit size={16} />, onClick: () => onCheckIn?.(booking) },

            ];
            break;

        case 2:
            statusLabel = "Checked-in"
            actions = [
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(booking) },
                { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(booking) },
                { label: "Swith Room", icon: <Edit size={16} />, onClick: () => onSwitchRoom?.(booking) },
                { label: "Check-out", icon: <Edit size={16} />, onClick: () => onCheckOut?.(booking) },

            ];
            break;
        case 3:
            statusLabel = "Checked-out"
            actions = [
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(booking) },
                { label: "Rebook", icon: <Edit size={16} />, onClick: () => onRebook?.(booking) },

            ];
            break;
        case 4:
            statusLabel = "Cancelled"
            actions = [
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(booking) },
                { label: "Rebook", icon: <Edit size={16} />, onClick: () => onRebook?.(booking) },

            ];
            break;

    }
    return <ActionMenu title={statusLabel} actions={actions} />;
}
export default BookingActionMenu;