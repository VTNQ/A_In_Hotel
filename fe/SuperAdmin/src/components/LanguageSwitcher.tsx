import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLang = (lng: "vi" | "en") => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
        title="Language"
      >
        <Globe className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900 z-50">
          <button
            onClick={() => changeLang("vi")}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 ${
              i18n.language === "vi" ? "font-semibold text-indigo-600" : ""
            }`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            onClick={() => changeLang("en")}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 ${
              i18n.language === "en" ? "font-semibold text-indigo-600" : ""
            }`}
          >
            🇺🇸 English
          </button>
        </div>
      )}
    </div>
  );
}
