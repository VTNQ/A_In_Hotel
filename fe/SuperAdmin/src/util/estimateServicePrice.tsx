import type { Booking } from "../type/booking.types";
import type { ExtraService } from "../type/extraService.types";


export const estimateServicePrice = (
  service: ExtraService,
  booking: Booking
): number => {
 const rooms = booking.rooms || [];
  const nights = booking.selectDate?.nights || 1;

  const roomsTotal = rooms.reduce(
    (sum: number, room: any) =>
      sum + (room.price || 0) * nights,
    0
  );

  const percent = service.extraCharge || 0;

  return (roomsTotal * percent) / 100;
  
};
