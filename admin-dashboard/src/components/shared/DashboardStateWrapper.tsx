import React from 'react'
import { AlertTriangle, WifiOff, Inbox, ShieldAlert, RefreshCw } from 'lucide-react'

interface DashboardStateWrapperProps {
  isLoading?: boolean
  isError?: boolean
  error?: any
  isEmpty?: boolean
  hasPermission?: boolean
  onRetry?: () => void
  children: React.ReactNode
  loadingHeight?: string
  emptyMessage?: string
}

const DashboardStateWrapper: React.FC<DashboardStateWrapperProps> = ({
  isLoading = false,
  isError = false,
  error,
  isEmpty = false,
  hasPermission = true,
  onRetry,
  children,
  loadingHeight = 'h-48',
  emptyMessage = 'No data available.',
}) => {
  // 1. Permission Check
  if (!hasPermission) {
    return (
      <div className={`w-full ${loadingHeight} flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center`}>
        <ShieldAlert size={28} className="text-amber-500 mb-2" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Access Denied</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You do not have permission to view this widget.</p>
      </div>
    )
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className={`w-full ${loadingHeight} animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col justify-between`}>
        <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-1/3" />
        <div className="space-y-2 my-auto">
          <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-5/6" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-2/3" />
        </div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-1/4" />
      </div>
    )
  }

  // 3. Offline or Network Error
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine
  if (isOffline) {
    return (
      <div className={`w-full ${loadingHeight} flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center`}>
        <WifiOff size={28} className="text-slate-400 mb-2" />
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Internet Connection</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Please check your network connection.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={12} /> Retry
          </button>
        )}
      </div>
    )
  }

  // 4. Server Error State
  if (isError) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Server Error'
    return (
      <div className={`w-full ${loadingHeight} flex flex-col items-center justify-center p-6 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-900/30 text-center`}>
        <AlertTriangle size={28} className="text-red-500 mb-2" />
        <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">Unable to load data</h4>
        <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1 max-w-xs">{errorMsg}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={12} /> Retry
          </button>
        )}
      </div>
    )
  }

  // 5. Empty State
  if (isEmpty) {
    return (
      <div className={`w-full ${loadingHeight} flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-center`}>
        <Inbox size={28} className="text-slate-400 mb-2" />
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  return <>{children}</>
}

export default DashboardStateWrapper
