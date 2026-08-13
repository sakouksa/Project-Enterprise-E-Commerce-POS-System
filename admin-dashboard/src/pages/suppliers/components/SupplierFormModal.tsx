import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Loader2, Check } from 'lucide-react'
import type { Supplier, SupplierFormData, SupplierContact } from '../types/supplier.types'

interface SupplierFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingSupplier: Supplier | null
  formData: SupplierFormData
  setFormField: (field: keyof SupplierFormData, value: any) => void
  contacts: SupplierContact[]
  setContacts: React.Dispatch<React.SetStateAction<SupplierContact[]>>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  onClose,
  editingSupplier,
  formData,
  setFormField,
  contacts,
  setContacts,
  isSubmitting,
  onSubmit,
}) => {
  const { t } = useTranslation()

  const addContactRow = () => {
    setContacts(prev => [...prev, { name: '', title: '', email: '', phone: '', is_primary: prev.length === 0 }])
  }

  const removeContactRow = (idx: number) => {
    setContacts(prev => prev.filter((_, i) => i !== idx))
  }

  const updateContactField = (idx: number, field: keyof SupplierContact, value: any) => {
    setContacts(prev => {
      const copy = [...prev]
      copy[idx] = { ...copy[idx], [field]: value }
      return copy
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-base text-foreground">
                {editingSupplier ? t('suppliers.editSupplier', 'Edit Supplier') : t('suppliers.addSupplier', 'Create New Supplier')}
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    {t('suppliers.code', 'Supplier Code')} *
                  </label>
                  <input
                    value={formData.code}
                    onChange={e => setFormField('code', e.target.value)}
                    required
                    placeholder="SUP-001"
                    className="form-input text-xs w-full font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    {t('suppliers.name', 'Supplier / Company Name')} *
                  </label>
                  <input
                    value={formData.name}
                    onChange={e => setFormField('name', e.target.value)}
                    required
                    placeholder="Apple Distribution Asia"
                    className="form-input text-xs w-full font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.email', 'Email Address')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormField('email', e.target.value)}
                    placeholder="orders@supplier.com"
                    className="form-input text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.phone', 'Phone Number')}</label>
                  <input
                    value={formData.phone}
                    onChange={e => setFormField('phone', e.target.value)}
                    placeholder="+855 12 345 678"
                    className="form-input text-xs w-full font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.fax', 'Fax Number')}</label>
                  <input
                    value={formData.fax}
                    onChange={e => setFormField('fax', e.target.value)}
                    placeholder="+855 23 888 999"
                    className="form-input text-xs w-full font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.taxNumber', 'Tax ID / NPWP')}</label>
                  <input
                    value={formData.tax_number}
                    onChange={e => setFormField('tax_number', e.target.value)}
                    placeholder="K001-90023412"
                    className="form-input text-xs w-full font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.address', 'Street Address')}</label>
                <textarea
                  value={formData.address}
                  onChange={e => setFormField('address', e.target.value)}
                  rows={2}
                  placeholder="Building #12, Street 271, Sangkat Boeung Tumpun..."
                  className="form-input text-xs w-full resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.city', 'City')}</label>
                  <input
                    value={formData.city}
                    onChange={e => setFormField('city', e.target.value)}
                    placeholder="Phnom Penh"
                    className="form-input text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.province', 'Province / State')}</label>
                  <input
                    value={formData.province}
                    onChange={e => setFormField('province', e.target.value)}
                    placeholder="Phnom Penh"
                    className="form-input text-xs w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.country', 'Country')}</label>
                  <input
                    value={formData.country}
                    onChange={e => setFormField('country', e.target.value)}
                    placeholder="Cambodia"
                    className="form-input text-xs w-full"
                  />
                </div>
              </div>

              {/* Banking Info */}
              <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
                <span className="font-bold text-foreground block uppercase text-[10px] tracking-wider">
                  {t('suppliers.bankingDetails', 'Bank Account Information')}
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.bankName', 'Bank Name')}</label>
                    <input
                      value={formData.bank_name}
                      onChange={e => setFormField('bank_name', e.target.value)}
                      placeholder="ABA Bank / Canadia"
                      className="form-input text-xs w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.bankAccountNumber', 'Account Number')}</label>
                    <input
                      value={formData.bank_account_number}
                      onChange={e => setFormField('bank_account_number', e.target.value)}
                      placeholder="000 123 456"
                      className="form-input text-xs w-full font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-muted-foreground mb-1">{t('suppliers.bankAccountName', 'Account Name')}</label>
                    <input
                      value={formData.bank_account_name}
                      onChange={e => setFormField('bank_account_name', e.target.value)}
                      placeholder="APPLE ASIA CO LTD"
                      className="form-input text-xs w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Contacts Repeater */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{t('suppliers.representatives', 'Contact Persons')}</span>
                  <button
                    type="button"
                    onClick={addContactRow}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} /> {t('suppliers.addContact', 'Add Contact')}
                  </button>
                </div>

                {contacts.map((c, idx) => (
                  <div key={idx} className="p-3 bg-muted/20 border border-border rounded-xl space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => removeContactRow(idx)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 rounded cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-semibold">Name *</label>
                        <input
                          value={c.name}
                          onChange={e => updateContactField(idx, 'name', e.target.value)}
                          placeholder="Contact Person Name"
                          required
                          className="form-input text-xs w-full"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-semibold">Title / Role</label>
                        <input
                          value={c.title || c.position || ''}
                          onChange={e => updateContactField(idx, 'title', e.target.value)}
                          placeholder="Sales Director"
                          className="form-input text-xs w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-semibold">Email</label>
                        <input
                          type="email"
                          value={c.email || ''}
                          onChange={e => updateContactField(idx, 'email', e.target.value)}
                          placeholder="rep@supplier.com"
                          className="form-input text-xs w-full"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-semibold">Phone</label>
                        <input
                          value={c.phone || ''}
                          onChange={e => updateContactField(idx, 'phone', e.target.value)}
                          placeholder="+855 12 888 777"
                          className="form-input text-xs w-full font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                <span className="font-bold text-foreground">Active in Procurement</span>
                <button
                  type="button"
                  onClick={() => setFormField('is_active', !formData.is_active)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    formData.is_active
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {formData.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-xl font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl font-bold shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>{editingSupplier ? t('common.saveChanges', 'Save Changes') : t('suppliers.saveSupplier', 'Create Supplier')}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
