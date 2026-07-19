import React from 'react'
import { Tag, Sparkles, Share2, Megaphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const DashboardRow6: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Campaigns & Promotions */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Megaphone className="w-4 h-4 text-blue-500" />
          {t('marketing.campaigns', 'Active Campaigns')}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">Summer Hot Promo</span>
            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-bold">Active</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">Flash Sale 7.7</span>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full font-bold">Scheduled</span>
          </div>
        </div>
      </div>

      {/* Coupons & Discounts */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-emerald-500" />
          {t('marketing.coupons', 'Coupon Usage')}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">COUPON-WELCOME-10</span>
            <span className="text-muted-foreground font-mono">142 used</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">COUPON-FREE-SHIP</span>
            <span className="text-muted-foreground font-mono">89 used</span>
          </div>
        </div>
      </div>

      {/* Referral & Affiliate */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
        <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-purple-500" />
          {t('marketing.referrals', 'Referrals & Affiliates')}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">Referral Registrations</span>
            <span className="font-bold text-foreground">+24 today</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-foreground">Affiliate Commissions</span>
            <span className="font-bold text-foreground">Rp 1,200,000</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardRow6
