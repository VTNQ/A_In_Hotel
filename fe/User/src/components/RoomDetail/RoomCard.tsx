const RoomCard = ({
    title,
    price,
    size = "20 m²",
    bed = "Double bed",
    guests = "2 guests",
    description = "Modern room with full amenities, suitable for short stays."
}: any) => {
 return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <img
        src="https://picsum.photos/300/180"
        alt={title}
        className="h-[180px] w-full object-cover"
      />

      <div className="p-4 space-y-1">
        <h5 className="font-semibold text-sm uppercase">{title}</h5>

        <div className="text-xs text-gray-500 flex gap-2">
          <span>{size}</span>
          <span>·</span>
          <span>{bed}</span>
          <span>·</span>
          <span>{guests}</span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2">
          {description}
        </p>

        <div className="pt-2">
          <p className="text-sm font-semibold text-[#b38a58]">
            {price} VND / night
          </p>
          <p className="text-[10px] text-gray-400">
            Price includes VAT
          </p>
        </div>
      </div>
    </div>
  );
}
export default RoomCard;