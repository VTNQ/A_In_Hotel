import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import vi from "./locales/vi.json";
import en from "./locales/en.json";
import { initReactI18next } from "react-i18next";
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
