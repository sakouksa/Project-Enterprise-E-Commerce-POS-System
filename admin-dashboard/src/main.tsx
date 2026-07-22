import React from 'react'
import ReactDOM from 'react-dom/client'
import * as jsxDevRuntime from 'react/jsx-dev-runtime'
import * as jsxRuntime from 'react/jsx-runtime'
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

const translateProps = (props: any): any => {
  const currentLang = localStorage.getItem('enterprise-pos-lang') || 'en'
  if (currentLang === 'en' || !props || typeof props !== 'object') return props

  const newProps = { ...props }
  const propsToTranslate = [
    'placeholder', 'title', 'label', 'description', 'alt',
    'confirmText', 'cancelText', 'subtitle', 'message', 'text'
  ]
  for (const key of propsToTranslate) {
    if (typeof newProps[key] === 'string') {
      newProps[key] = translateString(newProps[key])
    }
  }
  if (Array.isArray(newProps.items)) {
    newProps.items = newProps.items.map((item: any) => {
      if (item && typeof item === 'object') {
        const newItem = { ...item }
        if (typeof item.label === 'string') newItem.label = translateString(item.label)
        if (typeof item.title === 'string') newItem.title = translateString(item.title)
        return newItem
      }
      return item
    })
  }
  if (newProps.children !== undefined) {
    newProps.children = translateValue(newProps.children)
  }
  return newProps
}

async function bootstrap() {
  await ensureLanguageLoaded(savedLanguage)
  buildActiveDict()

  // Intercept React JSX Runtime (Vite + React 19)
  const origJsxDev = (jsxDevRuntime as any).jsxDEV
  if (origJsxDev) {
    ;(jsxDevRuntime as any).jsxDEV = function (type: any, props: any, key: any, isStatic: any, source: any, self: any) {
      return origJsxDev.call(this, type, translateProps(props), key, isStatic, source, self)
    }
  }

  const origJsx = (jsxRuntime as any).jsx
  if (origJsx) {
    ;(jsxRuntime as any).jsx = function (type: any, props: any, key: any) {
      return origJsx.call(this, type, translateProps(props), key)
    }
  }

  const origJsxs = (jsxRuntime as any).jsxs
  if (origJsxs) {
    ;(jsxRuntime as any).jsxs = function (type: any, props: any, key: any) {
      return origJsxs.call(this, type, translateProps(props), key)
    }
  }

  const origCreateElement = React.createElement
  ;(React as any).createElement = function (type: any, props: any, ...children: any[]) {
    const currentLang = localStorage.getItem('enterprise-pos-lang') || 'en'
    if (currentLang !== 'en') {
      props = translateProps(props)
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
