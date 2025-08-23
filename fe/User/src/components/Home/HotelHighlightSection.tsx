const HotelHighlightSection = () => {
    return (
        <section className="bg-[#f9f8f8] py-16 px-6 lg:px-24">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div className="overflow-hidden rounded-xl shadow-md">
                    <img src="https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-event-service-35661:Classic-Hor?wid=1300&fit=constrain"
                        alt="Meeting room"
                        className="w-full h-auto object-cover"
                    />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                        Top MICE Destination
                    </p>
                    <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-4">
                        The Leading Hotel for Meetings, Incentive, Conference and Exhibitions
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        Ho Chi Minh City, also known as Saigon, is the city with rich culture and modern
                        facilities, the vibrant metropolis with well-equipped infrastructures which are exemplary
                        to host international events. Located in the heart of this city, Sheraton Saigon Grand
                        Opera Hotel boasts the utmost convenience and safety for a successful business trip.
                        Experience timeless culinary creations tailored uniquely to...
                        <span className="text-gray-500 underline cursor-pointer"> See More</span>
                    </p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto text-center mt-16">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                    Discover Saigon
                </p>
                <h3 className="text-xl md:text-2xl font-medium text-gray-800 mb-4">
                    The Pearl of the Far East
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto mb-4">
                    Saigon, the economic capital of Vietnam and the gateway to explore Vietnam, is the perfect
                    mix of tradition and modernity. With significant landmarks, historical sites, and sleek
                    skyscrapers, Saigon is an alluring gathering place for both locals and travelers from
                    around the world...
                    <span className="text-gray-500 underline cursor-pointer"> See More</span>
                </p>
                <button className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition">
                    Learn More
                </button>
            </div>
        </section>
    )
}
export default HotelHighlightSection;