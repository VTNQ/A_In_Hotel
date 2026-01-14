"use client";

import { useState, useEffect } from "react";
import { Menu, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type LangKey = "en" | "vi" | "kr" | "jp" | "cn";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [lang, setLang] = useState<LangKey>("en");
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === "/";

  const flagMap: Record<LangKey, string> = {
    en: "https://flagcdn.com/w20/gb.png",
    vi: "https://flagcdn.com/w20/vn.png",
    kr: "https://flagcdn.com/w20/kr.png",
    jp: "https://flagcdn.com/w20/jp.png",
    cn: "https://flagcdn.com/w20/cn.png",
  };

  /* ===== Scroll behavior ===== */
  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
      ${isHome && !isScrolled
        ? "bg-transparent py-5"
        : "bg-white py-2 shadow-md backdrop-blur-lg"}`}
    >
      <div className="max-w-[1300px] mx-auto flex items-center justify-between gap-8 px-6 md:px-10">
        {/* ===== LEFT ===== */}
        <div className="flex items-center space-x-5">
          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium">
            <button
              onClick={() => navigate("/")}
              className={`hover:text-[#B38A58] transition-colors
              ${isScrolled ? "text-[#3A3125]" : "text-white"}`}
            >
              A-IN HOTEL ▾
            </button>
            <button
              onClick={() => navigate("/rooms")}
              className={`hover:text-[#B38A58] transition-colors
              ${isScrolled ? "text-[#3A3125]" : "text-white"}`}
            >
              ROOM & SUITE
            </button>
            <button
              onClick={() => navigate("/promotion")}
              className={`hover:text-[#B38A58] transition-colors
              ${isScrolled ? "text-[#3A3125]" : "text-white"}`}
            >
              PROMOTION
            </button>
          </nav>
        </div>

        {/* ===== LOGO ===== */}
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/image/Vector.png"
            alt="A-IN HOTEL"
            className={`mb-1 transition-all duration-300
            ${isScrolled ? "h-8 brightness-0 invert-[0.2]" : "h-10 brightness-200"}`}
          />
          <h1
            className={`font-bold tracking-wide transition-all duration-300
            ${isScrolled ? "text-[#3A3125] text-base" : "text-white text-lg"}`}
          >
            A-IN HOTEL
          </h1>
        </div>

        {/* ===== RIGHT ===== */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {/* NAV ITEMS */}
          <div className="flex items-center gap-5">
            {[
              { label: "AIR BNB", path: "/airbnb" },
              { label: "CAMPING", path: "/camping" },
              { label: "OUR PRODUCT", path: "/product" },
              { label: "Log in", path: "/login" },
              { label: "Sign up", path: "/register" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`hover:text-[#B38A58] transition-colors
                ${isScrolled ? "text-[#3A3125]" : "text-white"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* LANGUAGE – luôn ở cuối */}
          <div
            className="relative ml-2"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <button
              className={`flex items-center border rounded-md px-2 py-1 transition-colors
              ${isScrolled
                ? "border-[#3A3125] hover:bg-[#3A3125]/10"
                : "border-[#b38a58] hover:bg-[#b38a58]/20"}`}
            >
              <img
                src={flagMap[lang]}
                alt={lang}
                className="w-5 h-4 mr-2"
              />
              <Globe
                className={`w-4 h-4 ${
                  isScrolled ? "text-[#3A3125]" : "text-[#b38a58]"
                }`}
              />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg">
                {Object.entries(flagMap).map(([code, url]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setLang(code as LangKey);
                      setIsLangOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100
                    ${lang === code ? "bg-gray-100 font-semibold" : ""}`}
                  >
                    <img src={url} className="w-5 h-4 mr-2" />
                    {code.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ===== MOBILE BUTTON ===== */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          <Menu />
        </button>
      </div>

      {/* ===== MOBILE MENU ===== */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-[rgba(58,49,37,0.95)] py-4 space-y-4 text-sm text-white">
          {[
            { label: "A-IN HOTEL", path: "/" },
            { label: "ROOM & SUITE", path: "/rooms" },
            { label: "PROMOTION", path: "/promotion" },
            { label: "CAMPING", path: "/camping" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
              className="hover:text-yellow-300"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
