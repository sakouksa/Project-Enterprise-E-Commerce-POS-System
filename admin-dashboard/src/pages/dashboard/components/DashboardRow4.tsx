import React from 'react'
import { Warehouse, Boxes, AlertTriangle, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DashboardRow4Props {
  lowStockList: any[]
}

const MOCK_WAREHOUSE_STOCK = [
  { name: 'Phnom Penh Warehouse', items: 1205, value: 'Rp 450,000,000' },
  { name: 'Siem Reap Storehouse', items: 840, value: 'Rp 312,000,000' },
  { name: 'Transit Node B', items: 154, value: 'Rp 48,000,000' },
]

export const DashboardRow4: React.FC<DashboardRow4Props> = ({ lowStockList }) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Warehouse Status */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Warehouse className="w-4 h-4 text-blue-500" />
            {t('inventory.warehouse_status', 'Warehouse Stock Status')}
          </h4>
          <div className="space-y-3">
            {MOCK_WAREHOUSE_STOCK.map((wh, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1">
                <span className="text-muted-foreground font-semibold">{wh.name}</span>
                <div className="text-right">
                  <span className="font-bold text-foreground">{wh.items} items</span>
                  <p className="text-[9px] text-muted-foreground font-semibold">{wh.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Alerts (Low & Out of Stock) */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            {t('dashboard.stockAlerts', 'Stock Health Alerts')}
          </h4>
          <div className="space-y-3.5">
            {lowStockList?.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-border/20 pb-2 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-foreground block truncate max-w-[150px]">{item.product_name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.warehouse_name}</span>
                </div>
                <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-full">
                  {item.quantity} left
                </span>
              </div>
            ))}
            {!lowStockList?.length && (
              <div className="text-center py-6 text-xs text-muted-foreground">
                🎉 All inventory stocks are healthy.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Financial Value */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Boxes className="w-4 h-4 text-purple-500" />
            {t('inventory.stock_value', 'Inventory Value')}
          </h4>
          <div className="mt-4">
            <span className="text-xs text-muted-foreground font-semibold">Total Stock Assets Value</span>
            <h3 className="text-2xl font-black text-foreground mt-1">Rp 810.000.000</h3>
            <p className="text-[10px] text-green-500 font-bold mt-1">↑ +4.2% asset valuation change vs last month</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardRow4
