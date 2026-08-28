import React, { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

const ThemeSynchronizer: React.FC = () => {
  const customizer = useThemeStore()

  useEffect(() => {
    const root = document.documentElement

    // 1. Language-based Font dynamic configuration
    const activeFont =
      customizer.font.family !== 'Default'
        ? customizer.font.family
        : customizer.language === 'km'
        ? "'Kantumruy Pro'"
        : "'Inter'"

    root.style.setProperty('--font-sans', activeFont)
    root.style.setProperty('font-size', customizer.font.size)
    root.style.setProperty('font-weight', customizer.font.weight)
    root.style.setProperty('line-height', customizer.font.lineHeight)
    root.style.setProperty('letter-spacing', customizer.font.letterSpacing)

    // 2. Dark/Light/System Mode
    const isDark =
      customizer.themeMode === 'dark' ||
      (customizer.themeMode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    root.classList.toggle('dark', isDark)

    // 3. Primary Color & Fallbacks
    root.style.setProperty('--primary', hexToHsl(customizer.primaryColor))
    root.style.setProperty('--primary-foreground', isDark ? '222 47% 11%' : '210 40% 98%')

    // 4. Border Radii & Layout Settings
    root.style.setProperty('--radius', customizer.layout.cardRadius)
    root.style.setProperty('--table-radius', customizer.layout.tableRadius)
    root.style.setProperty('--button-radius', customizer.layout.buttonRadius)
    root.style.setProperty('--input-radius', customizer.layout.inputRadius)
    root.style.setProperty('--modal-radius', customizer.layout.modalRadius)
    root.style.setProperty('--drawer-radius', customizer.layout.drawerRadius)
    root.style.setProperty('--container-padding', customizer.layout.padding)

    // 5. Sidebar Styles
    root.style.setProperty('--sidebar-bg', customizer.sidebar.bgColor)
    root.style.setProperty('--sidebar-text', customizer.sidebar.textColor)
    root.style.setProperty('--sidebar-active-bg', customizer.sidebar.activeBgColor)
    root.style.setProperty('--sidebar-active-text', customizer.sidebar.activeTextColor)
    root.style.setProperty('--sidebar-hover-bg', customizer.sidebar.hoverBgColor)
    root.style.setProperty('--sidebar-hover-text', customizer.sidebar.hoverTextColor)
    root.style.setProperty('--sidebar-border', customizer.sidebar.borderColor)
    root.style.setProperty('--sidebar-width', `${customizer.sidebar.width}px`)
    root.style.setProperty('--sidebar-radius', customizer.sidebar.roundedStyle)

    // 6. Navbar Styles
    root.style.setProperty('--navbar-bg', hexToRgba(customizer.navbar.bgColor, customizer.navbar.transparency))
    root.style.setProperty('--navbar-text', customizer.navbar.textColor)
    root.style.setProperty('--navbar-border', customizer.navbar.borderColor)
    root.style.setProperty('--navbar-height', `${customizer.navbar.height}px`)

    // 7. Cards
    root.style.setProperty('--card-bg', customizer.card.bgColor)
    root.style.setProperty('--card-border', customizer.card.borderColor)

    // 8. Buttons
    root.style.setProperty('--btn-primary', hexToHsl(customizer.button.primaryColor))
    root.style.setProperty('--btn-secondary', hexToHsl(customizer.button.secondaryColor))
    root.style.setProperty('--btn-danger', hexToHsl(customizer.button.dangerColor))
    root.style.setProperty('--btn-success', hexToHsl(customizer.button.successColor))

    // 9. Tables
    root.style.setProperty('--table-header-bg', customizer.table.headerBgColor)
    root.style.setProperty('--table-header-text', customizer.table.headerTextColor)
    root.style.setProperty('--table-hover-bg', customizer.table.hoverBgColor)
    root.style.setProperty('--table-border', customizer.table.borderColor)

    // 10. Forms
    root.style.setProperty('--input-border', customizer.form.inputBorderColor)
    root.style.setProperty('--input-focus', hexToHsl(customizer.form.focusRingColor))
    root.style.setProperty('--label-weight', customizer.form.labelWeight)
    root.style.setProperty('--placeholder-color', customizer.form.placeholderColor)

  }, [customizer])

  return null
}

// Helpers to transform HEX color codes into HSL/RGBA strings for Tailwind configurations
function hexToHsl(hex: string): string {
  // Strip the hash if present
  hex = hex.replace(/^\s*#|\s*$/g, '')

  // Handle shorthand
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1')
  }

  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  const H = Math.round(h * 360)
  const S = Math.round(s * 100)
  const L = Math.round(l * 100)

  return `${H} ${S}% ${L}%`
}

function hexToRgba(hex: string, alpha: number): string {
  hex = hex.replace(/^\s*#|\s*$/g, '')
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1')
  }
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default ThemeSynchronizer
