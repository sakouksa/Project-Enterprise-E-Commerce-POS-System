import React, { useState } from 'react'
import { X, Calendar, Activity, Info, BarChart2, Package, User, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const formatShortDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '—'
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

interface InventoryDetailPageProps {
  itemId: number
  onClose: () => void
}

export const InventoryDetailPage: React.FC<InventoryDetailPageProps> = ({ itemId, onClose }) => {
  const { t } = useTranslation()
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'movements'>('info')

  const { data: detail, isLoading } = useQuery({
    queryKey: ['inventory-detail', itemId],
    queryFn: () => api.get(`/inventory/${itemId}`).then(r => r.data.data),
    enabled: !!itemId
  })

  const { data: movements, isLoading: loadingMovements } = useQuery({
    queryKey: ['inventory-item-movements', detail?.product_id, detail?.warehouse_id],
    queryFn: () => api.get('/inventory-movements', {
      params: {
        product_id: detail.product_id,
        warehouse_id: detail.warehouse_id,
        per_page: 50
      }
    }).then(r => r.data.data),
    enabled: !!detail?.product_id && !!detail?.warehouse_id
  })

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!detail) return null

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-card border-l border-border shadow-2xl z-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{t('inventory.details', 'Inventory Specifications')}</h3>
          <p className="text-xs text-muted-foreground">{detail.product?.name} ({detail.product?.sku})</p>
        </div>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/10 px-6 gap-4">
        <button
          onClick={() => setActiveSubTab('info')}
          className={`flex items-center gap-1.5 py-3 border-b-2 text-sm font-semibold transition-colors
                     ${activeSubTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Info size={14} />
          {t('products.general', 'General Info')}
        </button>
        <button
          onClick={() => setActiveSubTab('movements')}
          className={`flex items-center gap-1.5 py-3 border-b-2 text-sm font-semibold transition-colors
                     ${activeSubTab === 'movements' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          <Activity size={14} />
          {t('inventory.movements', 'Stock History Ledger')}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeSubTab === 'info' ? (
          <div className="space-y-6">
            {/* Stock Levels Status Widget */}
            <div className="grid grid-cols-3 gap-4 bg-muted/10 border border-border/40 p-4 rounded-xl">
              <div className="text-center">
                <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.stock', 'On Hand')}</span>
                <span className="block text-xl font-bold text-foreground mt-1">{parseFloat(detail.quantity)}</span>
              </div>
              <div className="text-center border-x border-border/60">
                <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.reserved_qty', 'Reserved')}</span>
                <span className="block text-xl font-bold text-amber-500 mt-1">{parseFloat(detail.reserved_quantity)}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted-foreground uppercase font-semibold">{t('inventory.available_qty', 'Available')}</span>
                <span className="block text-xl font-bold text-emerald-500 mt-1">{parseFloat(detail.available_quantity)}</span>
              </div>
            </div>

            {/* Warehouse and Product details */}
            <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-foreground font-semibold flex items-center gap-1.5">
                <Package size={16} className="text-indigo-500" />
                {t('inventory.general', 'Specifications')}
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">{t('products.warehouse', 'Warehouse Location')}</span>
                  <span className="font-medium text-foreground">{detail.warehouse?.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{t('products.sku', 'SKU')}</span>
                  <span className="font-medium font-mono text-xs">{detail.product?.sku}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{t('products.category', 'Category')}</span>
                  <span className="font-medium text-foreground">{detail.product?.category?.name || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{t('products.brand', 'Brand')}</span>
                  <span className="font-medium text-foreground">{detail.product?.brand?.name || '—'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{t('inventory.reorder_point', 'Reorder Point')}</span>
                  <span className="font-medium text-foreground">{parseFloat(detail.reorder_point) || 0}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{t('inventory.reorder_qty', 'Reorder Quantity')}</span>
                  <span className="font-medium text-foreground">{parseFloat(detail.reorder_qty) || 0}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{t('products.created', 'Created At')}</span>
                  <span className="font-medium text-foreground">{formatShortDate(detail.created_at)}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{t('products.updated', 'Updated At')}</span>
                  <span className="font-medium text-foreground">{formatShortDate(detail.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground font-semibold flex items-center gap-1.5">
              <Clock size={16} className="text-indigo-500" />
              {t('inventory.movements', 'Stock History Ledger')}
            </h4>
            {loadingMovements ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : (
              <div className="relative border-l border-border pl-6 ml-3 space-y-6">
                {(movements ?? []).map((m: any) => (
                  <div key={m.id} className="relative">
                    {/* Circle Indicator */}
                    <span className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card
                                     ${m.quantity > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold uppercase tracking-wider text-muted-foreground">{String(t(`inventory.movement_${m.type}`, m.type))}</span>
                        <span className="text-muted-foreground font-mono">{formatShortDate(m.created_at)}</span>
                      </div>
                      <p className="text-sm text-foreground font-medium">
                        {m.quantity > 0 ? '+' : ''}{parseFloat(m.quantity)} ({t('inventory.before', 'Before')}: {parseFloat(m.quantity_before)} → {t('inventory.after', 'After')}: {parseFloat(m.quantity_after)})
                      </p>
                      {m.notes && <p className="text-xs text-muted-foreground italic">"{m.notes}"</p>}
                    </div>
                  </div>
                ))}
                {(movements ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">{t('inventory.no_movements', 'No stock movement logs found.')}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default InventoryDetailPage
