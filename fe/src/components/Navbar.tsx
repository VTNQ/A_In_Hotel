import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
const baseItem =
  "hover:text-purple-700 pb-1 transition";
const activeItem =
  "text-purple-700 border-b-2 border-purple-500";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Menu mobile */}
        <div className="flex items-center space-x-4">
          <button className="md:hidden">
            <Menu className="w-6 h-6 text-black" />
          </button>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Sheraton_Logo.svg/512px-Sheraton_Logo.svg.png"
            alt="Sheraton Logo"
            className="w-10 h-10 object-contain"
          />
        </div>

        {/* Menu desktop */}
        <ul className="hidden md:flex space-x-6 text-sm text-gray-700">
          <li><a href="#" className="hover:text-purple-700">Overview</a></li>
          <li><a href="#" className="hover:text-purple-700">Gallery</a></li>
          <li><a href="/room" className="text-purple-700 border-b-2 border-purple-500 pb-1">Rooms</a></li>
          <li><a href="#" className="hover:text-purple-700">Premium Rooms</a></li>
          <li><a href="#" className="hover:text-purple-700">Dining</a></li>
          <li><a href="#" className="hover:text-purple-700">Experiences</a></li>
          <li>
            <NavLink
              to="/event-promotion"
              className={({ isActive }) =>
                `${baseItem} ${isActive ? activeItem : ""}`
              }
            >
              Events & Promotion
            </NavLink>
          </li>
        </ul>

        {/* Đăng nhập */}
        <a
          href="/Login"
          className="hidden md:inline-block border border-black px-4 py-1 rounded-full text-sm hover:bg-black hover:text-white transition"
        >
          Sign in or Join
        </a>
      </div>
    </nav>
  );
};

export default Navbar;




