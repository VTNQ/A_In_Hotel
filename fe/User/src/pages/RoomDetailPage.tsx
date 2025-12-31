import { Baby, Bath, BedDouble, Calendar, Coffee, Minus, Plus, Tv, User, Wind } from "lucide-react";
import RoomCard from "../components/RoomDetail/RoomCard";
const RoomDetailPage = () => {
    const room = {
        name: "MINI ROOM",
        address: "Vo Nguyen Giap Street, Ngu Hanh Son, Da Nang",
        area: 20,
        defaultRate: 70000,
        images: [
            { url: "https://picsum.photos/800/500?1" },
            { url: "https://picsum.photos/800/500?2" },
            { url: "https://picsum.photos/800/500?3" }
        ],
        amenities: [
            "Air conditioning",
            "Smart TV with Netflix",
            "MiniBar",
            "Fee Wifi",
            "Wardrobe",
            "Work desk",
            "Private bathroom",
            "Hair dryer"
        ]
    }

 

    return (

        <>
            <div className="" style={{
                backgroundImage: "url('/image/724ed79d34d3b1706617f9c2e66ea6c1fffec304.png')",
            }}>
                <section className="relative left-1/2 -ml-[50vw] w-full overflow-hidden pt-[90px]">
                    <div className="w-screen">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 max-w-7xl mx-auto">

                            {/* BIG IMAGE */}
                            <div className="lg:col-span-2 h-[400px] rounded-xl overflow-hidden">
                                <img
                                    src={room.images[0]?.url}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* SMALL IMAGES */}
                            <div className="flex flex-col gap-4 h-[400px]">
                                {room.images.slice(1, 3).map((img, i) => (
                                    <div key={i} className="flex-1 rounded-xl overflow-hidden">
                                        <img
                                            src={img.url}
                                            className="w-full h-full object-cover hover:scale-105 transition"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ===== TABS ===== */}
                        <div className="max-w-7xl mx-auto px-4 mt-6">
                            <div className="flex gap-8 border-b text-sm">
                                <button className="pb-3 border-b-2 border-black font-medium">
                                    Overview
                                </button>
                                <button className="pb-3 text-gray-500 hover:text-black">
                                    Amenities
                                </button>
                                <button className="pb-3 text-gray-500 hover:text-black">
                                    Rooms
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 pt-[30px] pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* ===== HEADER ===== */}
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    MINI ROOM <span className="text-base  text-gray-500 font-semibold">(Standard, smart TV 49’)</span>
                                </h1>

                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                    <span>📍</span>
                                    126 Đường Đề Thám, Phường Cầu Ông Lãnh, Tp. Hồ Chí Minh
                                </p>
                            </div>

                            {/* ===== OVERVIEW ===== */}
                            <div className="space-y-3">
                                <h4 className="font-semibold">Overview</h4>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    With a stay at The Fullerton Hotel Singapore, you'll be centrally located in
                                    Singapore, steps from Cavenagh Bridge and Anderson Bridge. This 5-star hotel
                                    is close to Chinatown Heritage Center and Universal Studios Singapore.
                                    Make yourself at home in one of the 400 individually furnished guestrooms,
                                    featuring refrigerators and plasma televisions.
                                </p>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Complimentary wired and wireless Internet access keeps you connected, and
                                    satellite programming provides entertainment. Private bathrooms with separate
                                    bathtubs and showers feature deep soaking bathtubs and complimentary toiletries.
                                    Conveniences include phones, as well as laptop-compatible safes and desks.
                                </p>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Pamper yourself with a visit to the spa, which offers massages, body treatments,
                                    and facials. If you're looking for recreational opportunities, you'll find an
                                    outdoor pool and a fitness center. This Colonial hotel also features
                                    complimentary wireless Internet access, concierge services, and gift shops/newsstands.
                                </p>
                            </div>

                            {/* ===== AMENITIES + POLICIES ===== */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                                {/* AMENITIES */}
                                <div className="bg-transparent border border-[#2B2B2B] rounded-xl p-5 h-fit">
                                    <h4 className="font-semibold mb-4">Amenities</h4>

                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-700">
                                        <li className="flex items-center gap-3"><Wind size={16} /> Air Conditioning</li>
                                        <li className="flex items-center gap-3"><Tv size={16} /> TV in Room</li>
                                        <li className="flex items-center gap-3"><Coffee size={16} /> Business Center</li>
                                        <li className="flex items-center gap-3"><BedDouble size={16} /> Parking Garage</li>
                                        <li className="flex items-center gap-3"><Bath size={16} /> Hair Dryer</li>
                                        <li className="flex items-center gap-3"><Coffee size={16} /> Slippers</li>
                                        <li className="flex items-center gap-3"><Tv size={16} /> Free tea & coffee</li>
                                        <li className="flex items-center gap-3"><Coffee size={16} /> Free bottled water</li>
                                        <li className="flex items-center gap-3"><Bath size={16} /> Minibar drinks</li>
                                        <li className="flex items-center gap-3"><Wind size={16} /> WiFi</li>
                                    </ul>
                                </div>

                                {/* POLICIES */}
                                <div className="bg-transparent border border-[#2B2B2B] rounded-xl p-5 max-h-[326px] overflow-y-auto">
                                    <h4 className="font-semibold mb-4">Property Policies</h4>

                                    <p className="text-xs text-gray-500 mb-3">
                                        Extra bed policies vary by room type. Please check the room details for more information.
                                        All children are welcome.
                                    </p>

                                    <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                                        <li>
                                            <strong>Infants (0–1 year old, including babies)</strong><br />
                                            Stay free of charge when using existing beds.
                                        </li>

                                        <li>
                                            <strong>Children (2–6 years old, including toddlers)</strong><br />
                                            Stay free of charge when using existing beds.
                                        </li>

                                        <li>
                                            <strong>Guests aged 7 years and above</strong><br />
                                            Considered as adults.
                                        </li>

                                        <li>
                                            Extra beds are available upon request and will incur an additional charge.
                                        </li>

                                        <li>
                                            For bookings of more than 5 rooms, additional policies may apply.
                                        </li>
                                    </ul>
                                </div>

                            </div>
                        </div>


                        {/* RIGHT – BOOKING */}
                        <div className="lg:sticky lg:top-[120px] h-fit bg-white">
                            <div className="rounded-xl p-5 shadow-sm space-y-5 ">

                                {/* ===== GUEST & BED INFO ===== */}
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span>Adult: 2</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Baby size={16} />
                                            <span>Children: 0</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <BedDouble size={16} />
                                            <span>Double bed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BedDouble size={16} />
                                            <span>Extra bed</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ===== DATE ===== */}
                                <div className="text-sm text-gray-700 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span>Check in</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> 21/12/2025
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Check out</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> 23/12/2025
                                        </span>
                                    </div>
                                </div>

                                <hr />

                                {/* ===== PRICE OPTIONS ===== */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                                        <input type="radio" name="price" className="accent-[#b38a58]" />
                                        <div>
                                            <p className="text-xs text-gray-500">2 giờ đầu</p>
                                            <p className="font-semibold text-[#b38a58]">200.000 đ</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                                        <input type="radio" name="price" className="accent-[#b38a58]" />
                                        <div>
                                            <p className="text-xs text-gray-500">Qua đêm (sau 22h)</p>
                                            <p className="font-semibold text-[#b38a58]">360.000 đ</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">
                                        <input type="radio" name="price" className="accent-[#b38a58]" />
                                        <div>
                                            <p className="text-xs text-gray-500">Giá phòng ngày đêm</p>
                                            <p className="font-semibold text-[#b38a58]">450.000 đ</p>
                                        </div>
                                    </label>
                                </div>

                                {/* ===== EXTRA HOURS ===== */}
                                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                                    <span>Thêm giờ nghỉ +70.000/h</span>

                                    <div className="flex items-center gap-2">
                                        <button className="w-6 h-6 rounded-full border flex items-center justify-center">
                                            <Minus size={14} />
                                        </button>
                                        <span>0</span>
                                        <button className="w-6 h-6 rounded-full border flex items-center justify-center">
                                            <Plus size={14} />
                                        </button>
                                        <span className="ml-1">giờ</span>
                                    </div>
                                </div>

                                {/* ===== TOTAL ===== */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>3 night</span>
                                        <span>1.350.000 vnd</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Service (*10%)</span>
                                        <span>135.000 vnd</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-semibold border-t pt-3">
                                    <span>Total Cost</span>
                                    <span>1.485.000 vnd</span>
                                </div>

                                {/* ===== BUTTON ===== */}
                                <button className="w-full bg-[#b38a58] text-white py-2 rounded-lg">
                                    Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="relative left-1/2 -ml-[50vw] w-full overflow-hidden">
                    <div className="w-screen">
                        <iframe
                            className="w-full h-[320px] border-0"
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                room.address
                            )}&output=embed`}
                        />
                    </div>
                </section>
                <section className="relative left-1/2 -ml-[50vw] w-full overflow-hidden bg-[#fdfcf9] py-14">
                    <div className="w-screen">
                        <div className="max-w-7xl mx-auto px-4">
                            <h4 className="font-semibold mb-8">Rooms</h4>

                            <div className="bg-[#F2F2F2] rounded-xl shadow-sm p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <RoomCard title="STANDARD" price="250,000" />
                                    <RoomCard title="STANDARD" price="250,000" />
                                    <RoomCard title="SUPERIOR" price="280,000" />
                                    <RoomCard title="DELUXE" price="300,000" />
                                </div>
                                <div className="flex flex-col items-center mt-10 text-gray-600 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full border font-bold border-gray-300 flex items-center justify-center group-hover:bg-gray-100 transition">
                                        ↓
                                    </div>
                                    <span className="mt-2 text-sm text-[#1A1A1A] font-medium group-hover:text-gray-800">
                                        See More Rooms
                                    </span>
                                </div>
                            </div>



                        </div>
                    </div>
                </section>
            </div>




        </>
    );
}
export default RoomDetailPage;