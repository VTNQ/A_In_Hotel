const BookingConditionsModal = ({ open, onClose }: any) => {
  if (!open) return <></>;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center
          border rounded-md text-gray-600 hover:bg-gray-100"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4">Booking Conditions</h3>
        <div className="text-sm text-gray-700 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <p>
            To offer you more choices and competitive prices, this promotion is
            managed by a Booking.com partner.
          </p>
          <div>
            <p className="font-medium">Free Cancellation</p>
            <p>
              You can cancel free of charge until 23:59 on February 19. From
              00:00 on February 20, a cancellation fee equal to the total
              booking amount will apply.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Cancellation deadlines are based on the property's local time
              (ICT).
            </p>
          </div>
          <div>
            <p className="font-medium">Prepayment</p>
            <p>
              You will make a secure payment today via Booking.com.
              Non-refundable / No Changes.
            </p>
          </div>
          <div>
            <p className="font-medium">Not Combinable with Other Offers</p>
            <p>
              This promotion cannot be combined with other discounts,
              privileges, or rewards.
            </p>
          </div>
          <div>
            <p className="font-medium">Invoice Request</p>
            <p>
              To request an invoice after completing your booking, please go to
              “Request invoice” and fill out the online form.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Our partner company, not Booking.com, will issue the invoice.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#9c7a5b] text-white py-3 rounded-md
        text-sm font-medium hover:bg-[#87684d] transition"
        >
          I UNDERSTAND
        </button>
      </div>
    </div>
  );
};
export default BookingConditionsModal;