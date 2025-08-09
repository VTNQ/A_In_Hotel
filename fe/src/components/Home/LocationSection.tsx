const LocationSection = () => {
  return (
    <div className="bg-[#1a1a1a] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* LEFT CONTENT */}
        <div>
          <p className="text-sm uppercase text-gray-400 mb-1">Our Location</p>
          <h2 className="text-2xl font-semibold mb-4">Getting Here</h2>

          <div className="text-sm space-y-2 mb-6">
            <p><strong>Sheraton Saigon Grand Opera Hotel</strong></p>
            <p>88 Dong Khoi, Saigon Ward, Ho Chi Minh City, Vietnam</p>
            <p>
              Tel:{" "}
              <a href="tel:+842838272828" className="text-blue-400 hover:underline">
                +84 28-3827 2828
              </a>
            </p>
          </div>

          {/* DROPDOWNS */}
          <div className="space-y-4">
            <details className="border-b border-gray-600 pb-2">
              <summary className="cursor-pointer flex items-center justify-between text-sm">
                ✈️ Tan Son Nhat International Airport
              </summary>
              <p className="mt-2 text-gray-400 text-sm">
                Approx. 30 mins by car depending on traffic.
              </p>
            </details>

            <details className="border-b border-gray-600 pb-2">
              <summary className="cursor-pointer flex items-center justify-between text-sm">
                🚗 Other Transportation
              </summary>
              <p className="mt-2 text-gray-400 text-sm">
                Shuttle, taxi, Grab, or public transport options available nearby.
              </p>
            </details>
          </div>
        </div>

        {/* MAP */}
        <div className="w-full h-80">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5358260921463!2d106.7031304748043!3d10.771883389378468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f42aa5a0e05%3A0x5e9c08cc02e6111d!2sSheraton%20Saigon%20Grand%20Opera%20Hotel!5e0!3m2!1sen!2s!4v1693466885010!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-md shadow-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
