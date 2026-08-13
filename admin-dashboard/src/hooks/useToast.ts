import { useMemo } from 'react'
import { useToastStore } from '@/stores/toastStore'
import { translateString } from '@/lib/i18n'

export function useToast() {
  const addToast = useToastStore((s) => s.addToast)
  const removeToast = useToastStore((s) => s.removeToast)
  const clearToasts = useToastStore((s) => s.clearToasts)

  return useMemo(
    () => ({
      success: (message: string, duration?: number) => addToast('success', translateString(message), duration),
      error: (message: string, duration?: number) => addToast('error', translateString(message), duration),
      warning: (message: string, duration?: number) => addToast('warning', translateString(message), duration),
      info: (message: string, duration?: number) => addToast('info', translateString(message), duration),
      remove: (id: string) => removeToast(id),
      dismiss: (id?: string) => (id ? removeToast(id) : clearToasts()),
      clear: () => clearToasts(),
    }),
    [addToast, removeToast, clearToasts]
  )
}
