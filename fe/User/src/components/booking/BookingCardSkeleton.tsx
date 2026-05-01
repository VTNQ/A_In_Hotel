const BookingCardSkeleton = () => {
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden bg-white dark:bg-slate-800/40">
      {/* header */}
      <div className="flex justify-between px-6 py-4 bg-primary/5 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-4 w-full">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
        <div className="text-right min-w-[140px]">
          <div className="h-3 w-20 ml-auto rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-2" />
          <div className="h-6 w-28 ml-auto rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        </div>
      </div>

      {/* body */}
      <div className="p-6 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-2 gap-y-6 gap-x-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="flex-1">
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-2" />
                <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#f7f7f6] dark:bg-slate-900/50 rounded-lg p-4 border dark:border-white/10">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-4" />
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 mb-3">
              <div className="size-9 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse mb-2" />
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="px-6 py-4 border-t dark:border-white/10 flex justify-end gap-3">
        <div className="h-10 w-28 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="h-10 w-28 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    </div>
  );
};
export default BookingCardSkeleton;