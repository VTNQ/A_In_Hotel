const GreenGlobeSection = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2 w-full">
                <img
                    src="https://cache.marriott.com/is/image/marriotts7prod/si-sgnsi-sgnsi-hotel-building-2-41217:Classic-Hor?wid=1300&fit=constrain"
                    alt="Sheraton Saigon Cityscape"
                    className="rounded-xl w-full object-cover" />

            </div>
            <div className="md:w-1/2 w-full">
                <p className="uppercase tracking-widest text-sm text-gray-500 mb-2">
                    Green Globe Certification
                </p>
                <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
                    Make Responsible Choices During Your Stay
                </h2>
                <p className="text-gray-700 text-base leading-relaxed mb-3">
                    As the sustainable hotel operator, Sheraton Saigon Grand Opera Hotel
                    invites guests to join us on a journey towards responsible travel.
                    Together, we encourage you to contribute to a more sustainable planet
                    and help reduce our global carbon, water, and waste footprints towards
                    net-zero carbon emissions. Over the years, the hotel has been
                    encompassing initiatives including energy saving alternatives,...
                </p>
                <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline font-medium"
                >
                    See More
                </a>
            </div>
        </section>
    )
}
export default GreenGlobeSection;