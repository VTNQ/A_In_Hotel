const ServiceBookingSkeleton = () => {
  return (
    <div className="bg-white border rounded-xl overflow-hidden flex animate-pulse">
      <div className="w-1/3 h-48 bg-gray-200" />
      <div className="p-6 flex-1 space-y-3">
        <div className="h-4 bg-gray-200 w-1/2 rounded" />
        <div className="h-3 bg-gray-200 w-full rounded" />
        <div className="h-3 bg-gray-200 w-2/3 rounded" />
        <div className="h-8 bg-gray-200 w-32 rounded mt-4" />
      </div>
    </div>
  );
};
export default ServiceBookingSkeleton;
