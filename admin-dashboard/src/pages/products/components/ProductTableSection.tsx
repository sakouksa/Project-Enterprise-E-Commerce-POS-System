import React from 'react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/themeStore'
import TableWrapper from '@/components/shared/TableWrapper'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import TableActionMenu from '@/components/shared/TableActionMenu'
import StatusBadge from '@/components/common/StatusBadge'
import { ProductThumbnail } from './ProductThumbnail'
import type { Product } from '../types/productsPage.types'

interface ProductTableSectionProps {
  products: Product[]
  isLoading: boolean
  isFetching: boolean
  visibleColumns: Record<string, boolean>
  recycleBinMode: boolean
  selectedRows: number[]
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onRestore: (id: number) => void
  onForceDelete: (product: Product) => void
  formatCurrency: (val: number) => string
}

export const ProductTableSection: React.FC<ProductTableSectionProps> = ({
  products = [],
  isLoading,
  isFetching,
  visibleColumns,
  recycleBinMode,
  selectedRows,
  setSelectedRows,
  onView,
  onEdit,
  onDelete,
  onRestore,
  onForceDelete,
  formatCurrency,
}) => {
  const { language } = useThemeStore()
  const { t } = useTranslation(['products', 'common'])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(products.map(p => p.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden print:hidden">
      <TableWrapper isFetching={isFetching}>
        <div className="overflow-x-auto">
          <table className="w-full data-table border-collapse">
            <thead className="bg-muted/40 sticky top-0 border-b border-border z-10">
              <tr>
                <th className="w-10 text-center">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedRows.length === products.length}
                    onChange={handleSelectAll}
                    className="checkbox h-4 w-4"
                  />
                </th>
                {visibleColumns.image && <th className="w-12">{t('colPhoto', 'Image')}</th>}
                {visibleColumns.name && <th>{t('colName', 'Product Name')}</th>}
                {visibleColumns.sku && <th>{t('sku', 'SKU')}</th>}
                {visibleColumns.category && <th>{t('colCategory', 'Category')}</th>}
                {visibleColumns.price && <th>{t('colPrice', 'Price')}</th>}
                {visibleColumns.stock && <th>{t('colStock', 'Stock')}</th>}
                {visibleColumns.status && <th>{t('colStatus', 'Status')}</th>}
                <th className="text-right">{t('colActions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <LoadingSkeleton cols={9} />
              ) : products.length === 0 ? (
                <EmptyState cols={9} message={t('common.noData', t('noData', 'No product items found matching query.'))} />
              ) : (
                products.map((p) => {
                  const isSelected = selectedRows.includes(p.id)
                  const isLowStock = (p.stock ?? 0) <= (p.low_stock_threshold || 5)
                  return (
                    <tr key={p.id} className={`hover:bg-muted/40 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(p.id)}
                          className="checkbox h-4 w-4"
                        />
                      </td>
                      {visibleColumns.image && (
                        <td>
                          <ProductThumbnail
                            name={p.name}
                            primaryImage={p.primary_image}
                            images={p.images}
                            image={(p as any).image}
                            categoryName={p.category?.name}
                            size="sm"
                          />
                        </td>
                      )}
                      {visibleColumns.name && (
                        <td>
                          <p onClick={() => onView(p)} className="font-bold text-foreground hover:text-primary cursor-pointer text-sm">
                            {p.name}
                          </p>
                          {p.brand?.name && <p className="text-[11px] text-muted-foreground">{p.brand.name}</p>}
                        </td>
                      )}
                      {visibleColumns.sku && (
                        <td>
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            {p.sku}
                          </span>
                        </td>
                      )}
                      {visibleColumns.category && (
                        <td className="text-xs font-semibold text-foreground">
                          {p.category?.name || 'General'}
                        </td>
                      )}
                      {visibleColumns.price && (
                        <td className="font-mono text-xs font-bold text-emerald-600">
                          {formatCurrency(p.selling_price)}
                        </td>
                      )}
                      {visibleColumns.stock && (
                        <td className="font-mono text-xs font-bold">
                          <span className={isLowStock ? 'text-rose-500 font-extrabold' : 'text-foreground'}>
                            {p.stock ?? 0}
                          </span>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td>
                          <StatusBadge status={p.status ?? (p as any).is_active} />
                        </td>
                      )}
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <TableActionMenu
                          onView={() => onView(p)}
                          onEdit={() => onEdit(p)}
                          onDelete={() => onDelete(p)}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </TableWrapper>
    </div>
  )
}

export default ProductTableSection
