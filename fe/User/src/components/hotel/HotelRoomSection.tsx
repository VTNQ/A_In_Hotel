const rooms = [
    {
        id: 1,
        name: "STANDARD",
        image: "/images/rooms/standard.jpg",
        description:
            "Comfortable room with modern interior, suitable for business and leisure.",
        features: ["Double bed", "Netflix", "Mini bar", "Air conditioning"],
        price: "$145 / night",
    },
    {
        id: 2,
        name: "DELUXE",
        image: "/images/rooms/deluxe.jpg",
        description:
            "Spacious room with premium furniture and elegant lighting.",
        features: ["Double bed", "Netflix", "Mini bar", "Air conditioning"],
        price: "$185 / night",
    },
    {
        id: 3,
        name: "PREMIUM",
        image: "/images/rooms/premium.jpg",
        description:
            "Luxury room with city view, perfect for long stays.",
        features: ["King bed", "Netflix", "Mini bar", "Air conditioning"],
        price: "$225 / night",
    },
    {
        id: 4,
        name: "VIP",
        image: "/images/rooms/vip.jpg",
        description:
            "Exclusive room with premium design and private space.",
        features: ["King bed", "Netflix", "Mini bar", "Air conditioning"],
        price: "$295 / night",
    },
];
const HotelRoomSection = () => {
    return (
        <section className="bg-[#f7f4ef] py-20">
            <div className="mx-auto max-w-7xl space-y-20 px-6">
                {rooms.map((room, index) => {
                    const reverse = index % 2 !== 0;
                    return (
                        <div
                            key={room.id}
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
                        >
                            <div className={reverse ? "lg:order-2" : ""}>
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="w-full rounded-xl object-cover"
                                />
                            </div>
                            <div
                                className={`bg-white rounded-xl shadow-sm ${reverse ? "lg:order-1" : ""
                                    }`}
                            >
                                <h3 className="text-2xl font-serif text-[#3d2b1f] mb-3">
                                    {room.name}
                                </h3>

                                <p className="text-sm text-gray-600 mb-6">
                                    {room.description}
                                </p>
                                <ul className="grid grid-cols-2 gap-3 text-sm mb-6">
                                    {room.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#bfa383]" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{room.price}</span>
                                    <button className="rounded-md bg-[#bfa383] px-6 py-2 text-sm text-white hover:bg-[#a88b6a] transition">
                                        BOOK NOW
                                    </button>
                                </div>


                            </div>

                        </div>
                    )
                })}
            </div>
        </section>
    )
}  
export default HotelRoomSection;