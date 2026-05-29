import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru.json';
import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ru: { common: ru }, en: { common: en }, ar: { common: ar }, fr: { common: fr } },
    fallbackLng: 'ru',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'htmlTag', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
    },
  });

export const supportedLangs = ['ru', 'en', 'ar', 'fr'] as const;
export type Lang = (typeof supportedLangs)[number];

export default i18n;
