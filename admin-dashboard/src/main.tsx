import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/i18n'
import enTranslation from './locales/en.json'
import kmTranslation from './locales/km.json'

// ─── Runtime i18n Interceptor ────────────────────────────────────────────────

const dict: Record<string, string> = {}
const lowerDict: Record<string, string> = {}

function buildDict(en: any, km: any) {
  if (typeof en === 'object' && en !== null && typeof km === 'object' && km !== null) {
    for (const key in en) {
      if (key in km) {
        const enVal = en[key]
        const kmVal = km[key]
        if (typeof enVal === 'string' && typeof kmVal === 'string') {
          const enTrimmed = enVal.trim()
          dict[enTrimmed] = kmVal
          lowerDict[enTrimmed.toLowerCase()] = kmVal
        } else if (typeof enVal === 'object' && typeof kmVal === 'object') {
          buildDict(enVal, kmVal)
        }
      }
    }
  }
}

// Build English -> Khmer dictionary dynamically
buildDict(enTranslation, kmTranslation)

function translateString(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return text

  // 1. Exact match lookup
  if (dict[trimmed]) {
    const lead = text.match(/^\s*/)?.[0] || ''
    const trail = text.match(/\s*$/)?.[0] || ''
    return lead + dict[trimmed] + trail
  }

  // 2. Case-insensitive lookup
  const lowerTrimmed = trimmed.toLowerCase()
  if (lowerDict[lowerTrimmed]) {
    const lead = text.match(/^\s*/)?.[0] || ''
    const trail = text.match(/\s*$/)?.[0] || ''
    return lead + lowerDict[lowerTrimmed] + trail
  }

  // 3. Strip trailing punctuation
  const matchPunct = trimmed.match(/^([\w\s\-&/\(\)\+]+)([:\?\.\!]+)$/)
  if (matchPunct) {
    const base = matchPunct[1].trim()
    const punct = matchPunct[2]
    if (dict[base]) {
      const lead = text.match(/^\s*/)?.[0] || ''
      const trail = text.match(/\s*$/)?.[0] || ''
      return lead + dict[base] + punct + trail
    }
    const lowerBase = base.toLowerCase()
    if (lowerDict[lowerBase]) {
      const lead = text.match(/^\s*/)?.[0] || ''
      const trail = text.match(/\s*$/)?.[0] || ''
      return lead + lowerDict[lowerBase] + punct + trail
    }
  }

  return text
}

const translateValue = (val: any): any => {
  if (typeof val === 'string') {
    return translateString(val)
  }
  if (Array.isArray(val)) {
    return val.map(translateValue)
  }
  return val
}

// Intercept React element creation to translate strings dynamically
const origCreateElement = React.createElement;
(React as any).createElement = function (type: any, props: any, ...children: any[]) {
  const currentLang = localStorage.getItem('enterprise-pos-lang') || 'en'
  if (currentLang === 'km') {
    if (props && typeof props === 'object') {
      const propsToTranslate = [
        'placeholder', 'title', 'label', 'description', 'alt',
        'confirmText', 'cancelText', 'subtitle', 'message', 'text'
      ]
      props = { ...props }
      for (const key of propsToTranslate) {
        if (typeof props[key] === 'string') {
          props[key] = translateString(props[key])
        }
      }
      if (Array.isArray(props.items)) {
        props.items = props.items.map((item: any) => {
          if (item && typeof item === 'object') {
            const newItem = { ...item }
            if (typeof item.label === 'string') {
              newItem.label = translateString(item.label)
            }
            if (typeof item.title === 'string') {
              newItem.title = translateString(item.title)
            }
            return newItem
          }
          return item
        })
      }
      if (props.children !== undefined) {
        props.children = translateValue(props.children)
      }
    }
    if (children.length > 0) {
      children = children.map(translateValue)
    }
  }
  return origCreateElement.call(React, type, props, ...children)
}

// ─── Render ──────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
