import { Check } from "lucide-react";

const RoomAmenities = ({ amenities }: { amenities: any[] }) => {
  if (!amenities || amenities.length === 0) return null;
  return (
    <div
      className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-2
    text-sm text-gray-600"
    >
      {amenities.map((a) => (
        <div key={a.id} className="flex items-center gap-2 min-w-0">
          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />

          <span className="truncate">{a.serviceName}</span>
        </div>
      ))}
    </div>
  );
};

export default RoomAmenities;
