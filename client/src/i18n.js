import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en', // default language from localStorage
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Save language to localStorage when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
