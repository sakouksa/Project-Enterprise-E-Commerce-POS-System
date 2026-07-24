import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Switch, Button, Tabs, Tag } from 'antd'
import {
  FileText, Sparkles, Monitor, Smartphone, Save, Eye, Palette, Layers, Code
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NotificationTemplateItem } from '@/types/notification'
import notificationService from '@/services/notificationService'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'

interface TemplateEditorModalProps {
  open: boolean
  template: NotificationTemplateItem | null
  onClose: () => void
  onSuccess: () => void
}

const SUPPORTED_VARIABLES = [
  '{{employee}}',
  '{{customer}}',
  '{{supplier}}',
  '{{product}}',
  '{{invoice}}',
  '{{purchase}}',
  '{{sale}}',
  '{{company}}',
  '{{branch}}',
  '{{warehouse}}',
  '{{amount}}',
  '{{date}}',
]

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
  amount: 'Rp 24,500,000',
  date: '2026-07-24',
}

const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  open,
  template,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [activePreviewDevice, setActivePreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [titleTemplate, setTitleTemplate] = useState('')
  const [messageTemplate, setMessageTemplate] = useState('')

  useEffect(() => {
    if (open) {
      if (template) {
        form.setFieldsValue(template)
        setTitleTemplate(template.title_template)
        setMessageTemplate(template.message_template)
      } else {
        form.resetFields()
        form.setFieldsValue({ priority: 'normal', type: 'system', is_active: true })
        setTitleTemplate('')
        setMessageTemplate('')
      }
    }
  }, [open, template])

  const handleInsertVariable = (variable: string) => {
    const currentMsg = form.getFieldValue('message_template') || ''
    const updated = currentMsg + ' ' + variable
    form.setFieldsValue({ message_template: updated })
    setMessageTemplate(updated)
  }

  const renderLiveText = (tmpl: string) => {
    let rendered = tmpl || ''
    Object.entries(SAMPLE_DATA).forEach(([k, v]) => {
      rendered = rendered.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v)
      rendered = rendered.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    })
    return rendered
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      if (template) {
        await notificationService.updateTemplate(template.id, values)
        sound.playSuccess()
        toast.success('Notification template updated successfully!')
      } else {
        await notificationService.createTemplate(values)
        sound.playSuccess()
        toast.success('Notification template created successfully!')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      sound.playError()
      toast.error(error.response?.data?.message || 'Failed to save template.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title={
        <div className="flex items-center gap-2 text-foreground font-bold text-base border-b border-border/40 pb-3">
          <FileText className="w-5 h-5 text-primary" />
          <span>{template ? 'Edit Notification Template' : 'New Notification Template'}</span>
        </div>
      }
      className="rounded-2xl overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Editor Form Column */}
        <div className="lg:col-span-7 space-y-4">
          <Form form={form} layout="vertical" onValuesChange={(_, all) => {
            setTitleTemplate(all.title_template || '')
            setMessageTemplate(all.message_template || '')
          }}>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Template Code" name="code" rules={[{ required: true }]}>
                <Input placeholder="e.g. NEW_SALE, STOCK_LOW" disabled={!!template} />
              </Form.Item>

              <Form.Item label="Template Name" name="name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Low Stock Alert" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                <Select>
                  {['system', 'inventory', 'purchase', 'sales', 'customer', 'supplier', 'employee', 'attendance', 'payroll', 'finance', 'expense', 'payment', 'security', 'report', 'warning', 'success', 'error'].map((t) => (
                    <Select.Option key={t} value={t} className="capitalize">{t}</Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="low">Low</Select.Option>
                  <Select.Option value="normal">Normal</Select.Option>
                  <Select.Option value="high">High</Select.Option>
                  <Select.Option value="critical">Critical</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item label="Title Template" name="title_template" rules={[{ required: true }]}>
              <Input placeholder="e.g. Order {{sale}} Completed for {{customer}}" />
            </Form.Item>

            {/* Supported Variable Insertion Chips */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-muted-foreground block">
                Click Variable to Insert into Message:
              </span>
              <div className="flex flex-wrap gap-1.5 p-2.5 bg-muted/40 rounded-xl border border-border/40">
                {SUPPORTED_VARIABLES.map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => handleInsertVariable(v)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-card border border-border/60 hover:border-primary hover:text-primary transition-all shadow-2xs"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <Form.Item label="Message Template" name="message_template" rules={[{ required: true }]} className="mt-3">
              <Input.TextArea rows={4} placeholder="e.g. Sale {{sale}} for amount {{amount}} completed." />
            </Form.Item>

            <Form.Item label="Is Active Status" name="is_active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading} icon={<Save className="w-4 h-4" />}>
              Save Template
            </Button>
          </div>
        </div>

        {/* Live Preview Panel Column */}
        <div className="lg:col-span-5 border-l border-border/40 pl-0 lg:pl-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Eye className="w-4 h-4 text-primary" />
              <span>Live Preview Panel</span>
            </div>

            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActivePreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-all ${
                  activePreviewDevice === 'desktop' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-all ${
                  activePreviewDevice === 'mobile' ? 'bg-card text-primary shadow-xs' : 'text-muted-foreground'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex justify-center pt-2">
            {activePreviewDevice === 'desktop' ? (
              /* Desktop Toast Notification Preview */
              <div className="w-full bg-card border border-border/60 rounded-2xl p-4 shadow-xl space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-bold text-xs text-foreground">
                      {renderLiveText(titleTemplate) || 'Title Preview'}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Just now</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {renderLiveText(messageTemplate) || 'Message content preview will appear here in real-time...'}
                </p>
              </div>
            ) : (
              /* Mobile Push Notification Mockup */
              <div className="w-64 bg-slate-900 text-white rounded-3xl p-4 shadow-2xl border-4 border-slate-700 space-y-3">
                <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto" />
                <div className="bg-slate-800/90 rounded-2xl p-3 space-y-1.5 border border-slate-700/50 shadow-md">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-primary">Enterprise POS</span>
                    <span>now</span>
                  </div>
                  <span className="font-bold text-xs text-white block">
                    {renderLiveText(titleTemplate) || 'Mobile Title'}
                  </span>
                  <p className="text-[11px] text-slate-300 line-clamp-3">
                    {renderLiveText(messageTemplate) || 'Mobile notification preview...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TemplateEditorModal
