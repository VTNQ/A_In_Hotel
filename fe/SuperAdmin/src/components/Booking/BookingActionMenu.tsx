import type { BookingActionMenuProps } from "@/type/booking.types";
import type { ActionItem } from "@/type/common";
import { CircleX, Edit, Eye, ScanBarcode, TicketsPlane } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ui/ActionMenu";

const BookingActionMenu: React.FC<BookingActionMenuProps> = ({
  booking,
  onView,
  onCheckIn,
  onCheckOut,
  onCancel,
  onSwitchRoom,
}) => {
  const statusCode = booking.status;
  let actions: ActionItem[] = [];
  const { t } = useTranslation();
  let statusLabel = "";
  switch (statusCode) {
    case 1:
      statusLabel = t("booking.booked");
      actions = [
        {
          label: t("booking.viewBooking"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(booking),
        },
        {
          label: t("booking.cancel"),
          icon: <CircleX size={16} />,
          onClick: () => onCancel?.(booking),
        },
        {
          label: t("booking.checkIn"),
          icon: <TicketsPlane size={16} />,
          onClick: () => onCheckIn?.(booking),
        },
      ];
      break;

    case 2:
      statusLabel = t("booking.checkIn");
      actions = [
        {
          label: t("booking.viewBooking"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(booking),
        },
        {
          label: t("booking.switchRoom"),
          icon: <Edit size={16} />,
          onClick: () => onSwitchRoom?.(booking),
        },
        {
          label: t("booking.checkOut"),
          icon: <ScanBarcode size={16} />,
          onClick: () => onCheckOut?.(booking),
        },
      ];
      break;
    case 3:
      statusLabel = t("booking.checkOut");
      actions = [
        {
          label: t("booking.viewBooking"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(booking),
        },
      ];
      break;
    case 4:
      statusLabel = t("booking.cancelled");
      actions = [
        {
          label: t("booking.viewBooking"),
          icon: <Eye size={16} />,
          onClick: () => onView?.(booking),
        },
      ];
      break;
  }
  return <ActionMenu title={statusLabel} actions={actions} />;
};
export default BookingActionMenu;
