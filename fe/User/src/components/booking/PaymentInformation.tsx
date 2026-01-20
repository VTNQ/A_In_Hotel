const PaymentInformation = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <h3 className="font-semibold text-lg border-b pb-2 mb-4">
        Payment Information
      </h3>

      {/* PAYMENT METHODS */}
      <p className="text-sm font-medium mb-2">How would you like to pay?</p>

      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
          alt="Visa"
          className="h-6 object-contain"
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
          alt="Mastercard"
          className="h-6 object-contain"
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/JCB_logo.svg"
          alt="JCB"
          className="h-6 object-contain"
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
          alt="Apple Pay"
          className="h-6 object-contain"
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
          alt="Amex"
          className="h-6 object-contain"
        />
      </div>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4">
        {/* NAME ON CARD */}
        <div>
          <label className="block text-sm font-medium mb-1">Name on card</label>
          <input
            placeholder="Email address"
            className="w-full h-11 px-3 rounded-md border border-gray-200 bg-[#F2F2F2]
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* CARD NUMBER */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Credit Card Number <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Email address"
            className="w-full h-11 px-3 rounded-md border border-gray-200 bg-[#F2F2F2]
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* EXPIRATION DATE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Expiration Date <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-2">
            <select
              className="w-full h-11 px-3 rounded-md border border-gray-200 bg-[#F2F2F2]
              text-sm focus:outline-none"
            >
              <option>Month</option>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>

            <select
              className="w-full h-11 px-3 rounded-md border border-gray-200 bg-[#F2F2F2]
              text-sm focus:outline-none"
            >
              <option>Year</option>
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i}>{2024 + i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CVC */}
        <div>
          <label className="block text-sm font-medium mb-1">
            CVV/CVC <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full h-11 px-3 rounded-md border border-gray-200 bg-[#F2F2F2]
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* NOTE */}
      <p className="text-xs text-gray-500 mt-4">
        Please present a valid ID at check-in. The name must match the booking
        and cannot be changed.
      </p>
    </div>
  );
};

export default PaymentInformation;
