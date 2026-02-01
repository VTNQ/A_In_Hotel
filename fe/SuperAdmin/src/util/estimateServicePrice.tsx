import type { Booking } from "../type/booking.types";
import type { ExtraService } from "../type/extraService.types";


export const estimateServicePrice = (
  service: ExtraService,
  booking: Booking
): number => {
  if (!service || !service.price) return 0;

  const nights = booking.selectDate?.nights ?? 1;

  // nếu FE chưa có days thì suy ra từ nights
  const days =
    booking.selectDate?.days ??
    (nights > 0 ? nights + 1 : 1);

  switch (service.unit) {
    case "PERNIGHT":
      return service.price * nights;

    case "PERDAY":
      return service.price * days;

    case "PERUSE":
      return service.price;

    case "PERTRIP":
      return service.price;

    default:
      return service.price;
  }
};
