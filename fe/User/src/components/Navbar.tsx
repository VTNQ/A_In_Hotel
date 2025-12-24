"use client";

import { useState, useEffect } from "react";
import { Menu, Globe } from "lucide-react";

type LangKey = "en" | "vi" | "kr" | "jp" | "cn";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState<LangKey>("en");



  const flagMap: Record<LangKey, string> = {
    en: "https://flagcdn.com/w20/gb.png",
    vi: "https://flagcdn.com/w20/vn.png",
    kr: "https://flagcdn.com/w20/kr.png",
    jp: "https://flagcdn.com/w20/jp.png",
    cn: "https://flagcdn.com/w20/cn.png",
  };
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    // 👉 NẾU KHÔNG PHẢI TRANG HOME
    if (!isHome) {
      setIsScrolled(true); // ép trạng thái "đã scroll"
      return;
    }

    // 👉 CHỈ HOME MỚI THEO DÕI SCROLL
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll(); // check ngay khi mount
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
    ${isHome && !isScrolled
          ? "bg-transparent py-5"
          : "bg-white py-2 shadow-md backdrop-blur-lg"
        }
  `}
    >
      {/* ✅ Giảm max width + thêm gap giữa 3 nhóm */}
      <div className="max-w-[1300px] mx-auto flex items-center justify-between gap-8 px-6 md:px-10">
        {/* LEFT SECTION */}
        <div className="flex items-center space-x-5">
          <span
            className={`transition-colors duration-300 ${isHome && !isScrolled ? "text-white" : "text-[#3A3125]"
              }`}
          >
            {/* <img
              src="image/Phone Rounded.png"
              alt="phone"
              className={`h-4 w-4 ${isScrolled ? "brightness-0 invert-[0.2]" : "brightness-200"
                }`}
            /> */}
            {/* <span>032 696 5110</span> */}
          </span>
          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
            {["A-IN HOTEL ▾", "ROOM & SUITE", "PROMOTION"].map((item, i) => (
              <a
                key={i}
                href="#"
                className={`transition-colors duration-300 hover:text-[#B38A58] ${isScrolled ? "text-[#3A3125]" : "text-white"
                  }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* LOGO */}
        <div className="flex flex-col items-center mx-1 transition-all duration-300">
          <img
            src="/image/Vector.png"
            alt="A-IN HOTEL"
            className={`mb-1 transition-all duration-300 ${isScrolled ? "h-8" : "h-10"
              } ${isScrolled ? "brightness-0 invert-[0.2]" : "brightness-200"
              }`}
          />
          <h1
            className={`font-bold tracking-wide transition-all duration-300 ${isScrolled ? "text-[#3A3125] text-base" : "text-white text-lg"
              }`}
          >
            A-IN HOTEL
          </h1>
        </div>

        {/* RIGHT SECTION */}
        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
          {["AIR BNB", "CAMPING", "OUR PRODUCT", "Log in", "Sign up"].map(
            (item, i) => (
              <a
                key={i}
                href="#"
                className={`transition-colors duration-300 hover:text-[#B38A58] ${isScrolled ? "text-[#3A3125]" : "text-white"
                  }`}
              >
                {item}
              </a>
            )
          )}

          {/* LANGUAGE SELECTOR */}
          <div
            className="relative"
            onMouseEnter={() => setIsLangOpen(true)}
          >
            <button
              className={`flex items-center border rounded-md px-2 py-1 transition-colors duration-300 ${isScrolled
                ? "border-[#3A3125] hover:bg-[#3A3125]/10"
                : "border-[#b38a58] hover:bg-[#b38a58]/20"
                }`}
            >
              <img
                src={flagMap[lang]}
                alt={lang}
                className="w-5 h-4 rounded-sm mr-2"
              />
              <Globe
                className={`w-4 h-4 ${isScrolled ? "text-[#3A3125]" : "text-[#b38a58]"
                  }`}
              />
            </button>

            {isLangOpen && (
              <div
                onMouseLeave={() => setIsLangOpen(false)}
                className="absolute right-0 mt-2 flex flex-col bg-white text-gray-800 rounded-md shadow-lg w-28"
              >
                {Object.entries(flagMap).map(([code, url]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLang(code as LangKey);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center px-3 py-2 text-sm hover:bg-gray-100 ${lang === code ? "bg-gray-100 font-semibold" : ""
                      }`}
                  >
                    <img
                      src={url}
                      alt={code}
                      className="w-5 h-4 rounded-sm mr-2"
                    />
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 focus:outline-none"
        >
          <Menu />
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-[rgba(58,49,37,0.95)] backdrop-blur-lg py-4 space-y-4 text-sm">
          <a href="#" className="hover:text-yellow-300">
            A-IN HOTEL
          </a>
          <a href="#" className="hover:text-yellow-300">
            ROOM & SUITE
          </a>
          <a href="#" className="hover:text-yellow-300">
            DINING
          </a>
          <a href="#" className="hover:text-yellow-300">
            EVENT
          </a>
          <a href="#" className="hover:text-yellow-300">
            PROMOTION
          </a>
          <a href="#" className="hover:text-yellow-300">
            CAMPING
          </a>
        </div>
      )}
    </header>
  );
}
