import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureLanguageLoaded, buildActiveDict, translateString } from './lib/i18n'

const savedLanguage = localStorage.getItem('enterprise-pos-lang') || 'en'

const translateValue = (val: any): any => {
  if (typeof val === 'string') {
    return translateString(val)
  }
  if (Array.isArray(val)) {
    return val.map(translateValue)
  }
  return val
}

async function bootstrap() {
  // Wait until the saved language namespaces are fully fetched and loaded
  await ensureLanguageLoaded(savedLanguage)
  buildActiveDict()

  // Intercept React element creation to translate strings dynamically for all active non-English locales
  const origCreateElement = React.createElement;
  (React as any).createElement = function (type: any, props: any, ...children: any[]) {
    const currentLang = localStorage.getItem('enterprise-pos-lang') || 'en'
    if (currentLang !== 'en') {
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

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

bootstrap().catch(console.error)

