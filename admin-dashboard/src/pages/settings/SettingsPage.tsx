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
import { useSearchParams } from 'react-router-dom'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import AppearanceSettings from './AppearanceSettings'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SearchInput from '@/components/shared/SearchInput'
import TableActionMenu from '@/components/shared/TableActionMenu'
import { useServerPagination } from '@/hooks/useServerPagination'

interface SettingItem {
  id: number
  key: string
  value: string
  type: string
}

type MainTab = 'store' | 'appearance' | 'taxes_units' | 'locations'

const SettingsPage: React.FC = () => {
  const { t } = useTranslation(['settings', 'common'])
  const toast = useToast()
  const qc = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTabParam = (searchParams.get('tab') as MainTab) || 'store'
  const [activeTab, setActiveTabState] = useState<MainTab>(currentTabParam)

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as MainTab
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl)
    }
  }, [searchParams])

  const setActiveTab = (tab: MainTab) => {
    setActiveTabState(tab)
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev)
      updated.set('tab', tab)
      return updated
    }, { replace: true })
  }

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

  // Server pagination state for taxes, units & locations
  const taxPagination = useServerPagination({ storageKey: 'settings_taxes', defaultPerPage: 10 })
  const unitPagination = useServerPagination({ storageKey: 'settings_units', defaultPerPage: 10 })
  const countryPagination = useServerPagination({ storageKey: 'settings_countries', defaultPerPage: 10 })
  const provincePagination = useServerPagination({ storageKey: 'settings_provinces', defaultPerPage: 10 })
  const cityPagination = useServerPagination({ storageKey: 'settings_cities', defaultPerPage: 10 })

  // Load Settings
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data.data),
    enabled: activeTab === 'store',
  })

  // Load Helpers depending on tabs
  const { data: taxesResponse, isLoading: taxesLoading } = useQuery({
    queryKey: ['taxes', taxPagination.page, taxPagination.perPage, taxPagination.debouncedSearch],
    queryFn: () => api.get('/taxes', {
      params: {
        page: taxPagination.page,
        per_page: taxPagination.perPage,
        search: taxPagination.debouncedSearch || undefined,
      }
    }).then(r => r.data),
    enabled: activeTab === 'taxes_units' && subTabTaxesUnits === 'taxes',
  })

  const { data: unitsResponse, isLoading: unitsLoading } = useQuery({
    queryKey: ['units', unitPagination.page, unitPagination.perPage, unitPagination.debouncedSearch],
    queryFn: () => api.get('/units', {
      params: {
        page: unitPagination.page,
        per_page: unitPagination.perPage,
        search: unitPagination.debouncedSearch || undefined,
      }
    }).then(r => r.data),
    enabled: activeTab === 'taxes_units' && subTabTaxesUnits === 'units',
  })

  const taxesData = Array.isArray(taxesResponse?.data)
    ? taxesResponse.data
    : Array.isArray(taxesResponse)
    ? taxesResponse
    : []

  const taxMeta = {
    total: taxesResponse?.pagination?.total ?? taxesResponse?.total ?? taxesData.length,
    current_page: taxesResponse?.pagination?.current_page ?? taxesResponse?.current_page ?? taxPagination.page,
    last_page: taxesResponse?.pagination?.last_page ?? taxesResponse?.last_page ?? (Math.ceil((taxesResponse?.total ?? taxesData.length) / taxPagination.perPage) || 1),
  }

  const unitsData = Array.isArray(unitsResponse?.data)
    ? unitsResponse.data
    : Array.isArray(unitsResponse)
    ? unitsResponse
    : []

  const unitMeta = {
    total: unitsResponse?.pagination?.total ?? unitsResponse?.total ?? unitsData.length,
    current_page: unitsResponse?.pagination?.current_page ?? unitsResponse?.current_page ?? unitPagination.page,
    last_page: unitsResponse?.pagination?.last_page ?? unitsResponse?.last_page ?? (Math.ceil((unitsResponse?.total ?? unitsData.length) / unitPagination.perPage) || 1),
  }

  const { data: countriesResponse, isLoading: countriesLoading } = useQuery({
    queryKey: ['countries', countryPagination.page, countryPagination.perPage, countryPagination.debouncedSearch],
    queryFn: () => api.get('/countries', {
      params: {
        page: countryPagination.page,
        per_page: countryPagination.perPage,
        search: countryPagination.debouncedSearch || undefined,
      }
    }).then(r => r.data),
    enabled: activeTab === 'locations' && subTabLocations === 'countries',
  })

  const { data: provincesResponse, isLoading: provincesLoading } = useQuery({
    queryKey: ['provinces', provincePagination.page, provincePagination.perPage, provincePagination.debouncedSearch],
    queryFn: () => api.get('/provinces', {
      params: {
        page: provincePagination.page,
        per_page: provincePagination.perPage,
        search: provincePagination.debouncedSearch || undefined,
      }
    }).then(r => r.data),
    enabled: activeTab === 'locations' && subTabLocations === 'provinces',
  })

  const { data: citiesResponse, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities', cityPagination.page, cityPagination.perPage, cityPagination.debouncedSearch],
    queryFn: () => api.get('/cities', {
      params: {
        page: cityPagination.page,
        per_page: cityPagination.perPage,
        search: cityPagination.debouncedSearch || undefined,
      }
    }).then(r => r.data),
    enabled: activeTab === 'locations' && subTabLocations === 'cities',
  })

  const countriesData = Array.isArray(countriesResponse?.data)
    ? countriesResponse.data
    : Array.isArray(countriesResponse)
    ? countriesResponse
    : []

  const countryMeta = {
    total: countriesResponse?.pagination?.total ?? countriesResponse?.total ?? countriesData.length,
    current_page: countriesResponse?.pagination?.current_page ?? countriesResponse?.current_page ?? countryPagination.page,
    last_page: countriesResponse?.pagination?.last_page ?? countriesResponse?.last_page ?? (Math.ceil((countriesResponse?.total ?? countriesData.length) / countryPagination.perPage) || 1),
  }

  const provincesData = Array.isArray(provincesResponse?.data)
    ? provincesResponse.data
    : Array.isArray(provincesResponse)
    ? provincesResponse
    : []

  const provinceMeta = {
    total: provincesResponse?.pagination?.total ?? provincesResponse?.total ?? provincesData.length,
    current_page: provincesResponse?.pagination?.current_page ?? provincesResponse?.current_page ?? provincePagination.page,
    last_page: provincesResponse?.pagination?.last_page ?? provincesResponse?.last_page ?? (Math.ceil((provincesResponse?.total ?? provincesData.length) / provincePagination.perPage) || 1),
  }

  const citiesData = Array.isArray(citiesResponse?.data)
    ? citiesResponse.data
    : Array.isArray(citiesResponse)
    ? citiesResponse
    : []

  const cityMeta = {
    total: citiesResponse?.pagination?.total ?? citiesResponse?.total ?? citiesData.length,
    current_page: citiesResponse?.pagination?.current_page ?? citiesResponse?.current_page ?? cityPagination.page,
    last_page: citiesResponse?.pagination?.last_page ?? citiesResponse?.last_page ?? (Math.ceil((citiesResponse?.total ?? citiesData.length) / cityPagination.perPage) || 1),
  }

  // Helper lists for selects in modal
  const { data: helperCountries } = useQuery({
    queryKey: ['helper_countries'],
    queryFn: () => api.get('/countries', { params: { per_page: 200 } }).then(r => r.data.data ?? r.data),
    enabled: modalOpen || (activeTab === 'locations' && subTabLocations === 'provinces'),
  })

  const { data: helperProvinces } = useQuery({
    queryKey: ['helper_provinces'],
    queryFn: () => api.get('/provinces', { params: { per_page: 200 } }).then(r => r.data.data ?? r.data),
    enabled: modalOpen || (activeTab === 'locations' && subTabLocations === 'cities'),
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

  // Bulk selection states
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    setSelectedRows([])
  }, [activeTab, subTabTaxesUnits, subTabLocations])

  const toggleSelectRow = (id: number) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAll = (items: any[]) => {
    const itemIds = items.map((i: any) => i.id)
    const isAllSelected = itemIds.length > 0 && itemIds.every((id: number) => selectedRows.includes(id))
    if (isAllSelected) {
      setSelectedRows(prev => prev.filter(id => !itemIds.includes(id)))
    } else {
      setSelectedRows(prev => Array.from(new Set([...prev, ...itemIds])))
    }
  }

  const bulkDeleteMutation = useMutation({
    mutationFn: ({ path, ids }: { path: string; ids: number[] }) => api.post(`${path}/bulk-delete`, { ids }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [variables.path.replace('/', '')] })
      setBulkDeleteConfirmOpen(false)
      setSelectedRows([])
      toast.success(t('toast.deleted', { defaultValue: 'Selected items deleted successfully.' }))
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? t('toast.error', { defaultValue: 'Failed to delete selected items.' }))
      setBulkDeleteConfirmOpen(false)
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
    setRate(item.rate != null ? String(parseFloat(item.rate)) : '')
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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
            <span>{t('common.systemManagement', 'System Management')}</span>
            <span>/</span>
            <span className="text-foreground font-bold">{t('common.globalSettings', 'Global Settings')}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Settings className="text-primary" size={26} />
            {t('settings.globalSettingsTitle', 'Global Settings & System Preferences')}
          </h1>
          <p className="text-xs text-muted-foreground max-w-3xl mt-1 leading-relaxed">
            {t('settings.globalSettingsSub', 'Configure system preferences, store identity, thermal POS receipt templates, tax structures, measurement units, and geographic location master records.')}
          </p>
        </div>

        {/* Top Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-2xl border border-border/80 shrink-0 overflow-x-auto max-w-full shadow-xs">
          {[
            { id: 'store', label: t('settings.tabStoreProfile', 'Store Profile'), icon: Store },
            { id: 'appearance', label: t('settings.tabAppearance', 'Appearance'), icon: Palette },
            { id: 'taxes_units', label: t('settings.tabTaxesUnits', 'Taxes & Units'), icon: Percent },
            { id: 'locations', label: t('settings.tabLocations', 'Locations'), icon: MapPin },
          ].map((tItem) => {
            const Icon = tItem.icon
            const isActiveTab = activeTab === tItem.id
            return (
              <button
                key={tItem.id}
                onClick={() => setActiveTab(tItem.id as MainTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActiveTab
                    ? 'bg-card text-primary shadow-sm border border-border/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon size={14} className={isActiveTab ? 'text-primary' : 'text-muted-foreground'} />
                <span>{tItem.label}</span>
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
                      <h3 className="text-base font-bold text-foreground">{t('settings.storeProfileTitle', 'Store Profile Settings')}</h3>
                      <p className="text-xs text-muted-foreground">{t('settings.storeProfileSub', 'General branding & corporate identity details')}</p>
                    </div>
                  </div>
                  <Sparkles className="text-primary/40" size={20} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      {t('settings.siteNameLabel', 'SITE / STORE NAME')}
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
                      {t('settings.supportEmailLabel', 'SUPPORT EMAIL ADDRESS')}
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
                        {t('settings.baseCurrencyLabel', 'BASE CURRENCY')}
                      </label>
                      <select className="form-select text-sm font-semibold">
                        <option value="USD">USD ($ - US Dollar)</option>
                        <option value="KHR">KHR (៛ - Cambodian Riel)</option>
                        <option value="EUR">EUR (€ - Euro)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {t('settings.timezoneLabel', 'TIMEZONE')}
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
                    {t('settings.storeApplyHint', 'Changes apply across all admin panels & POS terminals.')}
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
                    {t('settings.saveProfileBtn', 'Save Profile Settings')}
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
                      <h3 className="text-base font-bold text-foreground">{t('settings.posCustomizerTitle', 'POS Receipt Customizer')}</h3>
                      <p className="text-xs text-muted-foreground">{t('settings.posCustomizerSub', 'Thermal receipt header & footer text')}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {t('settings.receiptHeaderLabel', 'RECEIPT HEADER TEXT')}
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
                        {t('settings.receiptFooterLabel', 'RECEIPT FOOTER TEXT')}
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
                      <span>{t('settings.thermalPreviewTitle', 'LIVE THERMAL RECEIPT PREVIEW')}</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">{t('settings.paperWidth80mm', '80MM PAPER')}</span>
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
                      {t('settings.saveReceiptBtn', 'Save Receipt Template')}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 rounded-[24px] border border-border/80 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSubTabTaxesUnits('taxes')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  subTabTaxesUnits === 'taxes'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('settings.taxRulesTitle', 'Tax Rules & Regulations')}
              </button>
              <button
                onClick={() => setSubTabTaxesUnits('units')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  subTabTaxesUnits === 'units'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('settings.unitsTitle', 'Measurement Units')}
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-64">
                <SearchInput
                  value={subTabTaxesUnits === 'taxes' ? taxPagination.search : unitPagination.search}
                  onChange={(val) => {
                    if (subTabTaxesUnits === 'taxes') {
                      taxPagination.setSearch(val)
                    } else {
                      unitPagination.setSearch(val)
                    }
                  }}
                  placeholder={subTabTaxesUnits === 'taxes' ? t('settings.searchTaxRules', 'Search tax rules...') : t('settings.searchUnits', 'Search units...')}
                />
              </div>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus size={14} /> {subTabTaxesUnits === 'taxes' ? t('settings.addTaxRule', 'Add Tax Rule') : t('settings.addUnit', 'Add Unit')}
              </button>
            </div>
          </div>

          {/* Bulk actions banner */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-bold">
                <AlertCircle size={16} />
                <span>{selectedRows.length} {t('settings.selectedCount', 'items selected')}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRows([])}
                  className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-500 shadow-sm cursor-pointer active:scale-95 transition-all"
                >
                  <Trash2 size={14} />
                  {t('settings.deleteSelected', 'Delete Selected')}
                </button>
              </div>
            </div>
          )}

          {/* TABLE CONTAINER */}
          <div className="bg-card rounded-[24px] border border-border/80 shadow-lg overflow-hidden relative">
            {subTabTaxesUnits === 'taxes' ? (
              taxesLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-3.5 pl-6 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-border cursor-pointer"
                            checked={taxesData.length > 0 && taxesData.every((i: any) => selectedRows.includes(i.id))}
                            onChange={() => toggleSelectAll(taxesData)}
                          />
                        </th>
                        <th className="p-3.5">{t('settings.th_id', 'ID')}</th>
                        <th className="p-3.5">{t('settings.taxName', 'TAX NAME')}</th>
                        <th className="p-3.5">{t('settings.ratePercent', 'RATE (%)')}</th>
                        <th className="p-3.5">{t('settings.calculationType', 'CALCULATION TYPE')}</th>
                        <th className="p-3.5">{t('settings.th_status', 'STATUS')}</th>
                        <th className="p-3.5 pr-6 text-right">{t('settings.th_actions', 'ACTIONS')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                      {!taxesData || taxesData.length === 0 ? (
                        <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">{t('settings.noTaxRules', 'No tax rules configured yet.')}</td></tr>
                      ) : (
                        taxesData.map((tItem: any) => (
                          <tr key={tItem.id} className="hover:bg-muted/40 transition-colors">
                            <td className="p-3.5 pl-6">
                              <input
                                type="checkbox"
                                className="rounded border-border cursor-pointer"
                                checked={selectedRows.includes(tItem.id)}
                                onChange={() => toggleSelectRow(tItem.id)}
                              />
                            </td>
                            <td className="p-3.5 font-bold text-foreground">{tItem.id}</td>
                            <td className="p-3.5 font-bold text-foreground">{tItem.name}</td>
                            <td className="p-3.5 font-bold text-emerald-600">{parseFloat(tItem.rate)}%</td>
                            <td className="p-3.5 text-muted-foreground font-medium">
                              {tItem.type === 'percentage' ? t('settings.percentage', 'Percentage') : t('settings.fixedAmount', 'Fixed Amount')}
                            </td>
                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                tItem.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                              }`}>
                                {tItem.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                              </span>
                            </td>
                            <td className="p-3.5 pr-6 text-right">
                              <TableActionMenu
                                onEdit={() => handleOpenEdit(tItem)}
                                onDelete={() => triggerDelete(tItem.id)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={taxMeta.current_page}
                    lastPage={taxMeta.last_page}
                    total={taxMeta.total}
                    perPage={taxPagination.perPage}
                    onPageChange={taxPagination.setPage}
                    onPerPageChange={taxPagination.setPerPage}
                    isLoading={taxesLoading}
                  />
                </>
              )
            ) : (
              unitsLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-3.5 pl-6 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-border cursor-pointer"
                            checked={unitsData.length > 0 && unitsData.every((i: any) => selectedRows.includes(i.id))}
                            onChange={() => toggleSelectAll(unitsData)}
                          />
                        </th>
                        <th className="p-3.5">{t('settings.th_id', 'ID')}</th>
                        <th className="p-3.5">{t('settings.unitName', 'UNIT NAME')}</th>
                        <th className="p-3.5">{t('settings.symbol', 'SYMBOL')}</th>
                        <th className="p-3.5">{t('settings.description', 'DESCRIPTION')}</th>
                        <th className="p-3.5">{t('settings.th_status', 'STATUS')}</th>
                        <th className="p-3.5 pr-6 text-right">{t('settings.th_actions', 'ACTIONS')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                      {!unitsData || unitsData.length === 0 ? (
                        <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">{t('settings.noUnits', 'No measurement units configured yet.')}</td></tr>
                      ) : (
                        unitsData.map((u: any) => (
                          <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                            <td className="p-3.5 pl-6">
                              <input
                                type="checkbox"
                                className="rounded border-border cursor-pointer"
                                checked={selectedRows.includes(u.id)}
                                onChange={() => toggleSelectRow(u.id)}
                              />
                            </td>
                            <td className="p-3.5 font-bold text-foreground">{u.id}</td>
                            <td className="p-3.5 font-bold text-foreground">{u.name}</td>
                            <td className="p-3.5 font-mono font-bold text-purple-600">{u.symbol}</td>
                            <td className="p-3.5 text-muted-foreground">{u.description || '-'}</td>
                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                u.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                              }`}>
                                {u.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                              </span>
                            </td>
                            <td className="p-3.5 pr-6 text-right">
                              <TableActionMenu
                                onEdit={() => handleOpenEdit(u)}
                                onDelete={() => triggerDelete(u.id)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={unitMeta.current_page}
                    lastPage={unitMeta.last_page}
                    total={unitMeta.total}
                    perPage={unitPagination.perPage}
                    onPageChange={unitPagination.setPage}
                    onPerPageChange={unitPagination.setPerPage}
                    isLoading={unitsLoading}
                  />
                </>
              )
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LOCATIONS MASTER LIST */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 rounded-[24px] border border-border/80 shadow-sm">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {[
                { id: 'countries', label: t('settings.countriesTab', 'Countries') },
                { id: 'provinces', label: t('settings.provincesTab', 'Provinces / States') },
                { id: 'cities', label: t('settings.citiesTab', 'Cities & Districts') },
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSubTabLocations(loc.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    subTabLocations === loc.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-muted/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-64">
                <SearchInput
                  value={
                    subTabLocations === 'countries'
                      ? countryPagination.search
                      : subTabLocations === 'provinces'
                      ? provincePagination.search
                      : cityPagination.search
                  }
                  onChange={(val) => {
                    if (subTabLocations === 'countries') countryPagination.setSearch(val)
                    else if (subTabLocations === 'provinces') provincePagination.setSearch(val)
                    else cityPagination.setSearch(val)
                  }}
                  placeholder={
                    subTabLocations === 'countries'
                      ? t('settings.searchCountries', 'Search countries...')
                      : subTabLocations === 'provinces'
                      ? t('settings.searchProvinces', 'Search provinces...')
                      : t('settings.searchCities', 'Search cities...')
                  }
                />
              </div>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus size={14} /> {subTabLocations === 'countries' ? t('settings.addCountry', 'Add Country') : subTabLocations === 'provinces' ? t('settings.addProvince', 'Add Province') : t('settings.addCity', 'Add City')}
              </button>
            </div>
          </div>

          {/* Bulk actions banner for Locations */}
          {selectedRows.length > 0 && (
            <div className="flex items-center justify-between p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-bold">
                <AlertCircle size={16} />
                <span>{selectedRows.length} {t('settings.selectedCount', 'items selected')}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRows([])}
                  className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={() => setBulkDeleteConfirmOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-500 shadow-sm cursor-pointer active:scale-95 transition-all"
                >
                  <Trash2 size={14} />
                  {t('settings.deleteSelected', 'Delete Selected')}
                </button>
              </div>
            </div>
          )}

          <div className="bg-card rounded-[24px] border border-border/80 shadow-lg overflow-hidden relative">
            {subTabLocations === 'countries' && (
              countriesLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-3.5 pl-6 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-border cursor-pointer"
                            checked={countriesData.length > 0 && countriesData.every((i: any) => selectedRows.includes(i.id))}
                            onChange={() => toggleSelectAll(countriesData)}
                          />
                        </th>
                        <th className="p-3.5">{t('settings.th_id', 'ID')}</th>
                        <th className="p-3.5">{t('settings.countryName', 'COUNTRY NAME')}</th>
                        <th className="p-3.5">{t('settings.isoCode', 'ISO CODE')}</th>
                        <th className="p-3.5">{t('settings.dialCode', 'DIAL CODE')}</th>
                        <th className="p-3.5">{t('settings.th_status', 'STATUS')}</th>
                        <th className="p-3.5 pr-6 text-right">{t('settings.th_actions', 'ACTIONS')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                      {!countriesData || countriesData.length === 0 ? (
                        <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">{t('settings.noCountries', 'No countries configured yet.')}</td></tr>
                      ) : (
                        countriesData.map((c: any) => (
                          <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                            <td className="p-3.5 pl-6">
                              <input
                                type="checkbox"
                                className="rounded border-border cursor-pointer"
                                checked={selectedRows.includes(c.id)}
                                onChange={() => toggleSelectRow(c.id)}
                              />
                            </td>
                            <td className="p-3.5 font-bold text-foreground">{c.id}</td>
                            <td className="p-3.5 font-bold text-foreground">{c.name}</td>
                            <td className="p-3.5 font-mono text-muted-foreground font-semibold">{c.code}</td>
                            <td className="p-3.5 font-mono text-blue-600 font-bold">+{String(c.phone_code ?? '').replace(/^\+/, '')}</td>
                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                c.is_active ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
                              }`}>
                                {c.is_active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                              </span>
                            </td>
                            <td className="p-3.5 pr-6 text-right">
                              <TableActionMenu
                                onEdit={() => handleOpenEdit(c)}
                                onDelete={() => triggerDelete(c.id)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={countryMeta.current_page}
                    lastPage={countryMeta.last_page}
                    total={countryMeta.total}
                    perPage={countryPagination.perPage}
                    onPageChange={countryPagination.setPage}
                    onPerPageChange={countryPagination.setPerPage}
                    isLoading={countriesLoading}
                  />
                </>
              )
            )}

            {subTabLocations === 'provinces' && (
              provincesLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-3.5 pl-6 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-border cursor-pointer"
                            checked={provincesData.length > 0 && provincesData.every((i: any) => selectedRows.includes(i.id))}
                            onChange={() => toggleSelectAll(provincesData)}
                          />
                        </th>
                        <th className="p-3.5">{t('settings.th_id', 'ID')}</th>
                        <th className="p-3.5">{t('settings.provinceName', 'PROVINCE / STATE NAME')}</th>
                        <th className="p-3.5">{t('settings.provinceCode', 'PROVINCE CODE')}</th>
                        <th className="p-3.5">{t('settings.countryName', 'COUNTRY')}</th>
                        <th className="p-3.5 pr-6 text-right">{t('settings.th_actions', 'ACTIONS')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                      {!provincesData || provincesData.length === 0 ? (
                        <tr><td colSpan={6} className="text-center p-8 text-muted-foreground">{t('settings.noProvinces', 'No provinces configured yet.')}</td></tr>
                      ) : (
                        provincesData.map((p: any) => (
                          <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                            <td className="p-3.5 pl-6">
                              <input
                                type="checkbox"
                                className="rounded border-border cursor-pointer"
                                checked={selectedRows.includes(p.id)}
                                onChange={() => toggleSelectRow(p.id)}
                              />
                            </td>
                            <td className="p-3.5 font-bold text-foreground">{p.id}</td>
                            <td className="p-3.5 font-bold text-foreground">{p.name}</td>
                            <td className="p-3.5 font-mono text-muted-foreground font-semibold">{p.code}</td>
                            <td className="p-3.5 text-foreground font-semibold">{p.country?.name ?? 'Cambodia'}</td>
                            <td className="p-3.5 pr-6 text-right">
                              <TableActionMenu
                                onEdit={() => handleOpenEdit(p)}
                                onDelete={() => triggerDelete(p.id)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={provinceMeta.current_page}
                    lastPage={provinceMeta.last_page}
                    total={provinceMeta.total}
                    perPage={provincePagination.perPage}
                    onPageChange={provincePagination.setPage}
                    onPerPageChange={provincePagination.setPerPage}
                    isLoading={provincesLoading}
                  />
                </>
              )
            )}

            {subTabLocations === 'cities' && (
              citiesLoading ? (
                <div className="flex p-12 justify-center"><Loader2 className="animate-spin text-primary" size={24} /></div>
              ) : (
                <>
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-muted/40 backdrop-blur-md border-b border-border/70 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-3.5 pl-6 w-10">
                          <input
                            type="checkbox"
                            className="rounded border-border cursor-pointer"
                            checked={citiesData.length > 0 && citiesData.every((i: any) => selectedRows.includes(i.id))}
                            onChange={() => toggleSelectAll(citiesData)}
                          />
                        </th>
                        <th className="p-3.5">{t('settings.th_id', 'ID')}</th>
                        <th className="p-3.5">{t('settings.cityName', 'CITY / DISTRICT NAME')}</th>
                        <th className="p-3.5">{t('settings.locationType', 'TYPE')}</th>
                        <th className="p-3.5">{t('settings.postalCode', 'POSTAL CODE')}</th>
                        <th className="p-3.5">{t('settings.provinceName', 'PROVINCE')}</th>
                        <th className="p-3.5 pr-6 text-right">{t('settings.th_actions', 'ACTIONS')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-xs text-foreground font-medium">
                      {!citiesData || citiesData.length === 0 ? (
                        <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">{t('settings.noCities', 'No cities configured yet.')}</td></tr>
                      ) : (
                        citiesData.map((ci: any) => (
                          <tr key={ci.id} className="hover:bg-muted/40 transition-colors">
                            <td className="p-3.5 pl-6">
                              <input
                                type="checkbox"
                                className="rounded border-border cursor-pointer"
                                checked={selectedRows.includes(ci.id)}
                                onChange={() => toggleSelectRow(ci.id)}
                              />
                            </td>
                            <td className="p-3.5 font-bold text-foreground">{ci.id}</td>
                            <td className="p-3.5 font-bold text-foreground">{ci.name}</td>
                            <td className="p-3.5 capitalize font-mono text-muted-foreground">{ci.type}</td>
                            <td className="p-3.5 font-mono text-blue-600 font-bold">{ci.postal_code}</td>
                            <td className="p-3.5 text-foreground font-semibold">{ci.province?.name ?? 'Phnom Penh'}</td>
                            <td className="p-3.5 pr-6 text-right">
                              <TableActionMenu
                                onEdit={() => handleOpenEdit(ci)}
                                onDelete={() => triggerDelete(ci.id)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={cityMeta.current_page}
                    lastPage={cityMeta.last_page}
                    total={cityMeta.total}
                    perPage={cityPagination.perPage}
                    onPageChange={cityPagination.setPage}
                    onPerPageChange={cityPagination.setPerPage}
                    isLoading={citiesLoading}
                  />
                </>
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
                  {editingItem ? t('settings.editConfigTitle', 'Edit Configuration Record') : t('settings.addConfigTitle', 'Add New Configuration')}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {activeTab === 'taxes_units' && subTabTaxesUnits === 'taxes' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.taxName', 'Tax Name')}</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.ratePercent', 'Rate (%)')}</label>
                        <input type="number" required value={rate} onChange={e => setRate(e.target.value)} className="form-input text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.calculationType', 'Type')}</label>
                        <select value={taxType} onChange={e => setTaxType(e.target.value)} className="form-select text-xs w-full">
                          <option value="percentage">{t('settings.percentage', 'ភាគរយ (%)')}</option>
                          <option value="fixed">{t('settings.fixedAmount', 'ចំនួនថេរ')}</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-primary cursor-pointer" />
                      <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer">{t('settings.activeStatus', 'Active Status')}</label>
                    </div>
                  </>
                )}

                {activeTab === 'taxes_units' && subTabTaxesUnits === 'units' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.unitName', 'Unit Name')}</label>
                      <input type="text" required placeholder="e.g. Kilogram, Piece" value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.symbol', 'Symbol')}</label>
                      <input type="text" required placeholder="e.g. kg, pcs" value={symbol} onChange={e => setSymbol(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.description', 'Description')}</label>
                      <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input text-xs min-h-[60px]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-primary cursor-pointer" />
                      <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer">{t('settings.activeStatus', 'Active Status')}</label>
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'countries' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.countryName', 'Country Name')}</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.isoCode', 'ISO Code')}</label>
                        <input type="text" required placeholder="e.g. US, KH" value={code} onChange={e => setCode(e.target.value)} className="form-input text-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.dialCode', 'Phone Dial Code')}</label>
                        <input type="text" required placeholder="e.g. 1, 855" value={phoneCode} onChange={e => setPhoneCode(e.target.value)} className="form-input text-xs" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="rounded text-primary cursor-pointer" />
                      <label htmlFor="isActive" className="text-xs font-semibold text-foreground cursor-pointer">{t('settings.activeStatus', 'Active Status')}</label>
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'provinces' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.countryName', 'Country')}</label>
                      <select required value={countryId} onChange={e => setCountryId(e.target.value)} className="form-select text-xs w-full">
                        <option value="">{t('settings.selectCountry', 'Select Country')}</option>
                        {(helperCountries ?? countriesData)?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.provinceName', 'Province Name')}</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.provinceCode', 'Province Code')}</label>
                      <input type="text" required placeholder="e.g. CA-01" value={code} onChange={e => setCode(e.target.value)} className="form-input text-xs" />
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'cities' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.provinceName', 'Province')}</label>
                      <select required value={provinceId} onChange={e => setProvinceId(e.target.value)} className="form-select text-xs w-full">
                        <option value="">{t('settings.selectProvince', 'Select Province')}</option>
                        {(helperProvinces ?? provincesData)?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.cityName', 'City Name')}</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.locationType', 'Type')}</label>
                        <select value={cityType} onChange={e => setCityType(e.target.value)} className="form-select text-xs w-full">
                          <option value="city">City</option>
                          <option value="district">District</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">{t('settings.postalCode', 'Postal Code')}</label>
                        <input type="text" required value={postalCode} onChange={e => setPostalCode(e.target.value)} className="form-input text-xs" />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 border-t border-border pt-3 mt-4">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs font-semibold border border-border rounded-xl hover:bg-muted cursor-pointer transition-colors">
                    {t('common.cancel', 'Cancel')}
                  </button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow-sm transition-all">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={14} />}
                    {t('common.save', 'Save Configuration')}
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
        title={t('settings.deleteItemTitle', 'Delete Configuration Item')}
        message={t('settings.deleteItemConfirm', 'Are you sure you want to delete this configuration item?')}
      />

      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
        onConfirm={() => bulkDeleteMutation.mutate({ path: getActivePath(), ids: selectedRows })}
        title={t('settings.bulkDeleteTitle', 'Delete Selected Items')}
        message={t('settings.bulkDeleteConfirm', { count: selectedRows.length, defaultValue: `Are you sure you want to delete ${selectedRows.length} selected items?` })}
        confirmText={t('settings.confirmDelete', 'Confirm Delete')}
        cancelText={t('common.cancel', 'Cancel')}
      />
    </div>
  )
}

export default SettingsPage
