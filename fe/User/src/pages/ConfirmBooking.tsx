import { useEffect, useState } from "react";
import type { ExtraService } from "../type/extraService.type";
import CustomerTypeSelect from "../components/ui/CustomerTypeSelect";
import { getExtraService } from "../service/api/ExtraService";
import { useBookingSearch } from "../context/booking/BookingSearchContext";
import type { PriceType } from "../type/booking.types";
import { getRoomById } from "../service/api/Room";
import { createBooking } from "../service/api/bookings";
import { useNavigate } from "react-router-dom";
import { File_URL } from "../setting/constant/app";

export default function ConfirmBooking() {
  const [extraServices, setExtraServices] = useState<ExtraService[]>([]);
  const { search,setSearch } = useBookingSearch();
  const [room, setRoom] = useState<any>(null);
  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    phone:"",
    paidAmount:"",
    note:"",
    bookingnote:"",
    idNumber:""
  })

  useEffect(() => {
    const fetchExtraServices = async () => {
      try {
        const res = await getExtraService({
          all: true,
          filter: `hotelId==${search?.hotelId}`,
        });
        setExtraServices(res?.data?.content || []);
      } catch (err) {
        console.error("Failed to load extra services", err);
      }
    };
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(Number(search?.roomId));
        setRoom(res.data.data);
      } catch (err) {
        console.error("Failed to load room", err);
      }
    };
    if (search?.roomId) {
      fetchRoom();
    } else {
      setRoom(null);
    }

    fetchExtraServices();
  }, []);
  const [selectedServices, setSelectedServices] = useState<ExtraService[]>([]);
  const toggleService = (service: ExtraService) => {
    setSelectedServices((prev) =>
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };
  const [customerType, setCustomerType] = useState("");
  const customerTypeOptions = [
    { label: "Individual", value: "individual" },
    { label: "Company", value: "company" },
    { label: "VIP", value: "vip" },
  ];
  const calcNights = (checkIn?: string, checkOut?: string): number => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calcNights(search?.checkIn, search?.checkOut);
  const calculateExtraServicePrice = (service: ExtraService) => {
    switch (service.unit) {
      case "PERNIGHT":
        return service.price * nights;

      case "PERDAY":
        return service.price * nights;

      case "PERUSE":
        return service.price;

      case "PERTRIP":
        return service.price;

      default:
        return 0;
    }
  };
  const TIME_RULES: Record<PriceType, { checkIn: string; checkOut: string }> = {
    OVERNIGHT: {
      checkIn: "10:00 PM",
      checkOut: "12:00 PM",
    },
    DAILY: {
      checkIn: "02:00 PM",
      checkOut: "12:00 PM",
    },
    HOURLY: {
      checkIn: "--",
      checkOut: "--",
    },
  };
  const isPriceType = (value?: string): value is PriceType => {
    return value === "HOURLY" || value === "OVERNIGHT" || value === "DAILY";
  };
  const priceType: PriceType = isPriceType(search?.priceType)
    ? search!.priceType
    : "DAILY";
  const formatDate = (date?: string | null) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const navigate = useNavigate();
  const roomBasePrice = search?.totalPrice ?? 0;
  const extraServiceTotal = selectedServices.reduce((total, service) => {
    return total + calculateExtraServicePrice(service);
  }, 0);
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  const grandTotal = roomBasePrice + extraServiceTotal;
 const bookingDetail = [
  // room chính
  {
    roomId: search?.roomId!,
    specialRequest: formData.bookingnote || "",
    extraServiceId: null,
    price: roomBasePrice,
  },

  // extra services
  ...selectedServices.map((service) => ({
    roomId: search?.roomId!,
    specialRequest: null,
    extraServiceId: service.id,
    price: calculateExtraServicePrice(service),
  })),
];
const TIME_TO_LOCAL: Record<PriceType, string> = {
  OVERNIGHT: "22:00:00",
  DAILY: "14:00:00",
  HOURLY: "00:00:00",
};
const BOOKING_PACKAGE_MAP: Record<PriceType, number> = {
  HOURLY: 1,
  OVERNIGHT: 2,
  DAILY: 3,
};
const CHECKOUT_TIME = "12:00:00";
const bookingPayload = {
  guestName: formData.firstName,
  surname: formData.lastName,
  idNumber:formData.idNumber,
  email: formData.email,
  phoneNumber: formData.phone,
  guestType:
    customerType === "individual"
      ? 1
      : customerType === "company"
      ? 2
      : 3,

  numberOfGuests:
    (search?.adults ?? 0) + (search?.children ?? 0),

  checkInDate: search?.checkIn,
  checkOutDate: search?.checkOut,

  checkInTime: TIME_TO_LOCAL[priceType],
  checkOutTime: CHECKOUT_TIME,

  bookingPackage: BOOKING_PACKAGE_MAP[priceType],

  totalPrice: grandTotal,
  hotelId:search?.hotelId,

  note: formData.note,

  bookingDetail,
};
const handleSubmit = async () => {
  try {
     await createBooking(bookingPayload);

    // ✅ LƯU guestName VÀO CONTEXT
    setSearch({
      ...search,
      guestName: `${formData.firstName} ${formData.lastName}`,
    });
    setFormData({
        firstName:"",
    lastName:"",
    email:"",
    phone:"",
    paidAmount:"",
    note:"",
    bookingnote:"",
    idNumber:""
    });
    setCustomerType("");
    setSelectedServices([]);
    navigate("/booking-success");

  } catch (err) {
    console.error(err);
    alert("Booking failed");
  }
};
  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-10">
            {/* Your details */}
            <section>
              <h2 className="text-lg font-semibold mb-4">
                Identification information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                name="firstName"
                value={formData.firstName}
             onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400"
                  placeholder="First name *"
                />

                <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400"
                  placeholder="Last name *"
                />
                <input
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}

                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400"
                  placeholder="CCCD / Passport number *"
                />
                <CustomerTypeSelect
                  value={customerType}
                  onChange={setCustomerType}
                  options={customerTypeOptions}
                />
              </div>
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400"
                  placeholder="Enter email"
                />
                <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400"
                  placeholder="Enter phone number"
                />
              </div>
            </section>

            {/* Special request */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Booking Specifics</h2>
              <textarea
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brown-400"
                placeholder="Write your request here..."
              />
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-4">Extra services</h2>
              <div className="space-y-3">
                {extraServices.map((service) => {
                  const servicePrice = calculateExtraServicePrice(service);

                  return (
                    <label
                      key={service.id}
                      className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedServices.some(
                            (s) => s.id === service.id
                          )}
                          onChange={() => toggleService(service)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-medium">{service.serviceName}</p>
                          <p className="text-xs text-gray-500">
                            {service.unit} · {service.price.toLocaleString()}{" "}
                            vnd
                          </p>
                        </div>
                      </div>

                      <span className="font-medium text-[#b38a58]">
                        +{servicePrice.toLocaleString()} vnd
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

   
            {/* Submit */}
            <button onClick={handleSubmit} className="w-full bg-brown-400 bg-[#967D60] hover:bg-[#7a5e41] text-white py-3 rounded-lg font-semibold transition">
              Confirm & Proceed
            </button>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <aside className="space-y-6 lg:sticky lg:top-28 h-fit">
          {/* Room */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img
              src={File_URL + room?.images[0]?.url || "Alt room"}
              alt="Room"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{room?.roomName}</h3>
              <p className="text-sm text-gray-500">{room?.hotelAddress}</p>
            </div>
          </div>

          {/* Booking details */}
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
            <h4 className="font-semibold">Your booking details</h4>

            {/* Check-in / Check-out */}
            <div className="grid grid-cols-2 text-sm">
              <div className="pr-4 border-r border-gray-200">
                <p className="text-gray-500">Check-in</p>
                <p className="font-medium"> {formatDate(search?.checkIn)}</p>
                <p className="text-gray-400 text-xs">
                  {" "}
                  From {TIME_RULES[priceType].checkIn}
                </p>
              </div>

              <div className="pl-4">
                <p className="text-gray-500">Check-out</p>
                <p className="font-medium"> {formatDate(search?.checkOut)}</p>
                <p className="text-gray-400 text-xs">
                  Until {TIME_RULES[priceType].checkOut}
                </p>
              </div>
            </div>

            <hr />

            {/* Room & guests */}
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-700">{room?.roomTypeName}</p>
              <p>
                {nights} nights, {search?.adults} adults, {search?.children}{" "}
                children
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <h4 className="font-semibold">Pricing Summary</h4>
            <div className="flex justify-between text-sm">
              <span>Room price</span>
              <span>{roomBasePrice.toLocaleString()} vnd</span>
            </div>
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="flex justify-between text-sm text-gray-600"
              >
                <span>{service.serviceName}</span>
                <span>
                  +{calculateExtraServicePrice(service).toLocaleString()} vnd
                </span>
              </div>
            ))}

            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{grandTotal.toLocaleString()} vnd</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
