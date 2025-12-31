const RoomCardSkeleton = () => {
  return (
    <div className="border rounded-xl p-4 animate-pulse space-y-3 bg-white">
      <div className="h-40 bg-gray-200 rounded-lg" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
};

export default RoomCardSkeleton;
