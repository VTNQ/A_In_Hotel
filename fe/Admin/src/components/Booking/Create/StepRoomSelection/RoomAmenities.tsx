import { Check } from "lucide-react";

const RoomAmenities = ({ amenities }: { amenities: any[] }) => {
  return (
    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mt-3">
      {amenities.map((a) => (
        <div key={a.id} className="flex items-center gap-2">
          <Check className="w-4 h-4 text-blue-600" />
          <span>{a.serviceName}</span>
        </div>
      ))}
    </div>
  );
};

export default RoomAmenities;
