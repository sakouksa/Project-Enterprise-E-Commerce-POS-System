import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, User, Mail, Phone, Calendar, Award, DollarSign, MapPin, 
  CheckCircle2, ShoppingBag, FileText, Tag, Edit3, Shield, 
  ExternalLink, CreditCard, Clock, Building2, Copy, Check
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import { getAbsoluteImageUrl } from '@/utils/image'
import StatusBadge from '@/components/common/StatusBadge'
import api from '@/api/client'
import type { Customer } from '../types'

interface CustomerDetailDrawerProps {
  customer: Customer | null
  onClose: () => void
  openEditModal: (cust: Customer) => void
}

type TabKey = 'overview' | 'addresses' | 'orders' | 'notes'

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  customer,
  onClose,
  openEditModal,
}) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['customers', 'common'])
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Fetch full details (addresses, sales, group relations) when drawer is open
  const { data: fullCustomerData, isLoading } = useQuery({
    queryKey: ['customer-detail', customer?.id],
    queryFn: () => api.get(`/customers/${customer?.id}`).then(r => r.data.data),
    enabled: !!customer?.id,
  })

  const cust: Customer = fullCustomerData || customer

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  if (!customer) return null

  const tabs: { key: TabKey; label: string; icon: any; badge?: number }[] = [
    { key: 'overview', label: t('customers.tabOverview', 'Overview & Info'), icon: User },
    { 
      key: 'addresses', 
      label: t('customers.tabAddresses', 'Addresses'), 
      icon: MapPin, 
      badge: cust.addresses?.length || 0 
    },
    { 
      key: 'orders', 
      label: t('customers.tabOrders', 'Order History'), 
      icon: ShoppingBag, 
      badge: cust.sales?.length || cust.order_count || 0 
    },
    { key: 'notes', label: t('customers.tabNotes', 'Notes & System'), icon: FileText },
  ]

  const totalSpentNum = Number(cust.total_spent || 0)
  const loyaltyPointsNum = Number(cust.loyalty_points || 0)
  const orderCountNum = Number(cust.order_count || 0)
  const creditLimitNum = Number(cust.credit_limit || 0)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end print:static print:bg-transparent">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 print:hidden cursor-pointer" 
          onClick={onClose} 
        />
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="bg-card w-full max-w-2xl h-full shadow-2xl relative z-10 flex flex-col justify-between overflow-hidden border-l border-border print:static print:w-full print:p-0 print:shadow-none"
        >
          {/* HEADER BAR */}
          <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-muted/20 print:hidden shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <User size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {t('customers.profileDetails', 'Customer Profile Details')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-mono font-semibold border border-border/60">
                    CUST-#{String(cust.id).padStart(4, '0')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {cust.email || cust.phone || t('customers.standardGroup', 'Standard Client')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={onClose} 
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* HERO PROFILE BANNER */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-purple-500/5 border border-primary/20 shadow-2xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 text-primary font-bold text-2xl flex items-center justify-center border-2 border-primary/30 overflow-hidden shadow-xs">
                      {(() => {
                        const photoUrl = getAbsoluteImageUrl(cust.photo)
                        return photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={cust.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const parent = e.currentTarget.parentElement
                              if (parent && !parent.querySelector('.detail-cust-initial')) {
                                const span = document.createElement('span')
                                span.className = 'detail-cust-initial text-2xl font-bold text-primary'
                                span.innerText = cust.name[0]?.toUpperCase() || 'C'
                                parent.appendChild(span)
                              }
                            }}
                          />
                        ) : (
                          <span className="text-2xl font-black">{cust.name[0]?.toUpperCase() || 'C'}</span>
                        )
                      })()}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                      cust.is_active ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-rose-500 ring-2 ring-rose-500/20'
                    }`} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-extrabold text-foreground tracking-tight">{cust.name}</h2>
                      <StatusBadge status={cust.is_active} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/50">
                        <Tag size={12} className="text-primary" />
                        {cust.group?.name || t('customers.standardGroup', 'Standard Client')}
                        {cust.group?.discount_percent && Number(cust.group.discount_percent) > 0 
                          ? ` (${Number(cust.group.discount_percent)}% ${t('customers.discountOff', 'OFF')})` 
                          : ''}
                      </span>
                      {cust.created_at && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} />
                          {t('customers.memberSince', 'Member Since')}: {new Date(cust.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 KPI METRIC PILLS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-2xs hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('customers.lifetimeSpent', 'Total Spent')}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <DollarSign size={13} />
                  </div>
                </div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ${totalSpentNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-2xs hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('customers.totalOrdersCount', 'Total Orders')}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <ShoppingBag size={13} />
                  </div>
                </div>
                <div className="text-base font-black text-foreground font-mono">
                  {orderCountNum.toLocaleString('en-US')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-2xs hover:border-amber-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('customers.loyaltyRewards', 'Loyalty Points')}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Award size={13} />
                  </div>
                </div>
                <div className="text-base font-black text-amber-500 font-mono">
                  {loyaltyPointsNum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-card border border-border/80 shadow-2xs hover:border-purple-500/30 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('customers.creditFacility', 'Credit Limit')}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <CreditCard size={13} />
                  </div>
                </div>
                <div className="text-base font-black text-foreground font-mono">
                  ${creditLimitNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* TAB NAVIGATION PILLS */}
            <div className="flex items-center gap-1.5 border-b border-border pb-1 overflow-x-auto">
              {tabs.map((tItem) => {
                const Icon = tItem.icon
                const isActive = activeTab === tItem.key
                return (
                  <button
                    key={tItem.key}
                    type="button"
                    onClick={() => setActiveTab(tItem.key)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tItem.label}</span>
                    {tItem.badge !== undefined && tItem.badge > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {tItem.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* TAB 1: OVERVIEW & CONTACT */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-2xs space-y-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/60">
                    {t('customers.contactFinancialSummary', 'Contact & Demographic Details')}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="flex items-start justify-between p-2.5 rounded-xl bg-muted/25 border border-border/40">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                          <Mail size={11} /> {t('customers.email', 'Email Address')}
                        </span>
                        <p className="font-bold text-foreground break-all">{cust.email || '—'}</p>
                      </div>
                      {cust.email && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(cust.email!, 'email')}
                          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedKey === 'email' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      )}
                    </div>

                    <div className="flex items-start justify-between p-2.5 rounded-xl bg-muted/25 border border-border/40">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                          <Phone size={11} /> {t('customers.phone', 'Phone Number')}
                        </span>
                        <p className="font-bold text-foreground font-mono">{cust.phone || '—'}</p>
                      </div>
                      {cust.phone && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(cust.phone!, 'phone')}
                          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          title="Copy Phone"
                        >
                          {copiedKey === 'phone' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/25 border border-border/40 space-y-0.5">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <User size={11} /> {t('customers.gender', 'Gender')}
                      </span>
                      <p className="font-bold text-foreground capitalize">
                        {cust.gender ? t(`customers.gender${cust.gender.charAt(0).toUpperCase() + cust.gender.slice(1)}`, cust.gender) : '—'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/25 border border-border/40 space-y-0.5">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <Calendar size={11} /> {t('customers.birthDate', 'Birth Date')}
                      </span>
                      <p className="font-bold text-foreground">
                        {cust.birth_date ? new Date(cust.birth_date).toLocaleDateString() : '—'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/25 border border-border/40 space-y-0.5">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <Shield size={11} /> {t('customers.taxIdNumber', 'Tax ID (TIN)')}
                      </span>
                      <p className="font-bold text-foreground font-mono">{cust.tax_number || '—'}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-muted/25 border border-border/40 space-y-0.5">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <Building2 size={11} /> {t('customers.groupDiscountPercent', 'Group Discount Rate')}
                      </span>
                      <p className="font-bold text-primary font-mono">
                        {cust.group?.discount_percent ? `${cust.group.discount_percent}%` : '0%'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ADDRESSES */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {(!cust.addresses || cust.addresses.length === 0) ? (
                  <div className="p-8 text-center bg-muted/15 rounded-2xl border border-dashed border-border/80">
                    <MapPin size={28} className="mx-auto text-muted-foreground/60 mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {t('customers.noAddressesFound', 'No delivery addresses registered for this customer.')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cust.addresses.map((addr: any, idx: number) => (
                      <div
                        key={addr.id || idx}
                        className="p-4 rounded-xl bg-card border border-border/80 shadow-2xs hover:border-primary/40 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">{addr.label || `Address #${idx + 1}`}</span>
                            {addr.is_default && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                {t('customers.defaultAddressBadge', 'Default')}
                              </span>
                            )}
                          </div>
                          {addr.phone && (
                            <span className="text-[11px] font-mono text-muted-foreground">{addr.phone}</span>
                          )}
                        </div>

                        <p className="text-xs text-foreground font-medium">{addr.address || '—'}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                          {addr.city && <span>{addr.city}</span>}
                          {addr.province && <span>• {addr.province}</span>}
                          {addr.country && <span>• {addr.country}</span>}
                          {addr.postal_code && <span className="font-mono">({addr.postal_code})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {(!cust.sales || cust.sales.length === 0) ? (
                  <div className="p-8 text-center bg-muted/15 rounded-2xl border border-dashed border-border/80">
                    <ShoppingBag size={28} className="mx-auto text-muted-foreground/60 mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {t('customers.noOrdersFound', 'No purchase records found for this customer.')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cust.sales.map((sale: any) => (
                      <div
                        key={sale.id}
                        className="p-3.5 rounded-xl bg-card border border-border/80 shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground font-mono">
                              #{sale.invoice_number || `INV-${sale.id}`}
                            </span>
                            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                              sale.status === 'completed' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}>
                              {sale.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {sale.date ? new Date(sale.date).toLocaleDateString() : new Date(sale.created_at).toLocaleDateString()} • {sale.payment_method || 'Cash'}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                            ${Number(sale.grand_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {sale.items?.length || 1} {t('customers.itemsCount', 'items')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: NOTES & METADATA */}
            {activeTab === 'notes' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-2xs space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border/60">
                    {t('customers.internalNotes', 'Internal Notes & Special Preferences')}
                  </h4>
                  <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                    {cust.notes || '—'}
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border/80 p-4 shadow-2xs space-y-2.5 text-xs">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border/60">
                    {t('customers.systemMetadata', 'System Metadata')}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-muted-foreground">
                    <div>
                      <span className="text-[10px] uppercase font-semibold">{t('customers.createdAt', 'Registered On')}</span>
                      <p className="font-bold text-foreground mt-0.5">{cust.created_at ? new Date(cust.created_at).toLocaleString() : '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold">{t('customers.lastUpdated', 'Last Updated')}</span>
                      <p className="font-bold text-foreground mt-0.5">{cust.updated_at ? new Date(cust.updated_at).toLocaleString() : '—'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="px-6 py-4 border-t border-border/80 bg-muted/20 flex items-center justify-between gap-3 print:hidden shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-xl border border-border transition-colors cursor-pointer"
            >
              {t('customers.closeDrawer', 'Close Drawer')}
            </button>

            <button
              type="button"
              onClick={() => { onClose(); openEditModal(cust); }}
              className="px-5 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Edit3 size={13} />
              <span>{t('customers.editProfile', 'Edit Profile')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CustomerDetailDrawer
