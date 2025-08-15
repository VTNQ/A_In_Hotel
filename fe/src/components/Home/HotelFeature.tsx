const HotelFeature = () => {
    return (
        <div className="px-4 py-16 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start gap-10">
                <div className="w-full lg:w-1/2">
                    <img
                        src="https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-hotel-building-1-41968:Classic-Hor?wid=1300&fit=constrain"
                        alt="Ho Chi Minh City at Night"
                        className="rounded-xl w-full h-auto object-cover"
                    />
                </div>
                <div className="w-full lg:w-1/2">
                    <p className="uppercase text-sm tracking-wide text-gray-500 mb-2">
                        Prime Location
                    </p>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Close to It All</h2>
                    <p className="text-gray-700 leading-relaxed">
                        A premier 5-star hotel in Ho Chi Minh City, ideally situated at the
                        junction of the legendary Dong Khoi Street and Dong Du Street, next to
                        Nguyen Hue walking street, just steps from the Opera House station on
                        Line 1 Metro. The hotel’s prime location offers unparalleled access to
                        top cultural attractions, shopping malls and entertainment spots.
                    </p>
                </div>
            </div>
            <div className="mt-20 text-center max-w-3xl mx-auto">
                <p className="uppercase text-sm tracking-widest text-gray-500 mb-3">Stylist Accommodations</p>
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                    Stay in Ho Chi Minh City’s Ultimate Luxury
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                    Discover the Sheraton Saigon Grand Opera Hotel, where modern elegance
                    meets Vietnamese hospitality. Our 379 beautifully renovated rooms and
                    suites showcase contemporary design inspired by the iconic Vietnamese
                    lotus, creating a serene and visually captivating environment for both
                    business and leisure travelers. Indulge in thoughtfully curated amenities
                    designed for your comfort, including the Sheraton...

                </p>
                <button className="bg-[#6f625d] text-white px-6 py-2 rounded-full hover:bg-gray-700 transition">
                    Explore
                </button>
            </div>
        </div>
    )
}
export default HotelFeature;