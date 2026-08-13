import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, MapPin, Building, Truck, Edit2 } from 'lucide-react'
import type { Supplier } from '../types/supplier.types'

interface SupplierDetailDrawerProps {
  supplier: Supplier | null
  onClose: () => void
  onOpenEdit: (s: Supplier) => void
}

export const SupplierDetailDrawer: React.FC<SupplierDetailDrawerProps> = ({
  supplier,
  onClose,
  onOpenEdit,
}) => {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {supplier && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end print:bg-white print:backdrop-blur-none print:static print:w-full">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-card w-full max-w-lg border-l border-border h-full flex flex-col shadow-2xl print:border-none print:shadow-none print:w-full print:h-auto print:static"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug">{supplier.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{supplier.code}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Status Badge */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border">
                <span className="font-semibold text-foreground">{t('suppliers.status', 'Supplier Status')}</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                  supplier.is_active
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}>
                  {supplier.is_active ? t('suppliers.active', 'Active') : t('suppliers.inactive', 'Inactive')}
                </span>
              </div>

              {/* Contact Info */}
              <div className="p-4 bg-muted/20 rounded-xl border border-border space-y-2.5">
                <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground block">{t('suppliers.contactInfo', 'Contact Information')}</span>
                <div className="space-y-1.5">
                  {supplier.email && (
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail size={14} className="text-muted-foreground shrink-0" />
                      <span>{supplier.email}</span>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone size={14} className="text-muted-foreground shrink-0" />
                      <span className="font-mono">{supplier.phone}</span>
                    </div>
                  )}
                  {(supplier.address || supplier.city) && (
                    <div className="flex items-start gap-2 text-foreground">
                      <MapPin size={14} className="text-muted-foreground shrink-0 mt-0.5" />
                      <span>{[supplier.address, supplier.city, supplier.province, supplier.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Banking & Tax Info */}
              <div className="p-4 bg-muted/20 rounded-xl border border-border space-y-2.5">
                <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground block">{t('suppliers.bankingAndTax', 'Banking & Tax Details')}</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">{t('suppliers.taxNumber', 'Tax Number')}</span>
                    <span className="font-mono font-bold text-foreground">{supplier.tax_number || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">{t('suppliers.bankName', 'Bank Name')}</span>
                    <span className="font-semibold text-foreground">{supplier.bank_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">{t('suppliers.bankAccountNumber', 'Account No.')}</span>
                    <span className="font-mono font-bold text-foreground">{supplier.bank_account_number || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">{t('suppliers.bankAccountName', 'Beneficiary')}</span>
                    <span className="font-semibold text-foreground">{supplier.bank_account_name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Contact Persons */}
              {supplier.contacts && supplier.contacts.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground block">{t('suppliers.representatives', 'Supplier Contacts')}</span>
                  <div className="space-y-2">
                    {supplier.contacts.map((c, idx) => (
                      <div key={idx} className="p-3 bg-muted/20 border border-border rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{c.name}</span>
                          <span className="text-[10px] font-semibold text-primary">{c.title || c.position || 'Contact'}</span>
                        </div>
                        {c.email && <p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Mail size={11} /> {c.email}</p>}
                        {c.phone && <p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Phone size={11} /> {c.phone}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {supplier.notes && (
                <div className="p-4 bg-muted/20 rounded-xl border border-border space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground block">{t('suppliers.notes', 'Notes & Logistics Terms')}</span>
                  <p className="text-muted-foreground leading-relaxed">{supplier.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const target = supplier
                  onClose()
                  onOpenEdit(target)
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 size={13} />
                <span>{t('common.edit', 'Edit Supplier')}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                {t('common.close', 'Close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
