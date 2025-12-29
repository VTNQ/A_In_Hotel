import type { PaginationProp } from "../../type/common";

const RoomPagination = ({ page, totalPages, onChange }: PaginationProp) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center mt-10 gap-2">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-8 h-8 border rounded disabled:opacity-40"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded ${p === page
                ? "bg-[#b38a58] text-white"
                : "border"
              }`}
          >
            {p}
          </button>
        );
      })}
       <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="w-8 h-8 border rounded disabled:opacity-40"
      >
        ›
      </button>
    </div>
  )
}
export default RoomPagination;