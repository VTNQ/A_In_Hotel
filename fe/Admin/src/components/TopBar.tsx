import { Bell, ChevronDown, Globe, Menu, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProfile } from "../service/api/Authenticate";
import { File_URL } from "../setting/constant/app";
import { useNavigate } from "react-router-dom";

const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingAvatar(true);
        const response = await getProfile();
        setProfile(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingAvatar(false);
      }
    };
    fetchProfile();
  }, []);

  // Close dropdown when click outside
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const avatarUrl = profile?.image?.url ? File_URL + profile.image.url : null;
  const displayName = profile?.fullName || profile?.email || "User";
  return (
    <header className="flex items-center justify-between h-14 bg-white border-b border-gray-200 px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded hover:bg-gray-100"
      >
        <Menu />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100"
          title="Ngôn ngữ"
        >
          <Globe className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600 uppercase">
            {i18n.language}
          </span>
        </button>

        <Bell className="w-5 h-5 text-gray-600" />
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu((v) => !v)}
            className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1 hover:bg-gray-100 transition"
          >
            {/* Avatar */}
            <div className="relative w-8 h-8">
              {loadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
              )}

              {avatarUrl && !loadingAvatar ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    // fallback
                    setImageLoaded(true);
                  }}
                  className={`w-8 h-8 rounded-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : !loadingAvatar ? (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              ) : null}
            </div>

            {/* Name */}
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[180px] truncate">
              {displayName}
            </span>

            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown */}
          {openMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <button
                onClick={() => {
                  setOpenMenu(false);
                  navigate("/Dashboard/user/profile"); // ✅ đổi route theo project bạn
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[#EEF1FB] hover:text-[#6C80C2] transition"
              >
                {t("common.profile")}
              </button>

              <div className="h-px bg-gray-100" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
