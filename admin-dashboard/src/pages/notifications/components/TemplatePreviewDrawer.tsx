import React, { useState } from 'react'
import { Drawer, Tabs, Tag, Button } from 'antd'
import { Monitor, Smartphone, Mail, Bell, Sparkles, X, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NotificationTemplateItem } from '@/types/notification'

interface TemplatePreviewDrawerProps {
  open: boolean
  template: NotificationTemplateItem | null
  onClose: () => void
}

const SAMPLE_DATA: Record<string, string> = {
  employee: 'Alexander Smith',
  customer: 'Ly Socheat',
  supplier: 'Tech Logistics Ltd',
  product: 'MacBook Pro M3 Max 16"',
  invoice: 'INV-2026-8819',
  purchase: 'PO-2026-4410',
  sale: 'SO-9831',
  company: 'Enterprise POS Inc.',
  branch: 'Main Flagship Store',
  warehouse: 'Central Warehouse Hub',
  amount: '$2,450.00',
  date: '2026-07-24',
}

const TemplatePreviewDrawer: React.FC<TemplatePreviewDrawerProps> = ({ open, template, onClose }) => {
  const { t } = useTranslation()

  if (!template) return null

  const renderTemplateText = (text: string) => {
    let result = text || ''
    Object.entries(SAMPLE_DATA).forEach(([key, val]) => {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), val)
    })
    return result
  }

  const renderedTitle = renderTemplateText(template.title_template)
  const renderedMessage = renderTemplateText(template.message_template)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={560}
      closeIcon={false}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground leading-none">
              {t('notification.template.preview_desktop', 'Live Multi-Channel Preview')}
            </h3>
            <span className="text-[11px] font-mono text-primary">[{template.code}] {template.name}</span>
          </div>
        </div>
      }
      extra={
        <button
          onClick={onClose}
          className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      }
      className="enterprise-drawer"
    >
      <div className="space-y-6">
        {/* Template Meta Card */}
        <div className="p-4 bg-card border border-border/50 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <Tag className="capitalize font-bold text-xs">{template.type}</Tag>
            <Tag color={template.priority === 'critical' ? 'red' : 'blue'} className="uppercase font-bold text-[10px]">
              {template.priority} Priority
            </Tag>
          </div>
          <h4 className="font-bold text-sm text-foreground">{template.name}</h4>
        </div>

        {/* Multi-Channel Preview Tabs */}
        <Tabs
          defaultActiveKey="desktop"
          items={[
            {
              key: 'desktop',
              label: (
                <span className="flex items-center gap-1.5 font-bold text-xs">
                  <Monitor className="w-4 h-4 text-primary" />
                  {t('notification.template.preview_desktop', 'Desktop Toast')}
                </span>
              ),
              children: (
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center min-h-[260px]">
                  <div className="w-full max-w-sm bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-2xl space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold text-slate-200">Enterprise POS</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Just now</span>
                    </div>
                    <h5 className="font-bold text-sm text-white">{renderedTitle}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{renderedMessage}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'mobile',
              label: (
                <span className="flex items-center gap-1.5 font-bold text-xs">
                  <Smartphone className="w-4 h-4 text-primary" />
                  {t('notification.template.preview_mobile', 'Mobile Screen')}
                </span>
              ),
              children: (
                <div className="flex justify-center p-4 bg-muted/20 rounded-3xl border border-border/40">
                  <div className="w-64 h-[360px] bg-slate-950 border-4 border-slate-700 rounded-[36px] p-3 shadow-2xl flex flex-col justify-start space-y-3 relative overflow-hidden">
                    <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto" />
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-sky-400">Enterprise POS</span>
                        <span>now</span>
                      </div>
                      <h6 className="font-bold text-xs text-white leading-tight">{renderedTitle}</h6>
                      <p className="text-[11px] text-slate-300 line-clamp-3 leading-snug">{renderedMessage}</p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: 'email',
              label: (
                <span className="flex items-center gap-1.5 font-bold text-xs">
                  <Mail className="w-4 h-4 text-primary" />
                  {t('notification.template.preview_email', 'Email Template')}
                </span>
              ),
              children: (
                <div className="p-4 bg-muted/30 rounded-2xl border border-border/40 space-y-4">
                  <div className="p-4 bg-white text-slate-900 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                    <div className="border-b border-slate-100 pb-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">From: Enterprise System &lt;notifications@enterprisepos.com&gt;</span>
                      <h5 className="font-bold text-base text-slate-900 mt-1">{renderedTitle}</h5>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{renderedMessage}</p>
                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <Button type="primary" size="small" className="rounded-xl font-bold">
                        Open Enterprise Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Drawer>
  )
}

export default TemplatePreviewDrawer
