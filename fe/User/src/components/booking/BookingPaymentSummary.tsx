import { ArrowRight, Verified } from "lucide-react";

const BookingPaymentSummary = ({ room, search, nights, services,total }: any) => {
  return (
    <div className="lg:col-span-5">
      <div className="bg-white border border-outline-variant rounded-xl p-[24px] top-24 shadow-sm">
        <h2 className="text-[20px] line-clamp-1 font-semibold font-sans text-on-surface mb-[24px]">
          Payment Summary
        </h2>
        <div className="space-y-8 pb-[24px] border-b border-outline-variant">
          <div className="flex justify-between items-center text-[14px] line-clamp-1 font-normal">
            <span className="text-on-surface">
              {room?.roomName} ({nights} nights)
            </span>
            <span className="font-semibold">
              ${search.totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-[14px] line-clamp-1 font-normal">
            <span className="text-on-surface">Spa & Wellness Package</span>
            <span className="font-semibold">$150.00</span>
          </div>
          {services.map((service: any) => (
            <div
              key={service.id}
              className="flex justify-between items-center text-[14px] line-clamp-1 font-normal"
            >
              <span className="text-on-surface">{service?.serviceName}</span>
              <span className="font-semibold">{service?.extraCharge}%</span>
            </div>
          ))}
        </div>
        <div className="py-[24px]">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-sans text-on-surface uppercase tracking-wider">
                Total Cost
              </p>
              <p className="text-[32px] font-extrabold text-on-surface leading-tight">
                ${total}
              </p>
            </div>
          </div>
        </div>
        <button
          className="w-full bg-[rgb(251,247,242)] text-[rgb(24,28,32)] py-[16px] px-[24px] rounded-lg font-sans text-[14px] line-clamp-1 font-semibold 
         shadow-lg shadow-black/5 border 
         border-outline-variant hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-[16px]"
        >
          Confirm Booking
          <ArrowRight size={20} />
        </button>
        <p className="text-center font-sans text-on-surface mt-[16px] flex items-center justify-center gap-[4px]">
          <Verified size={20} className="text-[14px]" />
          SSL Secure & Encrypted Payment
        </p>
      </div>
    </div>
  );
};
export default BookingPaymentSummary;
