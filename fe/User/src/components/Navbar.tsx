"use client";

import { useState, useEffect } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearTokens, getTokens, isAccessExpired } from "../util/auth";

type LangKey = "en" | "vi" | "kr" | "jp" | "cn";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tokens = getTokens();
  const isLoggedIn = !!tokens && !isAccessExpired();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<LangKey>("en");

  const isHome = location.pathname === "/";

  const flagMap: Record<LangKey, string> = {
    en: "https://flagcdn.com/w20/gb.png",
    vi: "https://flagcdn.com/w20/vn.png",
    kr: "https://flagcdn.com/w20/kr.png",
    jp: "https://flagcdn.com/w20/jp.png",
    cn: "https://flagcdn.com/w20/cn.png",
  };

  const leftItems = [
    { label: "A-IN-HOTEL", path: "/" },
    { label: "ROOM & SUITE", path: "/rooms" },
    { label: "PROMOTION", path: "/promotion" },
  ];

  const rightItems = [
    { label: "AIR BNB", path: "/airbnb" },
    { label: "CAMPING", path: "/camping" },
    { label: "OUR PRODUCT", path: "/product" },
  ];

  /* Scroll effect */
  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  /* Lock body scroll when mobile open */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  const navColor = isHome && !isScrolled ? "text-white" : "text-[#3A3125]";

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isHome && !isScrolled
            ? "bg-transparent py-4"
            : "bg-white/90 py-2 shadow-md backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-5 flex items-center justify-between">
          {/* LEFT DESKTOP */}
          <div className="hidden md:flex gap-6 text-sm font-medium">
            {leftItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`${navColor} hover:text-[#B38A58] transition`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* LOGO */}
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center"
          >
            <img
              src="/image/Vector.png"
              className={`transition-all ${
                isScrolled ? "h-8 brightness-0" : "h-10 brightness-200"
              }`}
            />
            <span
              className={`font-bold tracking-wide ${
                isHome && !isScrolled ? "text-white" : "text-[#3A3125]"
              }`}
            >
              A-IN HOTEL
            </span>
          </button>

          {/* RIGHT DESKTOP */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {rightItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`${navColor} hover:text-[#B38A58] transition`}
              >
                {item.label}
              </button>
            ))}

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className={`${navColor} hover:text-[#B38A58]`}
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 bg-[#B38A58] text-white rounded-full"
                >
                  Sign up
                </button>
              </>
            ) : (
              <div className="relative">
                <button onClick={() => setIsUserOpen(!isUserOpen)}>
                  <User className={navColor} />
                </button>

                {isUserOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-md">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My profile
                    </button>
                    <button
                      onClick={() => navigate("/my-booking")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My booking
                    </button>
                    <button
                      onClick={() => {
                        clearTokens();
                        navigate("/login");
                      }}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LANGUAGE */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 border px-2 py-1 rounded-md"
              >
                <img src={flagMap[lang]} className="w-5 h-4" />
                <ChevronDown size={14} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md w-28">
                  {(Object.keys(flagMap) as LangKey[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLang(code);
                        setIsLangOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                    >
                      <img src={flagMap[code]} className="w-5 h-4 mr-2" />
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`md:hidden ${navColor}`}
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Slide panel */}
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-6 transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)}>
              <X />
            </button>
          </div>

          {[...leftItems, ...rightItems].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-3 border-b"
            >
              {item.label}
            </button>
          ))}

          <div className="mt-6 space-y-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-2 border rounded-md"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-2 bg-[#B38A58] text-white rounded-md"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="block py-2"
                >
                  My profile
                </button>
                <button
                  onClick={() => navigate("/booking")}
                  className="block py-2"
                >
                  My booking
                </button>
                <button
                  onClick={() => {
                    clearTokens();
                    navigate("/login");
                  }}
                  className="block py-2 text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
