import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Truck, Mail, Phone, MapPin, CreditCard, Building,
  FileText, User, ExternalLink, ShieldCheck, CheckCircle2
} from 'lucide-react'
import type { SupplierFormData, SupplierContact } from '../types/supplier.types'

interface SupplierLivePreviewDrawerProps {
  isOpen: boolean
  onClose: () => void
  formData: SupplierFormData
  contacts: SupplierContact[]
  logoPreview?: string | null
}

export const SupplierLivePreviewDrawer: React.FC<SupplierLivePreviewDrawerProps> = ({
  isOpen,
  onClose,
  formData,
  contacts,
  logoPreview,
}) => {
  const { t } = useTranslation(['suppliers', 'common'])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden print:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="bg-card w-screen max-w-md border-l border-border h-full flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      {t('suppliers.livePreview', 'ពិនិត្យមើលផ្ទាល់')}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {t('suppliers.previewSub', 'ការបង្ហាញសាកល្បងទម្រង់ព័ត៌មានអ្នកផ្គត់ផ្គង់')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Profile Banner Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-primary/5 border border-primary/20 space-y-4">
                  <div className="flex items-center gap-3.5">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-14 h-14 rounded-2xl object-cover border border-border bg-white shadow-xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary border border-primary/25 flex items-center justify-center font-black text-xl shadow-xs">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-foreground truncate">
                          {formData.name || t('suppliers.unnamedSupplier', 'អ្នកផ្គត់ផ្គង់ថ្មី')}
                        </h4>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {formData.code || 'SPL-000'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        formData.is_active
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          formData.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                        }`}
                      />
                      {formData.is_active ? t('suppliers.active', 'សកម្ម') : t('suppliers.inactive', 'អសកម្ម')}
                    </span>

                    {formData.tax_number && (
                      <span className="text-[11px] font-mono bg-muted px-2.5 py-0.5 rounded-full text-muted-foreground border border-border">
                        {formData.tax_number}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Channels */}
                <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-2xs">
                  <h5 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Mail size={14} className="text-primary" />
                    {t('suppliers.contactInfo', 'ព័ត៌មានទំនាក់ទំនង')}
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{t('suppliers.email', 'អ៊ីមែល')}:</span>
                      <span className="font-medium text-foreground">{formData.email || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{t('suppliers.phone', 'លេខទូរស័ព្ទ')}:</span>
                      <span className="font-mono text-foreground">{formData.phone || '—'}</span>
                    </div>
                    {formData.fax && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>{t('suppliers.fax', 'លេខទូរសារ')}:</span>
                        <span className="font-mono text-foreground">{formData.fax}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-2xs">
                  <h5 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    {t('suppliers.tabLocation', 'ទីតាំង & អាសយដ្ឋាន')}
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {formData.address || (formData.city ? `${formData.city}, ${formData.country || ''}` : '—')}
                  </p>
                </div>

                {/* Banking Information */}
                {(formData.bank_name || formData.bank_account_number) && (
                  <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-2xs">
                    <h5 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <CreditCard size={14} className="text-primary" />
                      {t('suppliers.tabBanking', 'ព័ត៌មានធនាគារ')}
                    </h5>
                    <div className="space-y-2 text-xs">
                      {formData.bank_name && (
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>{t('suppliers.bankName', 'ឈ្មោះធនាគារ')}:</span>
                          <span className="font-semibold text-foreground">{formData.bank_name}</span>
                        </div>
                      )}
                      {formData.bank_account_number && (
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>{t('suppliers.bankAccountNumber', 'លេខគណនី')}:</span>
                          <span className="font-mono font-bold text-foreground">{formData.bank_account_number}</span>
                        </div>
                      )}
                      {formData.bank_account_name && (
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>{t('suppliers.bankAccountName', 'ម្ចាស់គណនី')}:</span>
                          <span className="text-foreground">{formData.bank_account_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Representatives */}
                {contacts.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-2xs">
                    <h5 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      {t('suppliers.tabRepresentatives', 'តំណាងអ្នកផ្គត់ផ្គង់')} ({contacts.length})
                    </h5>
                    <div className="space-y-2">
                      {contacts.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-muted/30 border border-border/70 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">{c.name}</span>
                            {c.title && <span className="text-[10px] text-muted-foreground">{c.title}</span>}
                          </div>
                          {(c.phone || c.email) && (
                            <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-3">
                              {c.phone && <span>{c.phone}</span>}
                              {c.email && <span>{c.email}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SupplierLivePreviewDrawer
