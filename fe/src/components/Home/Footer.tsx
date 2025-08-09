// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#3a3a3a] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div>
          <h2 className="text-lg font-light tracking-widest uppercase">
            SHERATON® SAIGON GRAND OPERA HOTEL
          </h2>
          <div className="border-t border-gray-500 w-12 my-4"></div>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Overview</a></li>
            <li><a href="#" className="hover:underline">Gallery</a></li>
            <li><a href="#" className="hover:underline">Rooms</a></li>
            <li><a href="#" className="hover:underline">Premium Rooms</a></li>
            <li><a href="#" className="hover:underline">Dining</a></li>
          </ul>
        </div>

        {/* MIDDLE */}
        <div>
          <div className="border-t border-gray-500 w-12 mb-4"></div>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Experiences</a></li>
            <li><a href="#" className="hover:underline">Events</a></li>
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <div className="border-t border-gray-500 w-12 mb-4"></div>
          <p>88 DONG KHOI, SAIGON WARD,<br />HO CHI MINH CITY, VIETNAM</p>
          <p className="mt-2">FAX: +84 283-8272929</p>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">Follow Sheraton Saigon Grand Opera Hotel</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-gray-300">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="hover:text-gray-300">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
