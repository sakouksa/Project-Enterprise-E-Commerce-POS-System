import React from 'react'
import { Users, MapPin, Smile, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const DashboardRow7: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Customer Growth & Retention */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-500" />
          {t('customers.growth_retention', 'Growth & Retention')}
        </h4>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] text-muted-foreground font-semibold">New Registrations</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-foreground">+42 Customers</span>
              <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +8.4%
              </span>
            </div>
          </div>
          <div className="border-t border-border/20 pt-3">
            <span className="text-[11px] text-muted-foreground font-semibold">Retention Rate</span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-sm text-foreground">78.5%</span>
              <span className="text-[10px] text-green-500 font-bold">Stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Type Breakdown */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-emerald-500" />
          {t('customers.demographics', 'Customer Types')}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold">New/First-time Customers</span>
            <span className="font-bold text-foreground">62%</span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-border/20 pt-2">
            <span className="text-muted-foreground font-semibold">Returning Loyal Customers</span>
            <span className="font-bold text-foreground">38%</span>
          </div>
        </div>
      </div>

      {/* Top Customer Locations */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-purple-500" />
          {t('customers.top_locations', 'Top Locations')}
        </h4>
        <div className="space-y-2">
          {[
            { city: 'Phnom Penh', count: 184 },
            { city: 'Siem Reap', count: 92 },
            { city: 'Sihanoukville', count: 48 },
          ].map((loc, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs py-0.5">
              <span className="text-muted-foreground">{loc.city}</span>
              <span className="font-bold text-foreground">{loc.count} active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardRow7
