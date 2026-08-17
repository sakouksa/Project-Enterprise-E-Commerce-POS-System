import { useMemo } from 'react'
import { useToastStore, type ToastOptions } from '@/stores/toastStore'
import { translateString } from '@/lib/i18n'

export type ToastParam = string | (Omit<ToastOptions, 'type'> & { message: string })

function normalizeToastOptions(param: ToastParam, type: 'success' | 'error' | 'warning' | 'info', duration?: number): ToastOptions {
  if (typeof param === 'string') {
    return {
      type,
      message: translateString(param),
      duration,
    }
  }
  return {
    ...param,
    type,
    title: param.title ? translateString(param.title) : undefined,
    message: translateString(param.message),
    description: param.description ? translateString(param.description) : undefined,
    duration: param.duration ?? duration,
  }
}

export function useToast() {
  const addToast = useToastStore((s) => s.addToast)
  const removeToast = useToastStore((s) => s.removeToast)
  const clearToasts = useToastStore((s) => s.clearToasts)

  return useMemo(
    () => ({
      success: (param: ToastParam, duration?: number) =>
        addToast(normalizeToastOptions(param, 'success', duration)),
      error: (param: ToastParam, duration?: number) =>
        addToast(normalizeToastOptions(param, 'error', duration)),
      warning: (param: ToastParam, duration?: number) =>
        addToast(normalizeToastOptions(param, 'warning', duration)),
      info: (param: ToastParam, duration?: number) =>
        addToast(normalizeToastOptions(param, 'info', duration)),
      custom: (options: ToastOptions) => addToast(options),
      remove: (id: string) => removeToast(id),
      dismiss: (id?: string) => (id ? removeToast(id) : clearToasts()),
      clear: () => clearToasts(),
    }),
    [addToast, removeToast, clearToasts]
  )
}

export default useToast
