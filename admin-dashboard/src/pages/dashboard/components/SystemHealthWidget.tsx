import React from 'react'
import { Server, Database, HardDrive, Cpu, CheckCircle2, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SystemHealthWidgetProps {
  healthData?: any
  isLoading?: boolean
}

export const SystemHealthWidget: React.FC<SystemHealthWidgetProps> = ({ healthData, isLoading }) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-3 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded" />
        <div className="h-16 bg-muted rounded-xl" />
      </div>
    )
  }

  const items = [
    {
      name: t('dashboard.apiStatus', 'ម៉ាស៊ីន API Gateway'),
      status: healthData?.api_status || t('dashboard.operational', 'ដំណើរការល្អ'),
      icon: <Server className="w-4 h-4 text-blue-500" />,
    },
    {
      name: t('dashboard.databaseStatus', 'មូលដ្ឋានទិន្នន័យ Postgres'),
      status: healthData?.database_status || t('dashboard.operational', 'ដំណើរការល្អ'),
      icon: <Database className="w-4 h-4 text-emerald-500" />,
    },
    {
      name: t('dashboard.cacheStatus', 'ប្រព័ន្ធ Redis Cache'),
      status: healthData?.cache_status || t('dashboard.operational', 'ដំណើរការល្អ'),
      icon: <Cpu className="w-4 h-4 text-purple-500" />,
    },
    {
      name: t('dashboard.storageStatus', 'ប្រព័ន្ធផ្ទុកទិន្នន័យ Cloud'),
      status: healthData?.storage_status || t('dashboard.operational', 'ដំណើរការល្អ'),
      icon: <HardDrive className="w-4 h-4 text-amber-500" />,
    },
  ]

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-500" />
          {t('dashboard.systemHealth', 'សុខភាព និងស្ថានភាពប្រព័ន្ធ')}
        </h3>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          {t('dashboard.operational', 'ដំណើរការល្អប្រកបដោយសុវត្ថិភាព')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, idx) => {
          const isGood = item.status === 'Operational' || item.status === t('dashboard.operational', 'ដំណើរការល្អ')
          return (
            <div key={idx} className="p-3 bg-muted/30 border border-border/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.icon}
                <div>
                  <span className="text-[11px] font-bold text-foreground block truncate max-w-[120px]">{item.name}</span>
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}>
                    {isGood ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SystemHealthWidget
