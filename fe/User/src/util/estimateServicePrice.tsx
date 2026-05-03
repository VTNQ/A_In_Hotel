

export const estimateServicePrice = (
  service: any,
  priceTotal:number
): number => {
  const roomsTotal = priceTotal;

  const percent = service.extraCharge || 0;

  return (roomsTotal * percent) / 100;
};
