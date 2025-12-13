const FilterBar = () => {
    return (
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="text-sm text-gray-600">
                Showing <b>4</b> results for:
                <span className="ml-2 px-3 py-1 bg-[#F1E6D8] rounded-full text-xs">
                    Ocean View
                </span>
                <span className="ml-2 px-3 py-1 bg-[#F1E6D8] rounded-full text-xs">
                    2 Guests
                </span>
                <button className="ml-2 text-xs underline text-gray-500">
                    Clear
                </button>
            </div>

            <div className="flex gap-3">
                <button className="px-4 py-2 border rounded-lg text-sm bg-white">
                    Filters
                </button>
                <select className="px-4 py-2 border rounded-lg text-sm bg-white">
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                </select>
            </div>
        </div>
    )
}
export default FilterBar;