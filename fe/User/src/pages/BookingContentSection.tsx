import { useState } from "react";
import useCountdown from "../hook/useCountdown";
import BookingSteps from "../components/booking/BookingSteps";
import PaymentInformation from "../components/booking/PaymentInformation";
import GuestInformation from "../components/booking/GuestInformation";
import BookingConditionsModal from "../components/booking/BookingConditionsModal";

const BookingContentSection = () => {
  const [currentStep] = useState(2); // Step 2 active
  const { secondsLeft, formatTime } = useCountdown(20 * 60);
  const [openConditions, setOpenConditions] = useState(false);

  return (
    <>
      <section className="px-6 pt-32 pb-8">
        <div className="max-w-7xl mx-auto font-montserrat">
          <BookingSteps currentStep={currentStep} />

          {/* COUNTDOWN BAR */}
          <div className="bg-[#FFD8B8] text-center text-sm py-2 mb-6">
            Price held for you{" "}
            <span className="font-semibold text-red-600">{formatTime()}</span>
          </div>
          {/* GRID PHẢI Ở ĐÂY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* LEFT COLUMN */}
            <div className="space-y-6 lg:col-span-3">
              {/* Room card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                  alt="Mini Room"
                  className="w-full h-52 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-lg">Mini Room</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    126 Đường Đề Thám, Phường Cầu Ông Lãnh, TP. HCM
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-3">
                    <span>✔ Free Wi-Fi</span>
                    <span>✔ Room Service</span>
                    <span>✔ Safe</span>
                    <span>✔ Parking Garage</span>
                  </div>
                </div>
              </div>

              {/* Booking details */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h4 className="font-semibold mb-4">Your Booking details</h4>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#1A1A1A] mb-1 font-medium">Check-in</p>
                    <p className="font-semibold">Tue, 09 Jul, 2024</p>
                    <p className="text-xs text-[#9E9D9D] font-normal mt-1">
                      From 02:00 PM
                    </p>
                  </div>

                  <div className="relative pl-4">
                    <span className="absolute left-0 top-0 h-full w-px bg-gray-200" />
                    <p className="text-[#1A1A1A] mb-1 font-medium">Check-out</p>
                    <p className="font-semibold">Wed, 10 Jul, 2024</p>
                    <p className="text-xs text-[#9E9D9D] mt-1 font-normal">
                      Until 02:00 PM
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-sm">
                  <p className="font-medium">Deluxe Room</p>
                  <p className="text-gray-500">3 night, 2 adults, 0 children</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h4 className="font-semibold mb-3">Pricing Summary</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>1 room × 3 night</span>
                    <span>$$$</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax and service fees</span>
                    <span>$$</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>$$$</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              {currentStep === 2 && <PaymentInformation />}
              {currentStep === 1 && <GuestInformation />}
              <p className="text-xs text-gray-500 mt-4">
                Sign in to book faster or{" "}
                <span className="text-green-600">Create an account</span>
              </p>

              <button
                disabled={secondsLeft <= 0}
                className={`mt-6 w-full py-3 rounded-md text-sm transition
                  ${
                    secondsLeft <= 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#9c7a5b] text-white hover:bg-[#87684d]"
                  }`}
              >
                Confirm & Proceed
              </button>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h4 className="font-semibold mb-3">Special Requests</h4>
                <p className="text-xs text-gray-500 mb-3">
                  Let us know your preferences. Requests are subject to
                  availability.
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* OPTION 1 */}
                  <label className="flex items-start gap-3 cursor-pointer text-sm">
                    <input type="checkbox" className="peer hidden" />

                    {/* Icon */}
                    <span
                      className="
        relative mt-1 w-5 h-5 flex-shrink-0
        rounded-full border-2 border-[#8b6f4e]
        flex items-center justify-center
        after:content-['']
        after:w-2.5 after:h-2.5
        after:rounded-full
        after:bg-[#8b6f4e]
        after:scale-0 after:transition
        peer-checked:after:scale-100
      "
                    />

                    {/* TEXT WRAPPER */}
                    <span className="leading-snug text-gray-800 break-words">
                      I’d like to store my luggage
                    </span>
                  </label>

                  {/* OPTION 2 */}
                  <label className="flex items-start gap-3 cursor-pointer text-sm">
                    <input type="checkbox" className="peer hidden" />

                    <span
                      className="
        relative mt-1 w-5 h-5 flex-shrink-0
        rounded-full border-2 border-[#8b6f4e]
        flex items-center justify-center
        after:content-['']
        after:w-2.5 after:h-2.5
        after:rounded-full
        after:bg-[#8b6f4e]
        after:scale-0 after:transition
        peer-checked:after:scale-100
      "
                    />

                    <span className="leading-snug text-gray-800 break-words">
                      I’d like a high-floor room
                    </span>
                  </label>
                  <div>
                    <p className="font-medium mb-2">Smoking Preference</p>
                    <label className="flex items-start gap-3 cursor-pointer text-sm">
                      <input type="checkbox" className="peer hidden" />

                      {/* Icon */}
                      <span
                        className="
        relative mt-1 w-5 h-5 flex-shrink-0
        rounded-full border-2 border-[#8b6f4e]
        flex items-center justify-center
        after:content-['']
        after:w-2.5 after:h-2.5
        after:rounded-full
        after:bg-[#8b6f4e]
        after:scale-0 after:transition
        peer-checked:after:scale-100
      "
                      />

                      {/* TEXT WRAPPER */}
                      <span className="leading-snug text-gray-800 break-words mt-2">
                        Non-smoking room
                      </span>
                    </label>
                  </div>
                </div>
                <div className="mt-6 border border-dashed rounded-lg p-4 text-xs text-gray-600 space-y-2">
                  <p className="font-medium">
                    You will be taken to the next step
                  </p>
                  <ul className="list-disc list-inside">
                    <li>Free cancellation until 23:59 on February 19, 2026</li>
                    <li>Prepayment required</li>
                    <li>No changes allowed after booking</li>
                    <li>Confirmation within 2 minutes</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Parking spaces are limited. Please contact the hotel in advance
                if you need a parking spot.
              </p>
              <span
                className="text-green-600 text-sm"
                onClick={() => setOpenConditions(true)}
              >
                Booking Conditions ?
              </span>
            </div>
          </div>
        </div>
      </section>
      <BookingConditionsModal
        open={openConditions}
        onClose={() => setOpenConditions(false)}
      />
    </>
  );
};

export default BookingContentSection;
