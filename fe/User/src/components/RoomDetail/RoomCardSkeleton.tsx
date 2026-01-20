const RoomCardSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white animate-pulse">
      {/* IMAGE */}
      <div className="h-[180px] w-full bg-gray-200" />

      <div className="p-4 space-y-2">
        {/* TITLE */}
        <div className="h-4 w-1/2 bg-gray-200 rounded" />

        {/* INFO LINE */}
        <div className="h-3 w-3/4 bg-gray-200 rounded" />

        {/* DESCRIPTION */}
        <div className="space-y-1">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
        </div>

        {/* PRICE */}
        <div className="pt-2">
          <div className="h-4 w-1/3 bg-gray-200 rounded" />
          <div className="h-2 w-1/4 bg-gray-200 rounded mt-1" />
        </div>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;
