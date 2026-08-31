import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, MapPin, User, Phone, Copy, Check,
  Edit2, Trash2, Home, Building2, Package, Store, Building,
  Factory, Hotel, Tag, CheckCircle2, Calendar
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { 
  DetailDrawer, 
  DetailDrawerHeader, 
  DetailDrawerBody, 
  DetailDrawerFooter,
  type CustomerAddress 
} from '@/components/common'

interface CustomerAddressDetailDrawerProps {
  address: CustomerAddress | null
  isOpen: boolean
  onClose: () => void
  onEdit: (addr: CustomerAddress) => void
  onDelete: (addr: CustomerAddress) => void
}

export const CustomerAddressDetailDrawer: React.FC<CustomerAddressDetailDrawerProps> = ({
  address,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation(['customers', 'common'])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  if (!isOpen || !address) return null

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const renderLabelBadge = (label?: string) => {
    const norm = (label || '').trim().toLowerCase()
    let icon = <Tag size={12} className="shrink-0 text-primary" />
    let colorCls = 'bg-primary/10 text-primary border-primary/20'
    let labelText = label || t('customers.labelOther', 'Other')

    if (norm === 'home' || norm.startsWith('home')) {
      icon = <Home size={12} className="shrink-0 text-blue-500" />
      colorCls = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      labelText = t('customers.labelHome', 'Home')
    } else if (norm === 'office' || norm === 'work' || norm === 'hq') {
      icon = <Building2 size={12} className="shrink-0 text-purple-500" />
      colorCls = 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
      labelText = t('customers.labelOffice', 'Office')
    } else if (norm === 'warehouse') {
      icon = <Package size={12} className="shrink-0 text-amber-500" />
      colorCls = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      labelText = t('customers.labelWarehouse', 'Warehouse')
    } else if (norm === 'store' || norm === 'shop') {
      icon = <Store size={12} className="shrink-0 text-emerald-500" />
      colorCls = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      labelText = t('customers.labelStore', 'Store')
    } else if (norm === 'branch') {
      icon = <Building size={12} className="shrink-0 text-cyan-500" />
      colorCls = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
      labelText = t('customers.labelBranch', 'Branch')
    } else if (norm === 'condo' || norm === 'apartment') {
      icon = <Building2 size={12} className="shrink-0 text-indigo-500" />
      colorCls = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
      labelText = norm === 'condo' ? t('customers.labelCondo', 'Condo') : t('customers.labelApartment', 'Apartment')
    } else if (norm === 'villa') {
      icon = <Home size={12} className="shrink-0 text-rose-500" />
      colorCls = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
      labelText = t('customers.labelVilla', 'Villa')
    } else if (norm === 'factory') {
      icon = <Factory size={12} className="shrink-0 text-orange-500" />
      colorCls = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      labelText = t('customers.labelFactory', 'Factory')
    } else if (norm === 'hotel') {
      icon = <Hotel size={12} className="shrink-0 text-teal-500" />
      colorCls = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
      labelText = t('customers.labelHotel', 'Hotel')
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-2xs ${colorCls}`}>
        {icon}
        <span>{labelText}</span>
      </span>
    )
  }

  const fullAddressString = [
    address.address,
    address.city,
    address.province,
    address.country,
    address.postal_code ? `(${address.postal_code})` : ''
  ].filter(Boolean).join(', ')

  return (
    <DetailDrawer
      isOpen={isOpen && !!address}
      onClose={onClose}
      size="lg"
    >
      <DetailDrawerHeader
        icon={<MapPin size={20} />}
        iconVariant="primary"
        title={t('customers.addressDetails', 'Address Details')}
        subtitle={
          <div className="flex items-center gap-2 mt-1">
            {renderLabelBadge(address.label)}
            {address.is_default ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                <CheckCircle2 size={11} />
                <span>{t('customers.defaultAddress', 'Default Address')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                {t('customers.secondaryAddress', 'Secondary Address')}
              </span>
            )}
          </div>
        }
        badge={
          <span className="text-xs font-mono text-muted-foreground">#{address.id}</span>
        }
        onClose={onClose}
      />

      <DetailDrawerBody>
            {/* Recipient & Customer Card */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-primary" />
                <span>{t('customers.recipientInfo', 'Recipient & Customer Information')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <span className="text-[11px] text-muted-foreground block mb-0.5">{t('customers.recipient', 'Recipient Name')}</span>
                  <p className="text-sm font-semibold text-foreground">{address.name || '—'}</p>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block mb-0.5">{t('customers.phone', 'Phone Number')}</span>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono font-medium text-foreground">{address.phone || '—'}</p>
                    {address.phone && (
                      <button
                        onClick={() => copyToClipboard(address.phone, 'phone')}
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="Copy phone"
                      >
                        {copiedKey === 'phone' ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2.5 border-t border-border/50">
                  <span className="text-[11px] text-muted-foreground block mb-0.5">{t('customers.customerAccount', 'Customer Account')}</span>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-primary">
                      {address.customer?.name || (address.customer_id ? `Customer #${address.customer_id}` : '—')}
                    </p>
                    {address.customer?.email && (
                      <span className="text-xs text-muted-foreground font-mono">{address.customer.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Location Details */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" />
                  <span>{t('customers.locationDetails', 'Location & Address Details')}</span>
                </h3>
                <button
                  onClick={() => copyToClipboard(fullAddressString, 'fullAddress')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                >
                  {copiedKey === 'fullAddress' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>{copiedKey === 'fullAddress' ? t('common.copied', 'Copied') : t('customers.copyAddress', 'Copy Address')}</span>
                </button>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[11px] text-muted-foreground block mb-0.5">{t('customers.streetAddress', 'Street Address')}</span>
                  <p className="text-sm font-semibold text-foreground leading-relaxed">{address.address || '—'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-border/50">
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">{t('customers.city', 'City / Khan')}</span>
                    <p className="text-sm font-medium text-foreground">{address.city || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">{t('customers.province', 'Province / State')}</span>
                    <p className="text-sm font-medium text-foreground">{address.province || '—'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-border/50">
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">{t('customers.country', 'Country')}</span>
                    <p className="text-sm font-medium text-foreground">{address.country || 'Cambodia'}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">{t('customers.postalCode', 'Postal Code')}</span>
                    <p className="text-sm font-mono font-medium text-foreground">{address.postal_code || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Timestamps */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-2 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar size={13} />
                <span>{t('customers.recordId', 'ID')}: #{address.id}</span>
              </span>
              {address.created_at && (
                <span className="font-mono">{new Date(address.created_at).toLocaleDateString()}</span>
              )}
            </div>
      </DetailDrawerBody>

      <DetailDrawerFooter
        onClose={onClose}
        closeLabel={t('common.close', 'Close')}
        leftActions={
          <button
            type="button"
            onClick={() => onDelete(address)}
            className="h-10 px-4 rounded-xl text-xs sm:text-[13px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-2 cursor-pointer shadow-2xs active:scale-95"
          >
            <Trash2 size={15} />
            <span>{t('common.delete', 'Delete')}</span>
          </button>
        }
        rightActions={
          <button
            type="button"
            onClick={() => {
              onClose()
              onEdit(address)
            }}
            className="h-10 px-5 rounded-xl text-xs sm:text-[13px] font-bold text-white bg-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs hover:shadow cursor-pointer active:scale-95"
          >
            <Edit2 size={15} />
            <span>{t('common.edit', 'Edit')}</span>
          </button>
        }
      />
    </DetailDrawer>
  )
}

export default CustomerAddressDetailDrawer
