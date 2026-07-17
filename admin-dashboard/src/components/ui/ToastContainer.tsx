import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'
import type { Toast } from '@/stores/toastStore'

const TOAST_THEMES = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/30',
    text: 'text-emerald-800 dark:text-emerald-400',
    icon: <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />,
    progress: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-800/30',
    text: 'text-rose-800 dark:text-rose-400',
    icon: <AlertCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />,
    progress: 'bg-rose-500',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/30',
    text: 'text-amber-800 dark:text-amber-400',
    icon: <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" />,
    progress: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-800/30',
    text: 'text-blue-800 dark:text-blue-400',
    icon: <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />,
    progress: 'bg-blue-500',
  },
}

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const removeToast = useToastStore((s) => s.removeToast)
  const theme = TOAST_THEMES[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col w-80 md:w-96 rounded-xl border p-4 shadow-xl backdrop-blur-md relative overflow-hidden ${theme.bg}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {theme.icon}
          <p className={`text-sm font-semibold leading-normal ${theme.text}`}>
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-muted-foreground hover:text-foreground transition-colors -mt-0.5"
        >
          <X size={15} />
        </button>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration ?? 4000) / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-0.5 ${theme.progress}`}
      />
    </motion.div>
  )
}

const ToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ToastContainer
