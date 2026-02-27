const BookingDetailSkeleton = ()=>{
     return (
    <div className="min-h-screen bg-[#f7f7f6] px-6 py-10 lg:px-20 animate-pulse">
      <div className="max-w-7xl mx-auto py-12">
        {/* HEADER */}
        <div className="mb-10 flex justify-between items-center">
          <div>
            <div className="h-8 w-64 bg-slate-200 rounded mb-4" />
            <div className="h-4 w-80 bg-slate-200 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-40 bg-slate-200 rounded-lg" />
            <div className="h-10 w-40 bg-slate-200 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stay Info */}
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="flex">
                <div className="h-48 w-64 bg-slate-200" />
                <div className="p-6 flex-1 space-y-4">
                  <div className="h-6 w-48 bg-slate-200 rounded" />
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200 rounded" />
                        <div className="h-4 w-32 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Room table */}
            <div className="rounded-xl border bg-white shadow-sm p-6 space-y-4">
              <div className="h-6 w-40 bg-slate-200 rounded" />
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-40 bg-slate-200 rounded" />
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                </div>
              ))}
            </div>

            {/* Guest info */}
            <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
              <div className="h-6 w-40 bg-slate-200 rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="size-8 bg-slate-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-slate-200 rounded" />
                    <div className="h-4 w-40 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-xl border bg-white p-8 shadow-sm space-y-6">
            <div className="h-6 w-40 bg-slate-200 rounded" />
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </div>
            ))}
            <div className="h-10 w-full bg-slate-200 rounded-lg mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookingDetailSkeleton;