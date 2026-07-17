import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useThemeStore } from './themeStore'

interface User {
  id: number
  name: string
  email: string
  phone?: string | null
  avatar?: string | null
  roles: string[]
  permissions: string[]
  company?: { id: number; name: string; logo?: string | null; address?: string | null; city?: string | null; province?: string | null; country?: string | null } | null
  branch?: { id: number; name: string; address?: string | null } | null
}

interface AuthState {
  user:        User | null
  token:       string | null
  isLoggedIn:  boolean
  darkMode:    boolean
  setAuth:     (user: User, token: string) => void
  updateUser:  (user: Partial<User>) => void
  logout:      () => void
  toggleDark:  () => void
  hasRole:     (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:       null,
      token:      null,
      isLoggedIn: false,
      darkMode:   false,

      setAuth: (user, token) => {
        set({ user, token, isLoggedIn: true })
      },

      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false })
      },

      toggleDark: () => {
        const dark = !get().darkMode
        set({ darkMode: dark })
        document.documentElement.classList.toggle('dark', dark)
        const themeStore = useThemeStore.getState()
        if ((dark && themeStore.themeMode !== 'dark') || (!dark && themeStore.themeMode !== 'light')) {
          themeStore.updateThemeMode(dark ? 'dark' : 'light')
        }
      },

      hasRole: (role) => {
        return get().user?.roles?.includes(role) ?? false
      },

      hasPermission: (permission) => {
        const user = get().user
        if (!user) return false
        if (user.roles?.includes('super_admin')) return true
        return user.permissions?.includes(permission) ?? false
      },
    }),
    {
      name:    'enterprise-pos-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user:      state.user,
        token:     state.token,
        isLoggedIn: state.isLoggedIn,
        darkMode:  state.darkMode,
      }),
    }
  )
)
