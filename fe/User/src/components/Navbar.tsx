import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-[rgba(58,49,37,0.3)] text-white transition-all duration-300 ${isScrolled ? "py-3 shadow-md" : "py-5"
        }`}
    >
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-[100px]">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <span className="flex items-center space-x-2 text-sm">
            <span>📞</span>
            <span>032 696 5110</span>
          </span>
          <nav className="hidden md:flex items-center space-x-10 text-sm">
            <a href="#" className="hover:text-yellow-300 transition">
              A-IN HOTEL ▾
            </a>
            <a href="#" className="hover:text-yellow-300 transition">ROOM & SUITE</a>
            <a href="#" className="hover:text-yellow-300 transition">DINING</a>
          </nav>
        </div>

        {/* Logo */}
        <div className="text-center flex flex-col items-center">
          {/* Logo */}
          <img src="/image/Vector.png" alt="A-IN HOTEL" className="h-10 w-auto mb-1" />
          {/* Text */}
          <h1 className="font-bold tracking-wide text-lg">A-IN HOTEL</h1>
        </div>


        {/* Right Section */}
        <nav className="hidden md:flex items-center space-x-10 text-sm">
          <a href="#" className="hover:text-yellow-300 transition">EVENT</a>
          <a href="#" className="hover:text-yellow-300 transition">PROMOTION</a>
          <a href="#" className="hover:text-yellow-300 transition">AIR BNB</a>
          <a href="#" className="hover:text-yellow-300 transition">CAMPING</a>
          <img
            src="/image/Map Point.png"
            alt="Location"
            className="h-5 w-5 object-contain"
          />

        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 focus:outline-none"
        >
          <Menu />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-[rgba(58,49,37,0.95)] backdrop-blur-lg py-4 space-y-4 text-sm">
          <a href="#" className="hover:text-yellow-300">A-IN HOTEL</a>
          <a href="#" className="hover:text-yellow-300">ROOM & SUITE</a>
          <a href="#" className="hover:text-yellow-300">DINING</a>
          <a href="#" className="hover:text-yellow-300">EVENT</a>
          <a href="#" className="hover:text-yellow-300">PROMOTION</a>
          <a href="#" className="hover:text-yellow-300">AIR BNB</a>
          <a href="#" className="hover:text-yellow-300">CAMPING</a>
        </div>
      )}
    </header>
  );
}
