import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from '../locales/en.json'
import kmTranslation from '../locales/km.json'

const savedLanguage = localStorage.getItem('enterprise-pos-lang') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      km: { translation: kmTranslation },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
