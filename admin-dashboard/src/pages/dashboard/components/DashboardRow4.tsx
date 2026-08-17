import React from 'react'
import { Warehouse, Boxes, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface DashboardRow4Props {
  lowStockList: any[]
  stats?: any
}

export const DashboardRow4: React.FC<DashboardRow4Props> = ({ lowStockList, stats }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(i18n.language === 'km' ? 'km-KH' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val || 0)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Warehouse Status Summary */}
      <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Warehouse className="w-4 h-4 text-blue-500" />
            {t('dashboard.warehouseStockStatus', 'Warehouse Stock Status')}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/20">
              <span className="text-muted-foreground font-semibold">{t('dashboard.totalWarehouses')}</span>
              <span className="font-bold text-foreground">{stats?.total_warehouses || 1}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/20">
              <span className="text-muted-foreground font-semibold">{t('dashboard.todayTransfers')}</span>
              <span className="font-bold text-foreground">{stats?.today_transfers || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5">
              <span className="text-muted-foreground font-semibold">{t('dashboard.todayStockMovements', "Today's Stock Movements")}</span>
              <span className="font-bold text-foreground">{stats?.today_stock_movement || 0}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/warehouses')}
          className="mt-4 text-[11px] text-primary hover:underline font-bold text-left cursor-pointer"
        >
          {t('dashboard.viewAll')} →
        </button>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            {t('dashboard.stockHealthAlerts', 'Stock Health Alerts')}
          </h4>
          <div className="space-y-3.5">
            {lowStockList?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-foreground block truncate max-w-[150px]">{item.product_name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.warehouse_name || 'Main Warehouse'}</span>
                </div>
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-full">
                  {item.quantity} {t('dashboard.left', 'left')}
                </span>
              </div>
            ))}
            {(!lowStockList || lowStockList.length === 0) && (
              <div className="text-center py-6 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                🎉 {t('dashboard.allStockHealthy', 'All stock levels are healthy')}
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => navigate('/inventory')}
          className="mt-4 text-[11px] text-primary hover:underline font-bold text-left cursor-pointer"
        >
          {t('dashboard.viewInventory')} →
        </button>
      </div>

      {/* Inventory Financial Assets Valuation */}
      <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between md:col-span-2 lg:col-span-1">
        <div>
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Boxes className="w-4 h-4 text-purple-500" />
            {t('dashboard.inventoryValue', 'Inventory Value')}
          </h4>
          <div className="mt-4">
            <span className="text-xs text-muted-foreground font-semibold">{t('dashboard.inventoryValuation', 'Total Stock Valuation')}</span>
            <h3 className="text-2xl font-black text-foreground mt-1">{formatCurrency(stats?.inventory_value || 0)}</h3>
          </div>
        </div>
        <button 
          onClick={() => navigate('/reports/inventory')}
          className="mt-4 text-[11px] text-primary hover:underline font-bold text-left cursor-pointer"
        >
          {t('dashboard.viewReport', 'View Report')} →
        </button>
      </div>
    </div>
  )
}

export default DashboardRow4
