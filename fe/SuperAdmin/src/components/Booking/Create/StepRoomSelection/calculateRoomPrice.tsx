const calculateRoomPrice = ({
  packageType,
  room,
  hours = 2,
}: {
  packageType?: string;
  room?: any;
  hours?: number;
}) => {
  if (!room || !packageType) {
    return {
      price: 0,
      rawPrice: 0,
      label: "",
    };
  }

  switch (packageType) {
    case "2": // Overnight
      return {
        price: Number(room.overnightPrice ?? 0),
        rawPrice: Number(room.overnightPrice ?? 0),
        label: "/ night",
      };

    case "1": {
      // Day Use
      const base = Number(room.hourlyBasePrice ?? 0);
      const extraHours = Math.max(0, hours - 2);

      const extra = extraHours * Number(room.hourlyAdditionalPrice ?? 0);

      const total = base + extra;

      return {
        price: total,
        rawPrice: total,
        label: `/ ${hours} hours`,
      };
    }

    case "3": // Full Day
      return {
        price: Number(room.defaultRate ?? 0),
        rawPrice: Number(room.defaultRate ?? 0),
        label: "/ day",
      };

    default:
      return {
        price: 0,
        rawPrice: 0,
        label: "",
      };
  }
};

export default calculateRoomPrice;
