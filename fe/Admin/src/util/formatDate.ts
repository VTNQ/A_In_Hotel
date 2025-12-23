export const formatBookingDateRange = (
  checkIn?: string,
  checkOut?: string,
  nights?: number
): string => {
  if (!checkIn || !checkOut) return "--";

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const checkInText = inDate.toLocaleDateString("en-US", options);
  const checkOutText = outDate.toLocaleDateString("en-US", options);

  return `${checkInText} – ${checkOutText} (${nights || 1} nights)`;
};
