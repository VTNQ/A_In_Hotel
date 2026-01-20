const RoomGallerySkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 max-w-7xl mx-auto animate-pulse">
    <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded-xl" />
    <div className="flex flex-col gap-4 h-[400px]">
      <div className="flex-1 bg-gray-200 rounded-xl" />
      <div className="flex-1 bg-gray-200 rounded-xl" />
    </div>
  </div>
)
export default RoomGallerySkeleton
