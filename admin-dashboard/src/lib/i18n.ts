import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Vite's dynamic import.meta.glob to load namespace JSONs lazily
const locales = import.meta.glob('../locales/*/*.json')

export const namespaces = [
  'common', 'buttons', 'validation', 'messages', 'dashboard', 'products',
  'inventory', 'customers', 'suppliers', 'sales', 'purchases', 'employees',
  'settings', 'reports', 'auth', 'tables', 'forms', 'pagination', 'errors', 'empty',
  'confirm', 'deleteConfirm', 'finance', 'logs', 'marketing', 'mobile',
  'nav', 'pageContent', 'profile', 'reviews', 'toast', 'website'
]

// Expose runtime translation dictionaries for React.createElement interceptor
export let activeDict: Record<string, string> = {}
export let activeLowerDict: Record<string, string> = {}

function buildDictForNS(en: any, active: any) {
  if (typeof en === 'object' && en !== null && typeof active === 'object' && active !== null) {
    for (const key in en) {
      if (key in active) {
        const enVal = en[key]
        const activeVal = active[key]
        if (typeof enVal === 'string' && typeof activeVal === 'string') {
          const enTrimmed = enVal.trim()
          activeDict[enTrimmed] = activeVal
          activeLowerDict[enTrimmed.toLowerCase()] = activeVal
        } else if (typeof enVal === 'object' && typeof activeVal === 'object') {
          buildDictForNS(enVal, activeVal)
        }
      }
    }
  }
}

export function buildActiveDict() {
  const lng = i18n.language || 'en'
  activeDict = {}
  activeLowerDict = {}
  if (lng === 'en') return

  for (const ns of namespaces) {
    const enRes = i18n.getResourceBundle('en', ns) || {}
    const activeRes = i18n.getResourceBundle(lng, ns) || {}
    buildDictForNS(enRes, activeRes)
  }
}

export function translateString(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return text

  if (activeDict[trimmed]) {
    const lead = text.match(/^\s*/)?.[0] || ''
    const trail = text.match(/\s*$/)?.[0] || ''
    return lead + activeDict[trimmed] + trail
  }

  const lowerTrimmed = trimmed.toLowerCase()
  if (activeLowerDict[lowerTrimmed]) {
    const lead = text.match(/^\s*/)?.[0] || ''
    const trail = text.match(/\s*$/)?.[0] || ''
    return lead + activeLowerDict[lowerTrimmed] + trail
  }

  const matchPunct = trimmed.match(/^([\w\s\-&/\(\)\+]+)([:\?\.\!]+)$/)
  if (matchPunct) {
    const base = matchPunct[1].trim()
    const punct = matchPunct[2]
    if (activeDict[base]) {
      const lead = text.match(/^\s*/)?.[0] || ''
      const trail = text.match(/\s*$/)?.[0] || ''
      return lead + activeDict[base] + punct + trail
    }
    const lowerBase = base.toLowerCase()
    if (activeLowerDict[lowerBase]) {
      const lead = text.match(/^\s*/)?.[0] || ''
      const trail = text.match(/\s*$/)?.[0] || ''
      return lead + activeLowerDict[lowerBase] + punct + trail
    }
  }

  return text
}

export async function ensureLanguageLoaded(lng: string) {
  // Always load fallback language (en) as reference, plus requested language
  const langsToLoad = lng === 'en' ? ['en'] : ['en', lng]
  
  await Promise.all(
    langsToLoad.map(async (l) => {
      await Promise.all(
        namespaces.map(async (ns) => {
          if (i18n.hasResourceBundle(l, ns)) return
          const key = `../locales/${l}/${ns}.json`
          if (locales[key]) {
            try {
              const mod = await locales[key]() as { default: Record<string, any> }
              i18n.addResourceBundle(l, ns, mod.default, true, true)
            } catch (err) {
              console.error(`Failed to load locale file: ${key}`, err)
            }
          }
        })
      )
    })
  )
}

const savedLanguage = localStorage.getItem('enterprise-pos-lang') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {},
    lng: savedLanguage,
    fallbackLng: 'en',
    ns: namespaces,
    defaultNS: 'common',
    nsSeparator: '.',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n

