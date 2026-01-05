export default function ConfirmBooking() {
    return (
        <div className="min-h-screen bg-gray-100 pt-24 pb-12">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: FORM */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-8 space-y-10">

                        {/* Your details */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4">Your details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="First name *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Last name *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Phone number *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Email address *" />
                            </div>
                        </section>

                        {/* Special request */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4">
                                Special requests to hotel
                            </h2>
                            <textarea
                                className="input min-h-[140px]"
                                placeholder="Write your request here..."
                            />
                        </section>

                        {/* Payment */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4">
                                Payment information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Name on card *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Credit card number *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Expiration date (MM/YY) *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="CVC *" />
                            </div>
                        </section>

                        {/* Billing */}
                        <section>
                            <h2 className="text-lg font-semibold mb-4">
                                Billing address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="First name *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Last name *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Street address *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="City *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Postal ZIP code *" />
                                <input className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400" placeholder="Country *" />
                            </div>
                        </section>

                        {/* Submit */}
                        <button className="w-full bg-brown-400 hover:bg-[#7a5e41] text-white py-3 rounded-lg font-semibold transition">
                            Confirm & Proceed
                        </button>
                    </div>
                </div>

                {/* RIGHT: SUMMARY */}
                <aside className="space-y-6 lg:sticky lg:top-28 h-fit">

                    {/* Room */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
                            alt="Room"
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-semibold text-lg">MINI ROOM</h3>
                            <p className="text-sm text-gray-500">
                                District 1, Ho Chi Minh City
                            </p>
                        </div>
                    </div>

                    {/* Booking details */}
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                        <h4 className="font-semibold">Your booking details</h4>

                        {/* Check-in / Check-out */}
                        <div className="grid grid-cols-2 text-sm">
                            <div className="pr-4 border-r border-gray-200">
                                <p className="text-gray-500">Check-in</p>
                                <p className="font-medium">Tue, 08 Oct 2024</p>
                                <p className="text-gray-400 text-xs">From 02:00 PM</p>
                            </div>

                            <div className="pl-4">
                                <p className="text-gray-500">Check-out</p>
                                <p className="font-medium">Wed, 10 Oct 2024</p>
                                <p className="text-gray-400 text-xs">Until 02:00 PM</p>
                            </div>
                        </div>


                        <hr />

                        {/* Room & guests */}
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-700">Deluxe Room</p>
                            <p>3 nights, 2 adults, 0 children</p>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                        <h4 className="font-semibold">Pricing Summary</h4>
                        <div className="flex justify-between text-sm">
                            <span>Room price</span>
                            <span>$150</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax & fees</span>
                            <span>$20</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>$170</span>
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    );
}
