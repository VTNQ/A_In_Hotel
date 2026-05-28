import { Check } from "lucide-react";

const RoomAmenities = ({ amenities }: { amenities: any[] }) => {
  return (
    <div
      className="
        mt-3 grid grid-cols-2 gap-y-2
        text-sm text-gray-600
        dark:text-neutral-300
      "
    >
      {amenities.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />

          <span className="truncate">
            {a.serviceName}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RoomAmenities;