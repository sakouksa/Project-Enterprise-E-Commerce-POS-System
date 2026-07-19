import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import i18n, { ensureLanguageLoaded, buildActiveDict } from '../lib/i18n'
import { useAuthStore } from './authStore'


export interface FontConfig {
  family: string
  size: string
  weight: string
  lineHeight: string
  letterSpacing: string
}

export interface SidebarConfig {
  bgColor: string
  textColor: string
  activeBgColor: string
  activeTextColor: string
  hoverBgColor: string
  hoverTextColor: string
  borderColor: string
  width: number
  compact: boolean
  collapsed: boolean
  roundedStyle: string
}

export interface NavbarConfig {
  bgColor: string
  textColor: string
  borderColor: string
  shadow: 'none' | 'sm' | 'md' | 'lg'
  transparency: number // opacity value from 0 to 1
  height: number // in px
}

export interface LayoutConfig {
  contentWidth: 'full' | 'boxed'
  padding: string
  cardRadius: string
  tableRadius: string
  buttonRadius: string
  inputRadius: string
  modalRadius: string
  drawerRadius: string
}

export interface CardConfig {
  bgColor: string
  borderColor: string
  shadow: 'none' | 'sm' | 'md' | 'lg'
  radius: string
  hoverEffect: boolean
}

export interface ButtonConfig {
  primaryColor: string
  secondaryColor: string
  dangerColor: string
  successColor: string
  radius: string
  size: 'sm' | 'md' | 'lg'
  hoverAnimation: boolean
}

export interface TableConfig {
  rowHeight: 'compact' | 'comfortable' | 'spacious'
  headerBgColor: string
  headerTextColor: string
  zebraRows: boolean
  hoverBgColor: string
  borderColor: string
  density: 'compact' | 'comfortable' | 'spacious'
}

export interface FormConfig {
  inputRadius: string
  inputBorderColor: string
  focusRingColor: string
  labelWeight: string
  placeholderColor: string
}

export interface IconConfig {
  size: number
  style: 'stroke' | 'fill'
  color: string
}

export interface WidgetConfig {
  id: string
  visible: boolean
  size: 'small' | 'medium' | 'large'
  order: number
}

interface ThemeState {
  // Theme Mode
  themeMode: 'light' | 'dark' | 'system'
  language: 'en' | 'km' | 'th' | 'vi' | 'zh'
  primaryColor: string
  
  // Custom configurations
  font: FontConfig
  sidebar: SidebarConfig
  navbar: NavbarConfig
  layout: LayoutConfig
  card: CardConfig
  button: ButtonConfig
  table: TableConfig
  form: FormConfig
  icon: IconConfig
  widgetsList: WidgetConfig[]

  // Action methods
  setLanguage: (lang: 'en' | 'km' | 'th' | 'vi' | 'zh') => void
  updateThemeMode: (mode: 'light' | 'dark' | 'system') => void
  updatePrimaryColor: (color: string) => void
  updateFont: (config: Partial<FontConfig>) => void
  updateSidebar: (config: Partial<SidebarConfig>) => void
  updateNavbar: (config: Partial<NavbarConfig>) => void
  updateLayout: (config: Partial<LayoutConfig>) => void
  updateCard: (config: Partial<CardConfig>) => void
  updateButton: (config: Partial<ButtonConfig>) => void
  updateTable: (config: Partial<TableConfig>) => void
  updateForm: (config: Partial<FormConfig>) => void
  updateIcon: (config: Partial<IconConfig>) => void
  updateWidgetsList: (widgets: WidgetConfig[]) => void
  resetAll: () => void
}

