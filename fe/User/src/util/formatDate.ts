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

export const formatTime = (time: string) => time?.slice(0, 5);

export const calculateNights = (checkIn: string, checkOut: string) => {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = outDate.getTime() - inDate.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
