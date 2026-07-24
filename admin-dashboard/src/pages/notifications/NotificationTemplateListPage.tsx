import React, { useState, useEffect, useCallback } from 'react'
import {
  FileText, Plus, RefreshCw, Search, Eye, Edit2, Trash2, Tag, Copy,
  CheckCircle2, AlertCircle, ShoppingCart, ShoppingBag, DollarSign,
  ShieldAlert, Settings, Star, Layers, X, Radio, Send, Bell, Code, Mail, Smartphone
} from 'lucide-react'
import { Input, Modal, Tooltip, Switch } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import notificationService from '@/services/notificationService'
import type { NotificationTemplateItem } from '@/types/notification'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'
import Breadcrumb from '@/components/common/Breadcrumb'
import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog'
import Pagination from '@/components/shared/Pagination'
import TemplateEditorModal from './components/TemplateEditorModal'

const NotificationTemplateListPage: React.FC = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<NotificationTemplateItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  // Filters
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  // Delete Confirm Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<{ id: number; name: string } | null>(null)
  const [deletePending, setDeletePending] = useState(false)

  // Modals & Drawers
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplateItem | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplateItem | null>(null)

  const fetchTemplates = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await notificationService.getTemplates({
        page,
        per_page: pageSize,
        search: search || undefined,
        type: typeFilter,
        is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
      })
      setTemplates(res.data || [])
      setTotal(res.total || 0)
    } catch (e) {
      console.error(e)
      sound.playError()
      toast.error('Failed to load notification templates.')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [page, pageSize, search, typeFilter, statusFilter])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const handleResetFilters = () => {
    setSearch('')
    setTypeFilter(undefined)
    setStatusFilter(undefined)
    setPage(1)
  }

  const handleToggleActive = async (template: NotificationTemplateItem) => {
    try {
      await notificationService.toggleTemplateStatus(template.id)
      sound.playSuccess()
      toast.success('Template status updated successfully!')
      fetchTemplates(true)
    } catch (e) {
      sound.playError()
      toast.error('Failed to update template status.')
    }
  }

  const handleConfirmDelete = (template: NotificationTemplateItem) => {
    setTemplateToDelete({ id: template.id, name: template.name })
    setDeleteDialogOpen(true)
  }

  const handleExecuteDelete = async () => {
    if (!templateToDelete) return
    setDeletePending(true)
    try {
      await notificationService.deleteTemplate(templateToDelete.id)
      sound.playSuccess()
      toast.success('Template deleted successfully!')
      setDeleteDialogOpen(false)
      setTemplateToDelete(null)
      fetchTemplates(true)
    } catch (e) {
      sound.playError()
      toast.error('Failed to delete template.')
    } finally {
      setDeletePending(false)
    }
  }

  const handleDuplicate = async (id: number) => {
    try {
      const newTemplate = await notificationService.duplicateTemplate(id)
      sound.playSuccess()
      toast.success('Template duplicated successfully!')
      if (newTemplate) {
        setTemplates((prev) => [newTemplate, ...prev])
        setTotal((prev) => prev + 1)
        fetchTemplates(true)
      } else {
        fetchTemplates(true)
      }
    } catch (e) {
      sound.playError()
      toast.error('Failed to duplicate template.')
    }
  }

  // Summary Metrics
  const activeCount = templates.filter((t) => t.is_active).length
  const inactiveCount = templates.filter((t) => !t.is_active).length
  const systemCount = templates.filter((t) => t.type === 'system').length
  const salesCount = templates.filter((t) => t.type === 'sales').length
  const inventoryCount = templates.filter((t) => t.type === 'inventory').length
  const financeCount = templates.filter((t) => t.type === 'finance').length

  const categoryTabs = [
    { key: 'all', label: 'All Templates' },
    { key: 'active', label: 'Active Only' },
    { key: 'inactive', label: 'Disabled' },
    { key: 'system', label: 'System' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'sales', label: 'Sales' },
    { key: 'finance', label: 'Finance' },
  ]

  return (
    <div className="space-y-5 print:p-0">
      {/* ── 1. BREADCRUMB ─────────────────────────────────────────────────── */}
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Notification Templates' }]} />

      {/* ── 2. TOP 4 SIMPLE YET ELEGANT METRIC CARDS ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: TOTAL TEMPLATES */}
        <div className="p-5 rounded-[20px] bg-card border border-border/80 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Template Library</div>
            <div className="text-2xl font-black text-foreground mt-1 tracking-tight">{total || templates.length} Presets</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
              <span className="text-emerald-600 font-bold">{activeCount} Active</span>
              <span>•</span>
              <span className="text-muted-foreground font-semibold">{inactiveCount} Disabled</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <FileText size={22} />
          </div>
        </div>

        {/* CARD 2: SYSTEM PRESETS */}
        <div className="p-5 rounded-[20px] bg-card border border-border/80 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">System Alerts</div>
            <div className="text-2xl font-black text-foreground mt-1 tracking-tight">{systemCount} Presets</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
              <span className="text-purple-600 font-bold">Auto-Triggered</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600">
            <Radio size={22} />
          </div>
        </div>

        {/* CARD 3: MULTI-CHANNEL SUPPORT */}
        <div className="p-5 rounded-[20px] bg-card border border-border/80 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Gateways</div>
            <div className="text-2xl font-black text-foreground mt-1 tracking-tight">3 Channels</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
              <span className="text-blue-600 font-bold">Email • Push • SMS</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
            <Send size={22} />
          </div>
        </div>

        {/* CARD 4: AUTOMATION ACCURACY */}
        <div className="p-5 rounded-[20px] bg-card border border-border/80 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Dispatch SLA</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tracking-tight">99.4%</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
              <span className="text-emerald-600 font-bold">100% Reliable</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* ── 3. SECOND ROW: 6 QUICK MINI METRIC CARDS ──────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Active Templates */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-primary/30 transition-all">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Plus size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">+{activeCount} Active</div>
            <div className="text-[10px] text-muted-foreground font-medium">Templates Ready</div>
          </div>
        </div>

        {/* 2. Stock Templates */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-amber-500/30 transition-all">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <ShieldAlert size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{inventoryCount}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Stock Presets</div>
          </div>
        </div>

        {/* 3. Disabled Templates */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-rose-500/30 transition-all">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
            <X size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{inactiveCount}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Disabled</div>
          </div>
        </div>

        {/* 4. Sales Templates */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-emerald-500/30 transition-all">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <ShoppingCart size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{salesCount}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Sales Presets</div>
          </div>
        </div>

        {/* 5. Finance Templates */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-purple-500/30 transition-all">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <DollarSign size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">{financeCount}</div>
            <div className="text-[10px] text-muted-foreground font-medium">Finance Presets</div>
          </div>
        </div>

        {/* 6. Recent System */}
        <div className="p-3.5 rounded-[20px] bg-card border border-border/70 shadow-2xs flex items-center gap-3 hover:border-cyan-500/30 transition-all">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
            <RefreshCw size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">{systemCount}</div>
            <div className="text-[10px] text-muted-foreground font-medium">System Presets</div>
          </div>
        </div>
      </div>

      {/* ── 4. CATEGORY TABS ──────────────────────────────────────────────── */}
      <div className="flex border border-border bg-card rounded-[20px] p-1.5 overflow-x-auto gap-1.5 shadow-2xs print:hidden">
        {categoryTabs.map((tab) => {
          const isActive = (typeFilter || statusFilter || 'all') === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.key === 'all') {
                  setTypeFilter(undefined)
                  setStatusFilter(undefined)
                } else if (tab.key === 'active' || tab.key === 'inactive') {
                  setStatusFilter(tab.key)
                  setTypeFilter(undefined)
                } else {
                  setTypeFilter(tab.key)
                  setStatusFilter(undefined)
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-white shadow-sm scale-102 font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── 5. SEARCH & TOOLBAR HEADER ────────────────────────────────────── */}
      <div className="bg-card border border-border/80 rounded-[24px] p-4 shadow-sm space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <Input
              placeholder="Search by code or template name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={fetchTemplates}
              prefix={<Search className="w-4 h-4 text-muted-foreground" />}
              allowClear
              className="rounded-xl text-xs py-1.5"
            />
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shadow-2xs cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingTemplate(null)
                setCreateModalOpen(true)
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:opacity-90 transition-all shadow-md cursor-pointer"
            >
              <Plus size={14} />
              <span>New Template</span>
            </button>
            <button
              onClick={fetchTemplates}
              className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 6. ULTRA-MODERN NOTIFICATION TEMPLATE GRID CARDS (NO TABLE) ────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 rounded-[24px] bg-card border border-border/70 animate-pulse h-48" />
          ))
        ) : templates.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card border border-border rounded-[24px]">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-base">No notification templates found</h3>
            <p className="text-xs text-muted-foreground mt-1">Try resetting search or category filters</p>
          </div>
        ) : (
          templates.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/80 rounded-[24px] p-5 shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Card Header: Code Badge & Status Switch */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary font-bold group-hover:scale-110 transition-transform">
                      <FileText size={16} />
                    </div>
                    <div>
                      <span className="font-mono font-black text-xs text-primary block">#{record.code}</span>
                      <span className="text-[10px] text-muted-foreground capitalize font-bold">{record.type} Preset</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={record.is_active}
                      onChange={() => handleToggleActive(record)}
                      size="small"
                    />
                    <span className={`text-[10px] font-bold ${record.is_active ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {record.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Card Body: Name, Subject & Content Snippet */}
                <div className="py-3.5 space-y-2 text-xs">
                  <h4 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {record.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 font-medium">
                    Subject: <span className="text-foreground">{record.subject || record.title || 'Notification Alert'}</span>
                  </p>
                  {record.content && (
                    <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 font-mono text-[11px] text-muted-foreground line-clamp-2">
                      {record.content}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Supported Channels & Action Buttons */}
              <div className="pt-3.5 border-t border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-sky-500/10 text-sky-600 border border-sky-500/20">EMAIL</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">PUSH</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {record.updated_at ? format(new Date(record.updated_at), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1 pt-1 border-t border-border/40">
                  <Tooltip title="Preview Template">
                    <button
                      onClick={() => setPreviewTemplate(record)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer rounded-xl hover:bg-muted"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Edit Template">
                    <button
                      onClick={() => {
                        setEditingTemplate(record)
                        setCreateModalOpen(true)
                      }}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Duplicate">
                    <button
                      onClick={() => handleDuplicate(record.id)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <button
                      onClick={() => handleConfirmDelete(record)}
                      className="p-2 text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      <div className="bg-card border border-border/80 rounded-[24px] p-4 shadow-2xs">
        <Pagination
          currentPage={page}
          lastPage={Math.ceil(total / pageSize) || 1}
          total={total}
          perPage={pageSize}
          onPageChange={setPage}
          onPerPageChange={(ps) => {
            setPageSize(ps)
            setPage(1)
          }}
          isLoading={loading}
        />
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Notification Template"
        itemName={templateToDelete?.name || ''}
        warningText="Are you sure you want to delete this notification template preset? This action cannot be undone."
        isPending={deletePending}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setTemplateToDelete(null)
        }}
        onSoftDelete={handleExecuteDelete}
      />

      {/* Create / Edit Modal */}
      <TemplateEditorModal
        open={createModalOpen}
        template={editingTemplate}
        onClose={() => {
          setCreateModalOpen(false)
          setEditingTemplate(null)
        }}
        onSuccess={fetchTemplates}
      />

      {/* Preview Modal */}
      <Modal
        open={previewTemplate !== null}
        onCancel={() => setPreviewTemplate(null)}
        footer={null}
        title={<span className="font-bold text-base">Template Preview: {previewTemplate?.name}</span>}
      >
        {previewTemplate && (
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-3 bg-muted/30 rounded-xl border border-border/60">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Subject / Title</span>
              <span className="font-bold text-foreground text-sm">{previewTemplate.subject || previewTemplate.name}</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl border border-border/60 space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Template Payload Content</span>
              <div className="font-mono text-foreground whitespace-pre-wrap">{previewTemplate.content}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default NotificationTemplateListPage