const defaultWidgets: WidgetConfig[] = [
  { id: 'today_sales', visible: true, size: 'medium', order: 0 },
  { id: 'today_orders', visible: true, size: 'medium', order: 1 },
  { id: 'total_customers', visible: true, size: 'medium', order: 2 },
  { id: 'total_products', visible: true, size: 'medium', order: 3 },
  { id: 'sales_overview', visible: true, size: 'large', order: 4 },
  { id: 'category_sales', visible: true, size: 'medium', order: 5 },
  { id: 'recent_orders', visible: true, size: 'large', order: 6 },
  { id: 'low_stock', visible: true, size: 'large', order: 7 },
]

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: 'light',
      language: (localStorage.getItem('enterprise-pos-lang') as 'en' | 'km' | 'th' | 'vi' | 'zh') || 'en',
      primaryColor: '#3b82f6',

      font: {
        family: 'Default',
        size: '14px',
        weight: '400',
        lineHeight: '1.5',
        letterSpacing: '0px',
      },

      sidebar: {
        bgColor: '#0f172a',
        textColor: '#94a3b8',
        activeBgColor: '#2563eb',
        activeTextColor: '#ffffff',
        hoverBgColor: '#1e293b',
        hoverTextColor: '#ffffff',
        borderColor: '#1e293b',
        width: 256,
        compact: false,
        collapsed: false,
        roundedStyle: '0.5rem',
      },

      navbar: {
        bgColor: '#ffffff',
        textColor: '#0f172a',
        borderColor: '#e2e8f0',
        shadow: 'sm',
        transparency: 1,
        height: 64,
      },

      layout: {
        contentWidth: 'full',
        padding: '1.5rem',
        cardRadius: '0.75rem',
        tableRadius: '0.5rem',
        buttonRadius: '0.5rem',
        inputRadius: '0.5rem',
        modalRadius: '0.75rem',
        drawerRadius: '0.75rem',
      },

      card: {
        bgColor: '#ffffff',
        borderColor: '#e2e8f0',
        shadow: 'sm',
        radius: '0.75rem',
        hoverEffect: true,
      },

      button: {
        primaryColor: '#3b82f6',
        secondaryColor: '#64748b',
        dangerColor: '#ef4444',
        successColor: '#10b981',
        radius: '0.5rem',
        size: 'md',
        hoverAnimation: true,
      },

      table: {
        rowHeight: 'comfortable',
        headerBgColor: '#f8fafc',
        headerTextColor: '#475569',
        zebraRows: true,
        hoverBgColor: '#f1f5f9',
        borderColor: '#e2e8f0',
        density: 'comfortable',
      },

      form: {
        inputRadius: '0.5rem',
        inputBorderColor: '#cbd5e1',
        focusRingColor: '#3b82f6',
        labelWeight: '500',
        placeholderColor: '#94a3b8',
      },

      icon: {
        size: 18,
        style: 'stroke',
        color: '#64748b',
      },

      widgetsList: defaultWidgets,

      setLanguage: async (lang) => {
        await ensureLanguageLoaded(lang)
        localStorage.setItem('enterprise-pos-lang', lang)
        await i18n.changeLanguage(lang)
        buildActiveDict()
        set({ language: lang })
      },

      updateThemeMode: (mode) => {
        set({ themeMode: mode })
        const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        const authStore = useAuthStore.getState()
        if (authStore.darkMode !== isDark) {
          useAuthStore.setState({ darkMode: isDark })
        }
        document.documentElement.classList.toggle('dark', isDark)
      },
      updatePrimaryColor: (color) => set({ primaryColor: color }),
      updateFont: (config) => set((s) => ({ font: { ...s.font, ...config } })),
      updateSidebar: (config) => set((s) => ({ sidebar: { ...s.sidebar, ...config } })),
      updateNavbar: (config) => set((s) => ({ navbar: { ...s.navbar, ...config } })),
      updateLayout: (config) => set((s) => ({ layout: { ...s.layout, ...config } })),
      updateCard: (config) => set((s) => ({ card: { ...s.card, ...config } })),
      updateButton: (config) => set((s) => ({ button: { ...s.button, ...config } })),
      updateTable: (config) => set((s) => ({ table: { ...s.table, ...config } })),
      updateForm: (config) => set((s) => ({ form: { ...s.form, ...config } })),
      updateIcon: (config) => set((s) => ({ icon: { ...s.icon, ...config } })),
      updateWidgetsList: (widgets) => set({ widgetsList: widgets }),

      resetAll: () => set({
        themeMode: 'light',
        primaryColor: '#3b82f6',
        font: {
          family: 'Default',
          size: '14px',
          weight: '400',
          lineHeight: '1.5',
          letterSpacing: '0px',
        },
        sidebar: {
          bgColor: '#0f172a',
          textColor: '#94a3b8',
          activeBgColor: '#2563eb',
          activeTextColor: '#ffffff',
          hoverBgColor: '#1e293b',
          hoverTextColor: '#ffffff',
          borderColor: '#1e293b',
          width: 256,
          compact: false,
          collapsed: false,
          roundedStyle: '0.5rem',
        },
        navbar: {
          bgColor: '#ffffff',
          textColor: '#0f172a',
          borderColor: '#e2e8f0',
          shadow: 'sm',
          transparency: 1,
          height: 64,
        },
        layout: {
          contentWidth: 'full',
          padding: '1.5rem',
          cardRadius: '0.75rem',
          tableRadius: '0.5rem',
          buttonRadius: '0.5rem',
          inputRadius: '0.5rem',
          modalRadius: '0.75rem',
          drawerRadius: '0.75rem',
        },
        card: {
          bgColor: '#ffffff',
          borderColor: '#e2e8f0',
          shadow: 'sm',
          radius: '0.75rem',
          hoverEffect: true,
        },
        button: {
          primaryColor: '#3b82f6',
          secondaryColor: '#64748b',
          dangerColor: '#ef4444',
          successColor: '#10b981',
          radius: '0.5rem',
          size: 'md',
          hoverAnimation: true,
        },
        table: {
          rowHeight: 'comfortable',
          headerBgColor: '#f8fafc',
          headerTextColor: '#475569',
          zebraRows: true,
          hoverBgColor: '#f1f5f9',
          borderColor: '#e2e8f0',
          density: 'comfortable',
        },
        form: {
          inputRadius: '0.5rem',
          inputBorderColor: '#cbd5e1',
          focusRingColor: '#3b82f6',
          labelWeight: '500',
          placeholderColor: '#94a3b8',
        },
        icon: {
          size: 18,
          style: 'stroke',
          color: '#64748b',
        },
        widgetsList: defaultWidgets,
      }),
    }),
    {
      name: 'enterprise-pos-customizer',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
