import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ShoppingBag, ShoppingCart, ShieldAlert, User, Cpu, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface NotificationItem {
  id: number
  type: 'purchase' | 'sale' | 'low_stock' | 'order' | 'customer' | 'system'
  title: string
  message: string
  time: string
  unread: boolean
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'JBL Laptop 2 is below minimum threshold (8 left).',
    time: '2 mins ago',
    unread: true,
  },
  {
    id: 2,
    type: 'purchase',
    title: 'PO Received',
    message: 'Purchase Order #PO-20260718-9407 has been received successfully.',
    time: '15 mins ago',
    unread: true,
  },
  {
    id: 3,
    type: 'sale',
    title: 'New Sale Completed',
    message: 'Sale #SO-9831 completed for Rp 1,438,000.',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: 4,
    type: 'customer',
    title: 'New Customer Registered',
    message: 'Customer Ly Socheat registered via web portal.',
    time: '3 hours ago',
    unread: false,
  },
  {
    id: 5,
    type: 'system',
    title: 'System Backup Completed',
    message: 'Database backup stored to secure cloud vault.',
    time: '12 hours ago',
    unread: false,
  },
]

const NotificationDropdown: React.FC = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const handleMarkSingleRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />
      case 'sale':
      case 'order':
        return <ShoppingCart className="w-4 h-4 text-blue-500" />
      case 'low_stock':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />
      case 'customer':
        return <User className="w-4 h-4 text-purple-500" />
      case 'system':
      default:
        return <Cpu className="w-4 h-4 text-amber-500" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/30 transition-all duration-200 relative"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-card animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-xl z-50 p-1.5 backdrop-blur-md flex flex-col"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
              <span className="text-xs font-bold text-foreground">
                {t('common.notifications', 'Notifications')}
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {unreadCount} new
                  </span>
                )}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-primary hover:text-primary/80 font-bold transition-colors"
                >
                  {t('common.mark_all_read', 'Mark all read')}
                </button>
              )}
            </div>

            <div className="divide-y divide-border/50 max-h-80 overflow-y-auto no-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {t('common.no_notifications', 'No notifications')}
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleMarkSingleRead(n.id)}
                    className={`w-full flex items-start gap-3 p-3 text-left transition-all duration-150 rounded-xl mt-0.5
                      ${n.unread ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/40'}`}
                  >
                    <div className="p-2 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-foreground truncate">{n.title}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    {n.unread && (
                      <Circle className="w-2 h-2 text-primary fill-primary mt-1.5 flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="border-t border-border/50 mt-1 pt-1.5 text-center">
              <button className="w-full py-1 text-[11px] text-muted-foreground hover:text-foreground font-bold transition-colors">
                {t('common.view_all_notifications', 'View All Notifications')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationDropdown
