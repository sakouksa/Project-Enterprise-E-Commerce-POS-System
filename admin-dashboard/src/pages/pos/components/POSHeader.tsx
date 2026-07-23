import React, { useState, useEffect } from 'react'
import { Store, Building2, Warehouse, Monitor, Clock, Wifi, WifiOff, User, ShieldCheck } from 'lucide-react'
import { ModernSelect } from './ModernSelect'

interface POSHeaderProps {
  selectedStore: string
  setSelectedStore: (v: string) => void
  selectedBranch: string
  setSelectedBranch: (v: string) => void
  selectedWarehouse: string
  setSelectedWarehouse: (v: string) => void
  cashRegister: string
  currentShift: string
}

export const POSHeader: React.FC<POSHeaderProps> = ({
  selectedStore,
  setSelectedStore,
  selectedBranch,
  setSelectedBranch,
  selectedWarehouse,
  setSelectedWarehouse,
  cashRegister,
  currentShift,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString())
  const [dateStr, setDateStr] = useState(new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }))

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const timer = setInterval(() => {
      const now = new Date()
      setTimeStr(now.toLocaleTimeString())
      setDateStr(now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }))
    }, 1000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs backdrop-blur-md space-y-3">
      {/* Top Meta info & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-0.5">
            <span>Sales & Operations</span>
            <span>/</span>
            <span className="text-primary font-semibold">POS Terminal</span>
          </div>
          <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
            Enterprise POS Terminal
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck size={12} /> Active Shift
            </span>
          </h1>
        </div>

        {/* Live Status & Clock */}
        <div className="flex items-center gap-3">
          {/* Network Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400'
              : 'bg-rose-500/10 text-rose-600 border-rose-500/30 dark:text-rose-400'
          }`}>
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Wifi size={13} /> Online Terminal
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <WifiOff size={13} /> Offline Ready
              </>
            )}
          </div>

          {/* Clock & Date */}
          <div className="hidden sm:flex items-center gap-2 bg-muted/40 border border-border/60 px-3 py-1.5 rounded-xl text-xs font-medium text-foreground">
            <Clock size={14} className="text-primary" />
            <span>{dateStr}</span>
            <span className="font-bold text-primary">{timeStr}</span>
          </div>

          {/* Cashier Badge */}
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary">
            <User size={14} />
            <span>Cashier Admin</span>
          </div>
        </div>
      </div>

      {/* Selectors Bar: Store, Branch, Warehouse, Register */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="flex items-center gap-2 bg-muted/30 border border-border/60 rounded-xl px-2.5 py-1.5">
          <Store size={14} className="text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground block leading-tight font-medium">Store</span>
            <ModernSelect
              value={selectedStore}
              onChange={setSelectedStore}
              options={[
                { value: 'Main Store #1', label: 'Main Store #1' },
                { value: 'Flagship Outlet', label: 'Flagship Outlet' },
                { value: 'Online POS Hub', label: 'Online POS Hub' },
              ]}
              buttonClassName="border-none bg-transparent p-0 shadow-none text-xs font-bold text-foreground hover:bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 border border-border/60 rounded-xl px-2.5 py-1.5">
          <Building2 size={14} className="text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground block leading-tight font-medium">Branch</span>
            <ModernSelect
              value={selectedBranch}
              onChange={setSelectedBranch}
              options={[
                { value: 'Phnom Penh HQ', label: 'Phnom Penh HQ' },
                { value: 'Siem Reap Branch', label: 'Siem Reap Branch' },
                { value: 'Battambang Branch', label: 'Battambang Branch' },
              ]}
              buttonClassName="border-none bg-transparent p-0 shadow-none text-xs font-bold text-foreground hover:bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 border border-border/60 rounded-xl px-2.5 py-1.5">
          <Warehouse size={14} className="text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground block leading-tight font-medium">Warehouse</span>
            <ModernSelect
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              options={[
                { value: 'Central Warehouse', label: 'Central Warehouse' },
                { value: 'Retail Storage A', label: 'Retail Storage A' },
                { value: 'Express Warehouse', label: 'Express Warehouse' },
              ]}
              buttonClassName="border-none bg-transparent p-0 shadow-none text-xs font-bold text-foreground hover:bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-muted/30 border border-border/60 rounded-xl px-2.5 py-1.5">
          <Monitor size={14} className="text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground block leading-tight font-medium">Register & Shift</span>
            <div className="font-bold text-foreground truncate">{cashRegister} • {currentShift}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
