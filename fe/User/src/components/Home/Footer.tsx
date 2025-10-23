"use client";

export default function Footer() {
  return (
    <footer className="bg-[#f9f6f2] text-[#3A3125] pt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 pb-10">
        {/* COLUMN 1 */}
        <div>
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

        {/* COLUMN 2 */}
        <div>
          <h4 className="text-lg font-bold mb-4 tracking-wide">DESTINATION</h4>
          <ul className="space-y-2 text-sm text-[#4e4438]">
            <li>Every unforgettable journey begins</li>
            <li>Every unforgettable journey begins</li>
            <li>Every unforgettable journey begins</li>
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div>
          <h4 className="text-lg font-bold mb-4 tracking-wide">HOTLINE</h4>
          <p className="text-sm text-[#4e4438]">+090465238</p>
        </div>

        {/* COLUMN 4 */}
        <div>
          <h4 className="text-lg font-bold mb-4 tracking-wide">CONTACT</h4>
          <div className="text-sm text-[#4e4438] space-y-1 border border-[#b38a58] p-3 rounded-md">
            <p>04533, 30 Eulji-ro, Jung-gu, Seoul, Republic of Korea</p>
            <p>+82-2-771-1000</p>
            <p>CEO JUNG HO SUCK</p>
            <p>Business Registration No. 104-81-25980</p>
            <p>Communications Sales Report No. Jung-gu 02802</p>
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
