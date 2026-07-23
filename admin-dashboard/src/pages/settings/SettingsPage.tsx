import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Save,
  CheckCircle,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Globe,
  FileText,
  Loader2,
  X,
  Store,
  Palette,
  Percent,
  MapPin,
  Shield,
  Receipt,
  Mail,
  Building2,
  RefreshCw,
  Search,
  Check,
  AlertCircle,
  Layers,
  Flag,
  Navigation,
  Sparkles
} from 'lucide-react'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import AppearanceSettings from './AppearanceSettings'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SearchInput from '@/components/shared/SearchInput'

interface SettingItem {
  id: number
  key: string
  value: string
  type: string
}

type MainTab = 'store' | 'appearance' | 'taxes_units' | 'locations'

const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const toast = useToast()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<MainTab>('store')

  // Store profile fields
  const [success, setSuccess] = useState(false)
  const [siteName, setSiteName] = useState('')
  const [siteEmail, setSiteEmail] = useState('')
  const [receiptHeader, setReceiptHeader] = useState('')
  const [receiptFooter, setReceiptFooter] = useState('')

  // Sub tabs
  const [subTabTaxesUnits, setSubTabTaxesUnits] = useState<'taxes' | 'units'>('taxes')
  const [subTabLocations, setSubTabLocations] = useState<'countries' | 'provinces' | 'cities'>('countries')

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')

  // Modal & Edit states
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; path: string } | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)

  // Form states
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [rate, setRate] = useState('')
  const [taxType, setTaxType] = useState('percentage')
  const [isActive, setIsActive] = useState(true)
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')

  // Location form fields
  const [phoneCode, setPhoneCode] = useState('')
  const [countryId, setCountryId] = useState('')
  const [provinceId, setProvinceId] = useState('')
  const [cityType, setCityType] = useState('city')
  const [postalCode, setPostalCode] = useState('')

  // Load Settings
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data.data),
    enabled: activeTab === 'store',
  })

  // Load Helpers depending on tabs
  const { data: taxesData, isLoading: taxesLoading } = useQuery({
    queryKey: ['taxes'],
    queryFn: () => api.get('/taxes', { params: { per_page: 50 } }).then(r => r.data.data),
    enabled: activeTab === 'taxes_units' && subTabTaxesUnits === 'taxes',
  })

  const { data: unitsData, isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: () => api.get('/units', { params: { per_page: 50 } }).then(r => r.data.data),
    enabled: activeTab === 'taxes_units' && subTabTaxesUnits === 'units',
  })

  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: () => api.get('/countries', { params: { per_page: 50 } }).then(r => r.data.data),
    enabled: activeTab === 'locations' || (activeTab === 'taxes_units' && subTabTaxesUnits === 'taxes'),
  })

  const { data: provincesData, isLoading: provincesLoading } = useQuery({
    queryKey: ['provinces'],
    queryFn: () => api.get('/provinces', { params: { per_page: 50 } }).then(r => r.data.data),
    enabled: activeTab === 'locations',
  })

  const { data: citiesData, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: () => api.get('/cities', { params: { per_page: 50 } }).then(r => r.data.data),
    enabled: activeTab === 'locations' && subTabLocations === 'cities',
  })

  useEffect(() => {
    if (settingsData) {
      const getVal = (key: string) => settingsData.find((s: SettingItem) => s.key === key)?.value ?? ''
      setSiteName(getVal('site_name') || 'Enterprise E-Commerce')
      setSiteEmail(getVal('site_email') || 'info@enterprise-pos.com')
      setReceiptHeader(getVal('pos_receipt_header') || 'Thank you for shopping with us!')
      setReceiptFooter(getVal('pos_receipt_footer') || 'Please visit again.')
    }
  }, [settingsData])

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: (payload: any) => api.post('/settings', payload),
    onSuccess: () => {
      setSuccess(true)
      toast.success('Global settings updated successfully!')
      qc.invalidateQueries({ queryKey: ['settings'] })
      setTimeout(() => setSuccess(false), 3000)
    },
    onError: () => {
      toast.error('Failed to save settings.')
    }
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettingsMutation.mutate({
      company_id: 1,
      settings: {
        site_name: siteName,
        site_email: siteEmail,
        pos_receipt_header: receiptHeader,
        pos_receipt_footer: receiptFooter,
      }
    })
  }

  // CRUD Mutations
  const createMutation = useMutation({
    mutationFn: ({ path, payload }: { path: string; payload: any }) => api.post(path, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [variables.path.replace('/', '')] })
      setModalOpen(false)
      toast.success('Configuration item created successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create item.')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ path, id, payload }: { path: string; id: number; payload: any }) => api.put(`${path}/${id}`, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [variables.path.replace('/', '')] })
      setModalOpen(false)
      toast.success('Configuration item updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update item.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ({ path, id }: { path: string; id: number }) => api.delete(`${path}/${id}`),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [variables.path.replace('/', '')] })
      setConfirmOpen(false)
      toast.success('Item deleted successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete item.')
      setConfirmOpen(false)
    }
  })

  // Modal Handlers
  const handleOpenCreate = () => {
    setEditingItem(null)
    setName('')
    setCode('')
    setRate('')
    setTaxType('percentage')
    setIsActive(true)
    setSymbol('')
    setDescription('')
    setPhoneCode('')
    setCountryId('')
    setProvinceId('')
    setCityType('city')
    setPostalCode('')
    setModalOpen(true)
  }

  const handleOpenEdit = (item: any) => {
    setEditingItem(item)
    setName(item.name ?? '')
    setCode(item.code ?? '')
    setRate(item.rate ?? '')
    setTaxType(item.type ?? 'percentage')
    setIsActive(item.is_active ?? true)
    setSymbol(item.symbol ?? '')
    setDescription(item.description ?? '')
    setPhoneCode(item.phone_code ?? '')
    setCountryId(item.country_id ?? '')
    setProvinceId(item.province_id ?? '')
    setCityType(item.type ?? 'city')
    setPostalCode(item.postal_code ?? '')
    setModalOpen(true)
  }

  const getActivePath = () => {
    if (activeTab === 'taxes_units') {
      return subTabTaxesUnits === 'taxes' ? '/taxes' : '/units'
    } else {
      if (subTabLocations === 'countries') return '/countries'
      if (subTabLocations === 'provinces') return '/provinces'
      return '/cities'
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const path = getActivePath()
    let payload: any = {}

    if (path === '/taxes') {
      payload = { company_id: 1, name, rate: Number(rate), type: taxType, is_active: isActive ? 1 : 0 }
    } else if (path === '/units') {
      payload = { company_id: 1, name, symbol, description, is_active: isActive ? 1 : 0 }
    } else if (path === '/countries') {
      payload = { name, code, phone_code: phoneCode, is_active: isActive ? 1 : 0 }
    } else if (path === '/provinces') {
      payload = { country_id: Number(countryId), name, code }
    } else if (path === '/cities') {
      payload = { province_id: Number(provinceId), name, type: cityType, postal_code: postalCode }
    }

    if (editingItem) {
      updateMutation.mutate({ path, id: editingItem.id, payload })
    } else {
      createMutation.mutate({ path, payload })
    }
  }

  const triggerDelete = (id: number) => {
    setDeleteTarget({ id, path: getActivePath() })
    setConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate({ path: deleteTarget.path, id: deleteTarget.id })
    }
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* ── 1. PAGE HEADER ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
            <span>System Management</span>
            <span>/</span>
            <span className="text-foreground font-bold">Global Settings</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Settings className="text-primary" size={26} />
            Global Settings & System Preferences
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl mt-1 leading-relaxed">
            Configure system preferences, store identity, thermal POS receipt templates, tax structures, measurement units, and geographic location master records.
          </p>
        </div>

        {/* Top Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-2xl border border-border/80 shrink-0 shadow-2xs">
          {[
            { id: 'store', label: 'Store Profile', icon: Store },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'taxes_units', label: 'Taxes & Units', icon: Percent },
            { id: 'locations', label: 'Locations', icon: MapPin },
          ].map((t) => {
            const Icon = t.icon
            const isActiveTab = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as MainTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActiveTab
                    ? 'bg-card text-primary shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon size={14} className={isActiveTab ? 'text-primary' : 'text-muted-foreground'} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 3. TAB CONTENT SECTION ───────────────────────────────────────── */}

      {/* TAB 1: STORE PROFILE & POS RECEIPT CUSTOMIZER */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm"
            >
              <CheckCircle size={18} />
              Global store settings and POS receipt configuration saved successfully!
            </motion.div>
          )}

          {settingsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="skeleton h-96 rounded-[24px]" />
              <div className="skeleton h-96 rounded-[24px]" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* STORE PROFILE SETTINGS */}
              <div className="lg:col-span-7 bg-card rounded-[24px] border border-border/80 p-6 shadow-lg space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border/70">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">Store Profile Settings</h3>
                      <p className="text-xs text-muted-foreground">General branding & corporate identity details</p>
                    </div>
                  </div>
                  <Sparkles className="text-primary/40" size={20} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Site / Store Name
                    </label>
                    <div className="relative">
                      <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        required
                        placeholder="Enterprise E-Commerce"
                        className="form-input pl-10 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Support Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        value={siteEmail}
                        onChange={(e) => setSiteEmail(e.target.value)}
                        required
                        placeholder="info@enterprise-pos.com"
                        className="form-input pl-10 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Base Currency
                      </label>
                      <select className="form-select text-sm font-semibold">
                        <option value="USD">USD ($ - US Dollar)</option>
                        <option value="KHR">KHR (៛ - Cambodian Riel)</option>
                        <option value="EUR">EUR (€ - Euro)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Timezone
                      </label>
                      <select className="form-select text-sm font-semibold">
                        <option value="Asia/Phnom_Penh">Asia/Phnom_Penh (UTC+7)</option>
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Changes apply across all admin panels & POS terminals.
                  </div>
                  <button
                    type="submit"
                    disabled={updateSettingsMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {updateSettingsMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save Profile Settings
                  </button>
                </div>
              </div>

              {/* POS RECEIPT CUSTOMIZER & LIVE PREVIEW */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-card rounded-[24px] border border-border/80 p-6 shadow-lg space-y-6">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-border/70">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">POS Receipt Customizer</h3>
                      <p className="text-xs text-muted-foreground">Thermal receipt header & footer text</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Receipt Header Text
                      </label>
                      <input
                        value={receiptHeader}
                        onChange={(e) => setReceiptHeader(e.target.value)}
                        placeholder="Thank you for shopping with us!"
                        className="form-input text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Receipt Footer Text
                      </label>
                      <input
                        value={receiptFooter}
                        onChange={(e) => setReceiptFooter(e.target.value)}
                        placeholder="Please visit again."
                        className="form-input text-sm"
                      />
                    </div>
                  </div>

                  {/* LIVE THERMAL RECEIPT PREVIEW BOX */}
                  <div className="pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                      <span>Live Thermal Receipt Preview</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">80mm Paper</span>
                    </div>
                    <div className="bg-amber-500/5 dark:bg-slate-900 border border-dashed border-amber-500/30 rounded-2xl p-4 font-mono text-[11px] text-foreground space-y-2 shadow-inner">
                      <div className="text-center font-bold text-sm tracking-wide">
                        {siteName || 'ENTERPRISE E-COMMERCE'}
                      </div>
                      <div className="text-center text-muted-foreground text-[10px]">
                        {receiptHeader || 'Thank you for shopping with us!'}
                      </div>
                      <div className="border-b border-dashed border-border py-1 text-[10px] text-muted-foreground flex justify-between">
                        <span>Inv #: POS-8841</span>
                        <span>Date: 7/22/2026</span>
                      </div>
                      <div className="space-y-1 py-1 text-xs">
                        <div className="flex justify-between">
                          <span>1x Wireless Mouse</span>
                          <span>$25.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>2x Mechanical Keyboard</span>
                          <span>$140.00</span>
                        </div>
                      </div>
                      <div className="border-t border-dashed border-border pt-1 font-bold text-xs flex justify-between">
                        <span>TOTAL AMOUNT:</span>
                        <span>$165.00</span>
                      </div>
                      <div className="text-center text-[10px] text-muted-foreground pt-2">
                        {receiptFooter || 'Please visit again.'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={updateSettingsMutation.isPending}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Save size={15} />
                      Save Receipt Template
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: APPEARANCE */}
      {activeTab === 'appearance' && <AppearanceSettings />}

      {/* TAB 3: TAXES & MEASUREMENT UNITS */}
      {activeTab === 'taxes_units' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-card p-4 rounded-[24px] border border-border/80 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubTabTaxesUnits('taxes')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  subTabTaxesUnits === 'taxes'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                Tax Configurations
              </button>
              <button
                onClick={() => setSubTabTaxesUnits('units')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  subTabTaxesUnits === 'units'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                Measurement Units
              </button>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer"
            >
              <Plus size={14} /> Add {subTabTaxesUnits === 'taxes' ? 'Tax Structure' : 'Unit Item'}
            </button>
          </div>

          {/* TABLE CONTAINER (EMPLOYEE STYLE) */}
          <div className="bg-card rounded-[24px] border border-border/80 shadow-lg overflow-hidden relative">
            {subTabTaxesUnits === 'taxes' ? (
              taxesLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5 pl-6 w-10"><input type="checkbox" className="rounded border-border" /></th>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">TAX NAME</th>
                      <th className="p-3.5">RATE (%)</th>
                      <th className="p-3.5">CALCULATION TYPE</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                    {taxesData?.length === 0 ? (
                      <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">No tax structures configured yet.</td></tr>
                    ) : (
                      taxesData?.map((t: any) => (
                        <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-3.5 pl-6"><input type="checkbox" className="rounded border-border" /></td>
                          <td className="p-3.5 font-bold text-foreground">{t.id}</td>
                          <td className="p-3.5 font-bold text-foreground">{t.name}</td>
                          <td className="p-3.5 font-bold text-emerald-600">{t.rate}%</td>
                          <td className="p-3.5 font-mono text-muted-foreground uppercase">{t.type}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              t.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                            }`}>
                              {t.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3.5 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleOpenEdit(t)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><Edit2 size={14} /></button>
                              <button onClick={() => triggerDelete(t.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )
            ) : (
              unitsLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5 pl-6 w-10"><input type="checkbox" className="rounded border-border" /></th>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">UNIT NAME</th>
                      <th className="p-3.5">SYMBOL</th>
                      <th className="p-3.5">DESCRIPTION</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                    {unitsData?.length === 0 ? (
                      <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">No measurement units configured yet.</td></tr>
                    ) : (
                      unitsData?.map((u: any) => (
                        <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                          <td className="p-3.5 pl-6"><input type="checkbox" className="rounded border-border" /></td>
                          <td className="p-3.5 font-bold text-foreground">{u.id}</td>
                          <td className="p-3.5 font-bold text-foreground">{u.name}</td>
                          <td className="p-3.5 font-mono font-bold text-purple-600">{u.symbol}</td>
                          <td className="p-3.5 text-muted-foreground">{u.description || '-'}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                            }`}>
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3.5 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleOpenEdit(u)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><Edit2 size={14} /></button>
                              <button onClick={() => triggerDelete(u.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LOCATIONS MASTER LIST */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-card p-4 rounded-[24px] border border-border/80 shadow-sm">
            <div className="flex items-center gap-2">
              {[
                { id: 'countries', label: 'Countries' },
                { id: 'provinces', label: 'Provinces / States' },
                { id: 'cities', label: 'Cities & Districts' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSubTabLocations(loc.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    subTabLocations === loc.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer"
            >
              <Plus size={14} /> Add Location Record
            </button>
          </div>

          <div className="bg-card rounded-[24px] border border-border/80 shadow-lg overflow-hidden relative">
            {subTabLocations === 'countries' && (
              countriesLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5 pl-6 w-10"><input type="checkbox" className="rounded border-border" /></th>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">COUNTRY NAME</th>
                      <th className="p-3.5">ISO CODE</th>
                      <th className="p-3.5">DIAL CODE</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                    {countriesData?.map((c: any) => (
                      <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-3.5 pl-6"><input type="checkbox" className="rounded border-border" /></td>
                        <td className="p-3.5 font-bold text-foreground">{c.id}</td>
                        <td className="p-3.5 font-bold text-foreground">{c.name}</td>
                        <td className="p-3.5 font-mono text-muted-foreground font-semibold">{c.code}</td>
                        <td className="p-3.5 font-mono text-blue-600">+{c.phone_code}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            c.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                          }`}>
                            {c.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3.5 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenEdit(c)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><Edit2 size={14} /></button>
                            <button onClick={() => triggerDelete(c.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {subTabLocations === 'provinces' && (
              provincesLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5 pl-6 w-10"><input type="checkbox" className="rounded border-border" /></th>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">PROVINCE / STATE NAME</th>
                      <th className="p-3.5">PROVINCE CODE</th>
                      <th className="p-3.5">COUNTRY</th>
                      <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                    {provincesData?.map((p: any) => (
                      <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-3.5 pl-6"><input type="checkbox" className="rounded border-border" /></td>
                        <td className="p-3.5 font-bold text-foreground">{p.id}</td>
                        <td className="p-3.5 font-bold text-foreground">{p.name}</td>
                        <td className="p-3.5 font-mono text-muted-foreground font-semibold">{p.code}</td>
                        <td className="p-3.5 text-foreground font-semibold">{p.country?.name ?? 'Cambodia'}</td>
                        <td className="p-3.5 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenEdit(p)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><Edit2 size={14} /></button>
                            <button onClick={() => triggerDelete(p.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {subTabLocations === 'cities' && (
              citiesLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="p-3.5 pl-6 w-10"><input type="checkbox" className="rounded border-border" /></th>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">CITY / DISTRICT NAME</th>
                      <th className="p-3.5">TYPE</th>
                      <th className="p-3.5">POSTAL CODE</th>
                      <th className="p-3.5">PROVINCE</th>
                      <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                    {citiesData?.map((ci: any) => (
                      <tr key={ci.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-3.5 pl-6"><input type="checkbox" className="rounded border-border" /></td>
                        <td className="p-3.5 font-bold text-foreground">{ci.id}</td>
                        <td className="p-3.5 font-bold text-foreground">{ci.name}</td>
                        <td className="p-3.5 capitalize font-mono text-muted-foreground">{ci.type}</td>
                        <td className="p-3.5 font-mono text-blue-600 font-bold">{ci.postal_code}</td>
                        <td className="p-3.5 text-foreground font-semibold">{ci.province?.name ?? 'Phnom Penh'}</td>
                        <td className="p-3.5 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenEdit(ci)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"><Edit2 size={14} /></button>
                            <button onClick={() => triggerDelete(ci.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      )}

      {/* Settings CRUD Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-[24px] p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">
                  {editingItem ? 'Edit Configuration Record' : 'Add New Configuration'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {activeTab === 'taxes_units' && subTabTaxesUnits === 'taxes' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Tax Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Rate (%)</label>
                        <input type="number" required value={rate} onChange={e => setRate(e.target.value)} className="form-input text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Type</label>
                        <select value={taxType} onChange={e => setTaxType(e.target.value)} className="form-select text-xs">
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-primary" />
                      <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer">Active Status</label>
                    </div>
                  </>
                )}

                {activeTab === 'taxes_units' && subTabTaxesUnits === 'units' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Unit Name</label>
                      <input type="text" required placeholder="e.g. Kilogram, Piece" value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Symbol</label>
                      <input type="text" required placeholder="e.g. kg, pcs" value={symbol} onChange={e => setSymbol(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Description</label>
                      <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input text-xs min-h-[60px]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-primary" />
                      <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer">Active Status</label>
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'countries' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Country Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">ISO Code</label>
                        <input type="text" required placeholder="e.g. US, KH" value={code} onChange={e => setCode(e.target.value)} className="form-input text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Phone Dial Code</label>
                        <input type="text" required placeholder="e.g. 1, 855" value={phoneCode} onChange={e => setPhoneCode(e.target.value)} className="form-input text-xs" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-primary" />
                      <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer">Active Status</label>
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'provinces' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Country</label>
                      <select required value={countryId} onChange={e => setCountryId(e.target.value)} className="form-select text-xs">
                        <option value="">Select Country</option>
                        {countriesData?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Province Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Province Code</label>
                      <input type="text" required placeholder="e.g. CA-01" value={code} onChange={e => setCode(e.target.value)} className="form-input text-xs" />
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'cities' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Province</label>
                      <select required value={provinceId} onChange={e => setProvinceId(e.target.value)} className="form-select text-xs">
                        <option value="">Select Province</option>
                        {provincesData?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">City Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Type</label>
                        <select value={cityType} onChange={e => setCityType(e.target.value)} className="form-select text-xs">
                          <option value="city">City</option>
                          <option value="district">District</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Postal Code</label>
                        <input type="text" required value={postalCode} onChange={e => setPostalCode(e.target.value)} className="form-input text-xs" />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 border-t border-border pt-3 mt-4">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs font-semibold border border-border rounded-xl">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl flex items-center gap-1.5">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={14} />}
                    Save Configuration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Configuration Item"
        message="Are you sure you want to delete this configuration item?"
      />
    </div>
  )
}

export default SettingsPage
