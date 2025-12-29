import { Bell, Globe, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";


const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(nextLang);
    };
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
        <img src="/asset/avatar.png" className="w-8 h-8 rounded-full" />
      </div>
    </header>
  );
}
export default TopBar;