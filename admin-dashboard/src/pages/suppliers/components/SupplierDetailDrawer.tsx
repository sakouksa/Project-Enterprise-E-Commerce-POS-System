import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Mail, Phone, MapPin, Truck, Edit2, Copy, Check,
  CreditCard, FileText, User, ExternalLink, Globe,
  Building2, ShieldCheck, Printer, Calendar
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAbsoluteImageUrl } from '@/utils/image'
import api from '@/api/client'
import type { Supplier } from '../types/supplier.types'

interface SupplierDetailDrawerProps {
  supplier: Supplier | null
  onClose: () => void
  onOpenEdit: (s: Supplier) => void
}

type TabKey = 'overview' | 'banking' | 'contacts' | 'terms'

export const SupplierDetailDrawer: React.FC<SupplierDetailDrawerProps> = ({
  supplier,
  onClose,
  onOpenEdit,
}) => {
  const { t } = useTranslation(['suppliers', 'common', 'nav'])
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Fetch full details whenever drawer opens for a supplier
  const { data: fullSupplierData, isLoading } = useQuery({
    queryKey: ['supplier-detail', supplier?.id],
    queryFn: async () => {
      const res = await api.get(`/suppliers/${supplier?.id}`)
      return res.data?.data as Supplier
    },
    enabled: !!supplier?.id,
    staleTime: 30000,
  })

  const supp: Supplier | null = fullSupplierData || supplier

  const handleCopy = (text: string, key: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  if (!supplier) return null

  const tabs: { key: TabKey; label: string; icon: React.FC<{ size?: number; className?: string }>; badge?: number }[] = [
    {
      key: 'overview',
      label: t('suppliers.tabGeneral', 'ព័ត៌មានទូទៅ & ទំនាក់ទំនង'),
      icon: Building2,
    },
    {
      key: 'banking',
      label: t('suppliers.tabBanking', 'ធនាគារ & ហិរញ្ញវត្ថុ'),
      icon: CreditCard,
    },
    {
      key: 'contacts',
      label: t('suppliers.tabRepresentatives', 'តំណាងផ្គត់ផ្គង់'),
      icon: User,
      badge: supp?.contacts?.length || 0,
    },
    {
      key: 'terms',
      label: t('suppliers.tabTerms', 'កំណត់ចំណាំ & កិច្ចសន្យា'),
      icon: FileText,
    },
  ]

  return (
    <AnimatePresence mode="wait">
      {supp && (
        <div key={`supplier-drawer-${supp.id}`} className="fixed inset-0 z-50 overflow-hidden print:static">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer print:hidden"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 print:static print:pl-0">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="bg-card w-screen max-w-2xl border-l border-border h-full flex flex-col shadow-2xl overflow-hidden print:border-none print:w-full print:shadow-none"
            >
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-muted/20 print:hidden shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shadow-2xs shrink-0">
                    <Truck size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-foreground truncate max-w-[260px] sm:max-w-md">
                        {supp.name}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${
                          supp.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${supp.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                        {supp.is_active ? t('suppliers.active', 'សកម្ម') : t('suppliers.inactive', 'អសកម្ម')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-mono">
                      <span>{supp.code}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(supp.code, 'code')}
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title={t('common.copy', 'ចម្លងកូដ')}
                      >
                        {copiedKey === 'code' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title={t('common.close', 'បិទ')}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 px-6 border-b border-border/80 bg-muted/10 overflow-x-auto no-scrollbar shrink-0 print:hidden">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 py-3 px-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon size={15} />
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* HERO SUMMARY CARD */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-purple-500/5 border border-primary/20 shadow-2xs relative overflow-hidden space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative shrink-0">
                        {supp.logo ? (
                          <img
                            src={getAbsoluteImageUrl(supp.logo)}
                            alt={supp.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/30 shadow-xs bg-white"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-black text-2xl flex items-center justify-center border-2 border-primary/30 shadow-xs">
                            {supp.name ? supp.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-base text-foreground truncate">{supp.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                          {supp.code}
                        </p>
                        {supp.tax_number && (
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            {t('suppliers.taxNumber', 'លេខសារពើពន្ធ')}: <strong className="text-foreground font-semibold">{supp.tax_number}</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const target = supp
                          onClose()
                          onOpenEdit(target)
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <Edit2 size={13} />
                        <span>{t('common.edit', 'កែសម្រួល')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Badges / Pill Tags */}
                  <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border/40">
                    {supp.currency && (
                      <span className="px-2.5 py-1 rounded-lg bg-background/80 border border-border/80 text-[11px] font-bold text-foreground flex items-center gap-1">
                        <CreditCard size={12} className="text-primary" />
                        <span>{supp.currency}</span>
                      </span>
                    )}
                    {supp.payment_terms && (
                      <span className="px-2.5 py-1 rounded-lg bg-background/80 border border-border/80 text-[11px] font-bold text-foreground flex items-center gap-1">
                        <Calendar size={12} className="text-emerald-500" />
                        <span>{supp.payment_terms}</span>
                      </span>
                    )}
                    {supp.supplier_type && (
                      <span className="px-2.5 py-1 rounded-lg bg-background/80 border border-border/80 text-[11px] font-bold text-primary capitalize">
                        {supp.supplier_type.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* ─── TAB 1: OVERVIEW & CONTACT ─── */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* General Specifications Grid */}
                    <div className="p-4 bg-card rounded-2xl border border-border/80 shadow-2xs space-y-3">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Building2 size={14} className="text-primary" />
                        {t('suppliers.tabGeneral', 'ព័ត៌មានទូទៅនៃក្រុមហ៊ុន')}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                          <span className="text-[10px] text-muted-foreground block font-semibold">{t('suppliers.name', 'ឈ្មោះក្រុមហ៊ុន')}</span>
                          <span className="font-bold text-foreground text-xs block mt-0.5">{supp.name || '—'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                          <span className="text-[10px] text-muted-foreground block font-semibold">{t('suppliers.code', 'កូដសម្គាល់')}</span>
                          <span className="font-mono font-bold text-foreground text-xs block mt-0.5">{supp.code || '—'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                          <span className="text-[10px] text-muted-foreground block font-semibold">{t('suppliers.taxNumber', 'លេខសារពើពន្ធ')}</span>
                          <span className="font-mono font-bold text-foreground text-xs block mt-0.5">{supp.tax_number || '—'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                          <span className="text-[10px] text-muted-foreground block font-semibold">{t('suppliers.status', 'ស្ថានភាពប្រតិបត្តិការ')}</span>
                          <span className={`font-bold text-xs block mt-0.5 ${supp.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                            {supp.is_active ? t('suppliers.active', 'សកម្ម') : t('suppliers.inactive', 'អសកម្ម')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Official Channels */}
                    <div className="p-4 bg-card rounded-2xl border border-border/80 shadow-2xs space-y-3">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <Mail size={14} className="text-emerald-500" />
                        {t('suppliers.tabContact', 'បណ្តាញទំនាក់ទំនងផ្លូវការ')}
                      </span>

                      <div className="grid grid-cols-1 gap-2.5">
                        {supp.email && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                            <div className="flex items-center gap-2.5 text-foreground min-w-0">
                              <Mail size={14} className="text-muted-foreground shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] text-muted-foreground block">{t('suppliers.email', 'អ៊ីមែលចម្បង')}</span>
                                <span className="font-medium text-xs truncate block">{supp.email}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(supp.email || '', 'email')}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                              title={t('common.copy', 'ចម្លង')}
                            >
                              {copiedKey === 'email' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          </div>
                        )}

                        {supp.phone && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                            <div className="flex items-center gap-2.5 text-foreground min-w-0">
                              <Phone size={14} className="text-muted-foreground shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] text-muted-foreground block">{t('suppliers.phone', 'លេខទូរស័ព្ទ')}</span>
                                <span className="font-mono font-medium text-xs block">{supp.phone}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(supp.phone || '', 'phone')}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                              title={t('common.copy', 'ចម្លង')}
                            >
                              {copiedKey === 'phone' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          </div>
                        )}

                        {supp.fax && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                            <div className="flex items-center gap-2.5 text-foreground min-w-0">
                              <Printer size={14} className="text-muted-foreground shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] text-muted-foreground block">{t('suppliers.fax', 'លេខទូរសារ')}</span>
                                <span className="font-mono font-medium text-xs block">{supp.fax}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(supp.fax || '', 'fax')}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                              title={t('common.copy', 'ចម្លង')}
                            >
                              {copiedKey === 'fax' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          </div>
                        )}

                        {supp.website && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                            <div className="flex items-center gap-2.5 text-foreground min-w-0">
                              <Globe size={14} className="text-muted-foreground shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] text-muted-foreground block">{t('suppliers.website', 'គេហទំព័រផ្លូវការ')}</span>
                                <a
                                  href={supp.website.startsWith('http') ? supp.website : `https://${supp.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-xs text-primary hover:underline truncate block"
                                >
                                  {supp.website}
                                </a>
                              </div>
                            </div>
                            <a
                              href={supp.website.startsWith('http') ? supp.website : `https://${supp.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground shrink-0"
                            >
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        )}

                        {supp.hotline && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                            <div className="flex items-center gap-2.5 text-foreground min-w-0">
                              <Phone size={14} className="text-amber-500 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] text-muted-foreground block">{t('suppliers.hotline', 'ទូរស័ព្ទទាន់ហេតុការណ៍')}</span>
                                <span className="font-mono font-medium text-xs block">{supp.hotline}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(supp.hotline || '', 'hotline')}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                              title={t('common.copy', 'ចម្លង')}
                            >
                              {copiedKey === 'hotline' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          </div>
                        )}

                        {supp.support_email && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/60">
                            <div className="flex items-center gap-2.5 text-foreground min-w-0">
                              <Mail size={14} className="text-blue-500 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-[10px] text-muted-foreground block">{t('suppliers.supportEmail', 'អ៊ីមែលផ្នែកបម្រើអតិថិជន')}</span>
                                <span className="font-medium text-xs truncate block">{supp.support_email}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(supp.support_email || '', 'support_email')}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                              title={t('common.copy', 'ចម្លង')}
                            >
                              {copiedKey === 'support_email' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location & Physical Address */}
                    <div className="p-4 bg-card rounded-2xl border border-border/80 shadow-2xs space-y-3">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <MapPin size={14} className="text-purple-500" />
                        {t('suppliers.tabLocation', 'ទីតាំង & អាសយដ្ឋានដឹកជញ្ជូន')}
                      </span>

                      <div className="p-3 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                        <div className="flex items-start gap-2.5 text-foreground">
                          <MapPin size={15} className="text-purple-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-muted-foreground block">{t('suppliers.address', 'អាសយដ្ឋានផ្លូវ / អគារ')}</span>
                            <span className="font-medium text-xs leading-relaxed block mt-0.5">
                              {supp.address || '—'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50 text-xs">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">{t('suppliers.city', 'រាជធានី / ក្រុង')}</span>
                            <span className="font-bold text-foreground block mt-0.5">{supp.city || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block">{t('suppliers.province', 'ខេត្ត / រដ្ឋ')}</span>
                            <span className="font-bold text-foreground block mt-0.5">{supp.province || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block">{t('suppliers.country', 'ប្រទេស')}</span>
                            <span className="font-bold text-foreground block mt-0.5">{supp.country || '—'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block">{t('suppliers.postalCode', 'កូដប្រៃសណីយ៍')}</span>
                            <span className="font-mono font-bold text-foreground block mt-0.5">{supp.postal_code || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 2: BANKING & FINANCE ─── */}
                {activeTab === 'banking' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-2xl border border-border/80 shadow-2xs space-y-3">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <CreditCard size={14} className="text-pink-500" />
                        {t('suppliers.tabBanking', 'ព័ត៌មានគណនីធនាគារ & ការទូទាត់')}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                          <span className="text-[10px] text-muted-foreground font-semibold block">{t('suppliers.bankName', 'ឈ្មោះធនាគារ')}</span>
                          <span className="font-bold text-foreground text-xs block mt-0.5">{supp.bank_name || '—'}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">{t('suppliers.bankAccountNumber', 'លេខគណនីធនាគារ')}</span>
                            <span className="font-mono font-bold text-foreground text-xs block mt-0.5">{supp.bank_account_number || '—'}</span>
                          </div>
                          {supp.bank_account_number && (
                            <button
                              type="button"
                              onClick={() => handleCopy(supp.bank_account_number || '', 'bank_account')}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                              title={t('common.copy', 'ចម្លង')}
                            >
                              {copiedKey === 'bank_account' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                          <span className="text-[10px] text-muted-foreground font-semibold block">{t('suppliers.bankAccountName', 'ឈ្មោះម្ចាស់គណនី')}</span>
                          <span className="font-bold text-foreground text-xs block mt-0.5">{supp.bank_account_name || '—'}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-muted-foreground font-semibold block">{t('suppliers.swiftCode', 'លេខកូដ SWIFT / BIC')}</span>
                            <span className="font-mono font-bold text-foreground text-xs block mt-0.5">{supp.swift_code || '—'}</span>
                          </div>
                          {supp.swift_code && (
                            <button
                              type="button"
                              onClick={() => handleCopy(supp.swift_code || '', 'swift')}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                              title={t('common.copy', 'ចម្លង')}
                            >
                              {copiedKey === 'swift' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                          <span className="text-[10px] text-muted-foreground font-semibold block">{t('suppliers.currency', 'រូបិយប័ណ្ណទូទាត់')}</span>
                          <span className="font-bold text-primary text-xs block mt-0.5">{supp.currency || 'USD'}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-muted/20 border border-border/60">
                          <span className="text-[10px] text-muted-foreground font-semibold block">{t('suppliers.paymentTerms', 'លក្ខខណ្ឌឥណទានទូទាត់')}</span>
                          <span className="font-bold text-foreground text-xs block mt-0.5">{supp.payment_terms || 'Net 30'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 3: CONTACTS / REPRESENTATIVES ─── */}
                {activeTab === 'contacts' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-2xl border border-border/80 shadow-2xs space-y-3">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <User size={14} className="text-amber-500" />
                        {t('suppliers.tabRepresentatives', 'តំណាងអ្នកផ្គត់ផ្គង់ & បុគ្គលិកទំនាក់ទំនង')}
                      </span>

                      {supp.contacts && supp.contacts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {supp.contacts.map((c, idx) => (
                            <div key={idx} className="p-3.5 bg-muted/20 border border-border/60 rounded-xl space-y-2 relative">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                    {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                                  </div>
                                  <div>
                                    <span className="font-bold text-foreground text-xs block">{c.name}</span>
                                    <span className="text-[10px] text-primary font-semibold block">{c.title || c.position || t('suppliers.contactPerson', 'អ្នកទំនាក់ទំនង')}</span>
                                  </div>
                                </div>
                                {c.is_primary && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                    {t('common.primary', 'ចម្បង')}
                                  </span>
                                )}
                              </div>

                              <div className="space-y-1 pt-1 border-t border-border/40 text-[11px]">
                                {c.email && (
                                  <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-1.5 truncate"><Mail size={12} /> {c.email}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(c.email || '', `c-email-${idx}`)}
                                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                      {copiedKey === `c-email-${idx}` ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                    </button>
                                  </div>
                                )}
                                {c.phone && (
                                  <div className="flex items-center justify-between text-muted-foreground font-mono">
                                    <span className="flex items-center gap-1.5"><Phone size={12} /> {c.phone}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(c.phone || '', `c-phone-${idx}`)}
                                      className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                      {copiedKey === `c-phone-${idx}` ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-border/80 rounded-xl bg-muted/10">
                          <User size={28} className="mx-auto text-muted-foreground/40 mb-2" />
                          <p className="text-xs font-semibold text-foreground">
                            {t('suppliers.noContactsYet', 'មិនទាន់មានតំណាងទំនាក់ទំនងនៅឡើយទេ។')}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {t('suppliers.noContactsSub', 'បន្ថែមអ្នកគ្រប់គ្រងផ្នែកលក់ ឬអ្នកសម្របសម្រួលដឹកជញ្ជូន។')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── TAB 4: NOTES & GUIDELINES ─── */}
                {activeTab === 'terms' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-2xl border border-border/80 shadow-2xs space-y-3">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <FileText size={14} className="text-blue-500" />
                        {t('suppliers.tabTerms', 'កំណត់ចំណាំ & កិច្ចព្រមព្រៀងផ្គត់ផ្គង់')}
                      </span>

                      {supp.notes ? (
                        <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60">
                          <p className="text-foreground leading-relaxed text-xs whitespace-pre-wrap font-medium">
                            {supp.notes}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-border/80 rounded-xl bg-muted/10">
                          <FileText size={28} className="mx-auto text-muted-foreground/40 mb-2" />
                          <p className="text-xs text-muted-foreground">
                            {t('suppliers.noNotes', 'មិនទាន់មានកំណត់ចំណាំបន្ថែមសម្រាប់អ្នកផ្គត់ផ្គង់នេះទេ។')}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 border border-primary/20 flex items-start gap-3">
                      <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-foreground">
                          {t('suppliers.procurementPartner', 'ការរួមបញ្ចូលប្រព័ន្ធបញ្ជាទិញ & ខ្សែសង្វាក់ផ្គត់ផ្គង់')}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                          {t('suppliers.guidelineText', 'ព័ត៌មានអ្នកផ្គត់ផ្គង់នេះនឹងត្រូវបានប្រើប្រាស់ដោយផ្ទាល់នៅក្នុងការបញ្ជាទិញ (PO), ប័ណ្ណទទួលទំនិញចូលស្តុក (GRN) និងការទូទាត់។')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3 print:hidden shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  {t('common.close', 'បិទ')}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const target = supp
                    onClose()
                    onOpenEdit(target)
                  }}
                  className="px-4.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity active:scale-95"
                >
                  <Edit2 size={13} />
                  <span>{t('suppliers.editSupplier', 'កែសម្រួលអ្នកផ្គត់ផ្គង់')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SupplierDetailDrawer
