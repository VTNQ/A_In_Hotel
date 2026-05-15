"use client";

import { useState, useEffect } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearTokens, getTokens, isAccessExpired } from "../util/auth";
import { useTranslation } from "react-i18next";

type LangKey = "en" | "vi";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const tokens = getTokens();
  const isLoggedIn = !!tokens && !isAccessExpired();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const currentLang = (i18n.language?.split('-')[0] || 'vi') as LangKey;

  const isHome = location.pathname === "/";

  const flagMap: Record<LangKey, string> = {
    en: "https://flagcdn.com/w20/gb.png",
    vi: "https://flagcdn.com/w20/vn.png",
  };

  const leftItems = [
    { label: t("navbar.home"), path: "/" },
    { label: t("navbar.rooms"), path: "/rooms" },
    { label: t("navbar.promotion"), path: "/promotion" },
  ];

  const rightItems = [
    { label: t("navbar.airbnb"), path: "/airbnb" },
    { label: t("navbar.camping"), path: "/camping" },
    { label: t("navbar.franchise"), path: "/franchise" },
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

  const changeLanguage = (lng: LangKey) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

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
                  {t("navbar.login")}
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 bg-[#B38A58] text-white rounded-full"
                >
                  {t("navbar.signup")}
                </button>
              </>
            ) : (
              <div className="relative">
                <button onClick={() => setIsUserOpen(!isUserOpen)}>
                  <User className={navColor} />
                </button>

                {isUserOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-md overflow-hidden text-[#3A3125]">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsUserOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {t("navbar.profile")}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/my-booking");
                        setIsUserOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {t("navbar.myBooking")}
                    </button>
                    <button
                      onClick={() => {
                        clearTokens();
                        navigate("/login");
                        setIsUserOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 border-t"
                    >
                      {t("navbar.logout")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LANGUAGE */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-2 border px-2 py-1 rounded-md transition ${
                  isHome && !isScrolled ? "border-white/30" : "border-gray-200"
                }`}
              >
                <img src={flagMap[currentLang]} className="w-5 h-3.5 object-cover rounded-sm" />
                <ChevronDown size={14} className={navColor} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg w-32 py-1 border overflow-hidden text-[#3A3125]">
                  {(Object.keys(flagMap) as LangKey[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => changeLanguage(code)}
                      className="flex items-center w-full px-3 py-2.5 hover:bg-gray-50 transition"
                    >
                      <img src={flagMap[code]} className="w-5 h-3.5 mr-3 object-cover rounded-sm" />
                      <span className="text-xs font-bold">{code === 'vi' ? 'Tiếng Việt' : 'English'}</span>
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
            <h2 className="text-lg font-semibold">{t("Menu")}</h2>
            <button onClick={() => setIsMenuOpen(false)}>
              <X />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {[...leftItems, ...rightItems].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-3 border-b text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-2.5 border rounded-xl text-sm font-bold"
                >
                  {t("navbar.login")}
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-2.5 bg-[#B38A58] text-white rounded-xl text-sm font-bold"
                >
                  {t("navbar.signup")}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 text-sm font-medium"
                >
                  {t("navbar.profile")}
                </button>
                <button
                  onClick={() => {
                    navigate("/my-booking");
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 text-sm font-medium"
                >
                  {t("navbar.myBooking")}
                </button>
                <button
                  onClick={() => {
                    clearTokens();
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 text-red-500 text-sm font-medium"
                >
                  {t("navbar.logout")}
                </button>
              </div>
            )}

            {/* Mobile Lang */}
            <div className="pt-6 border-t mt-6">
              <p className="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-widest">Language</p>
              <div className="flex gap-4">
                {(Object.keys(flagMap) as LangKey[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${
                      currentLang === code ? "border-primary bg-primary/5" : "border-gray-200"
                    }`}
                  >
                    <img src={flagMap[code]} className="w-5 h-3.5 object-cover rounded-sm" />
                    <span className="text-xs font-bold uppercase">{code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
