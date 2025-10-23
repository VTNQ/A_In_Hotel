"use client";

export default function Footer() {
  return (
    <footer className="bg-[#f9f6f2] text-[#3A3125] pt-16">
      {/* PHẦN TRÊN: GIỚI THIỆU + DESTINATION */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 px-6 pb-10">
        {/* CỘT 1 */}
        <div className="md:w-1/2">
          <h3 className="text-xl font-bold mb-4 tracking-wide">A IN HOTEL</h3>
          <p className="text-sm leading-relaxed text-[#4e4438]">
            Every unforgettable journey begins with a personal connection. By
            getting in touch with us, you open the door to tailored experiences — 
            from curated travel packages and special privileges to personalized 
            assistance that anticipates your every need.
          </p>
          <p className="text-sm leading-relaxed mt-3 text-[#4e4438]">
            Share your details with our concierge team today, and allow us to
            craft an experience that is as unique and distinguished as you are.
          </p>
        </div>

        {/* CỘT 2 */}
        <div className="md:w-1/2">
          <h4 className="text-lg font-bold mb-4 tracking-wide">DESTINATION</h4>
          <ul className="space-y-2 text-sm text-[#4e4438]">
            <li>Every unforgettable journey begins</li>
            <li>Every unforgettable journey begins</li>
            <li>Every unforgettable journey begins</li>
          </ul>
        </div>
      </div>

      {/* PHẦN DƯỚI: CÁC CHI NHÁNH */}
      <div className="bg-[#ede9e3] text-[#3A3125] py-10 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <h4 className="text-xl font-bold tracking-wide mb-4">Contact</h4>

          {/* Branches */}
          <div className="space-y-2 text-sm text-[#4e4438]">
            <p>
              <span className="font-semibold">A IN HOTEL RIVERSIDE:</span> 🏨 188 - 189 Bến Vân Đồn, P. Khánh Hội, TP.HCM (Quận 4 cũ) | 📞 028 3826 8090 – Zalo: 032 696 51 10
            </p>
            <p>
              <span className="font-semibold">A IN HOTEL GLAMOUR:</span> 🏨 63/1 - 63/3 Đường số 19, P. An Khánh, TP.HCM (Quận 2 cũ) | 📞 028 6281 3678 – Zalo: 0822 414 383
            </p>
            <p>
              <span className="font-semibold">A IN HOTEL ATISTAR:</span> 🏨 30 Đường số 14, P. An Nhơn, TP.HCM (Gò Vấp cũ) | 📞 093 464 05 85 – Zalo: 093 464 05 85
            </p>
            <p>
              <span className="font-semibold">A IN HOTEL DEL LUNA:</span> 🏨 126 Đề Thám, P. Cầu Ông Lãnh, TP.HCM (Quận 1 cũ) | 📞 028 3920 8689 – Zalo: 0333 912 721
            </p>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-[#3A3125] text-white text-center py-3 text-sm">
        © 2025 A In Hotel
      </div>
    </footer>
  );
}
