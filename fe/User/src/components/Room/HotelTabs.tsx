const HOTELS = [
    "A IN HOTEL RIVERSIDE",
    "A IN HOTEL ATISTA",
    "A IN HOTEL DEL LUNA",
    "A IN HOTEL GLAMOURS",
];
const HotelTabs = () => {
    return (
        <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-6 flex gap-6 text-sm font-medium">
                {HOTELS.map((h, i) => (
                    <button
                        key={i}
                        className={`py-4 border-b-2 ${i === 2
                                ? "border-[#b38a58] text-[#b38a58]"
                                : "border-transparent text-gray-500 hover:text-gray-800"
                            }`}
                    >
                        {h}
                    </button>
                ))}
            </div>
        </div>
    )
}  
export default HotelTabs;