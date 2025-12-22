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
      label: "",
    };
  }

  switch (packageType) {
    case "2": // Overnight
      return {
        price: room.overnightPrice ?? 0,
        label: "/ night",
      };

    case "1": { // Day Use
      const extraHours = Math.max(0, hours - 2);
      const total =
        Number(room.hourlyBasePrice ?? 0) +
        extraHours * Number(room.hourlyAdditionalPrice ?? 0);

      return {
        price: total,
        label: `/ ${hours} hours`,
      };
    }

    case "3": // Full Day
      return {
        price: room.defaultRate ?? 0,
        label: "/ day",
      };

    default:
      return {
        price: 0,
        label: "",
      };
  }
};

export default calculateRoomPrice;