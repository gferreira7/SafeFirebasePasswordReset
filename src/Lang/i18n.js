// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import en from "./locales/en.json";
import pt from "./locales/pt.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    returnObjects: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: en,
      pt: pt,
      fr: fr,
      es: es,
      de: de,
    },
    lng: navigator.language || "en",
  });

export default i18n;
