import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Save, CheckCircle, HelpCircle, Plus, Edit2, Trash2, Globe, FileText, Loader2, X } from 'lucide-react'
import api from '@/api/client'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/useToast'
import AppearanceSettings from './AppearanceSettings'
import Pagination from '@/components/shared/Pagination'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

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
      setSiteName(getVal('site_name'))
      setSiteEmail(getVal('site_email'))
      setReceiptHeader(getVal('pos_receipt_header'))
      setReceiptFooter(getVal('pos_receipt_footer'))
    }
  }, [settingsData])

  // Mutations
  const updateSettingsMutation = useMutation({
    mutationFn: (payload: any) => api.post('/settings', payload),
    onSuccess: () => {
      setSuccess(true)
      toast.success('Global settings updated successfully!')
      setTimeout(() => setSuccess(false), 3000)
    },
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
      toast.success('Item created successfully.')
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
      toast.success('Item updated successfully.')
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
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Global Settings</h1>
          <p className="text-muted-foreground text-sm">Configure system preferences, locales, taxes, units and geographic lists</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-muted/40 p-1 rounded-lg border border-border shrink-0">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'store' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Store Profile
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'appearance' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('taxes_units')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'taxes_units' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Taxes & Units
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'locations' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Locations
          </button>
        </div>
      </div>

      {activeTab === 'appearance' && <AppearanceSettings />}

      {activeTab === 'store' && (
        <>
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              Settings updated successfully!
            </motion.div>
          )}

          {settingsLoading ? (
            <div className="space-y-4">
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-48 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="bg-card rounded-xl border border-border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
                    <Settings size={16} className="text-muted-foreground" />
                    Store Profile Settings
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Site / Store Name</label>
                    <input
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      required
                      placeholder="Enterprise E-Commerce"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Support Email</label>
                    <input
                      type="email"
                      value={siteEmail}
                      onChange={(e) => setSiteEmail(e.target.value)}
                      required
                      placeholder="info@store.com"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* POS Receipt Builder */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
                    <HelpCircle size={16} className="text-muted-foreground" />
                    POS Receipt Customizer
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Receipt Header Text</label>
                    <input
                      value={receiptHeader}
                      onChange={(e) => setReceiptHeader(e.target.value)}
                      placeholder="Thank you for shopping with us!"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Receipt Footer Text</label>
                    <input
                      value={receiptFooter}
                      onChange={(e) => setReceiptFooter(e.target.value)}
                      placeholder="Please visit again."
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-border">
                <button type="submit" disabled={updateSettingsMutation.isPending} className="btn btn-primary flex items-center gap-2">
                  <Save size={16} />
                  Save Settings
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {activeTab === 'taxes_units' && (
        <div className="space-y-4">
          <div className="flex border-b border-border gap-2">
            <button
              onClick={() => setSubTabTaxesUnits('taxes')}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                subTabTaxesUnits === 'taxes' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              Tax Settings
            </button>
            <button
              onClick={() => setSubTabTaxesUnits('units')}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                subTabTaxesUnits === 'units' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              Measurement Units
            </button>
          </div>

          <div className="flex justify-between items-center bg-card p-3 rounded-lg border border-border">
            <h3 className="text-sm font-bold text-foreground capitalize">{subTabTaxesUnits} List</h3>
            <button onClick={handleOpenCreate} className="btn btn-primary flex items-center gap-2">
              <Plus size={14} /> Add {subTabTaxesUnits === 'taxes' ? 'Tax' : 'Unit'}
            </button>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {subTabTaxesUnits === 'taxes' ? (
              taxesLoading ? (
                <div className="flex p-8 justify-center"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <table className="w-full data-table">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Rate</th><th>Type</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {taxesData?.length === 0 ? (
                      <tr><td colSpan={6} className="text-center p-4">No taxes found.</td></tr>
                    ) : (
                      taxesData?.map((t: any) => (
                        <tr key={t.id}>
                          <td>{t.id}</td>
                          <td className="font-semibold">{t.name}</td>
                          <td>{t.rate}%</td>
                          <td>{t.type}</td>
                          <td><span className={`badge ${t.is_active ? 'badge-success' : 'badge-muted'}`}>{t.is_active ? 'Active' : 'Inactive'}</span></td>
                          <td>
                            <div className="flex gap-2">
                              <button onClick={() => handleOpenEdit(t)} className="btn btn-icon btn-secondary"><Edit2 size={12} /></button>
                              <button onClick={() => triggerDelete(t.id)} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
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
                <div className="flex p-8 justify-center"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <table className="w-full data-table">
                  <thead>
                    <tr><th>ID</th><th>Unit Name</th><th>Symbol</th><th>Description</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {unitsData?.length === 0 ? (
                      <tr><td colSpan={6} className="text-center p-4">No units found.</td></tr>
                    ) : (
                      unitsData?.map((u: any) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td className="font-semibold">{u.name}</td>
                          <td>{u.symbol}</td>
                          <td>{u.description || '-'}</td>
                          <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-muted'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                          <td>
                            <div className="flex gap-2">
                              <button onClick={() => handleOpenEdit(u)} className="btn btn-icon btn-secondary"><Edit2 size={12} /></button>
                              <button onClick={() => triggerDelete(u.id)} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
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

      {activeTab === 'locations' && (
        <div className="space-y-4">
          <div className="flex border-b border-border gap-2">
            <button
              onClick={() => setSubTabLocations('countries')}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                subTabLocations === 'countries' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              Countries
            </button>
            <button
              onClick={() => setSubTabLocations('provinces')}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                subTabLocations === 'provinces' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              Provinces
            </button>
            <button
              onClick={() => setSubTabLocations('cities')}
              className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                subTabLocations === 'cities' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              }`}
            >
              Cities
            </button>
          </div>

          <div className="flex justify-between items-center bg-card p-3 rounded-lg border border-border">
            <h3 className="text-sm font-bold text-foreground capitalize">{subTabLocations} List</h3>
            <button onClick={handleOpenCreate} className="btn btn-primary flex items-center gap-2">
              <Plus size={14} /> Add New Location
            </button>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {subTabLocations === 'countries' && (
              countriesLoading ? (
                <div className="flex p-8 justify-center"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <table className="w-full data-table">
                  <thead>
                    <tr><th>ID</th><th>Country Name</th><th>Code</th><th>Phone Code</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {countriesData?.map((c: any) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td className="font-semibold">{c.name}</td>
                        <td>{c.code}</td>
                        <td>+{c.phone_code}</td>
                        <td><span className={`badge ${c.is_active ? 'badge-success' : 'badge-muted'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={() => handleOpenEdit(c)} className="btn btn-icon btn-secondary"><Edit2 size={12} /></button>
                            <button onClick={() => triggerDelete(c.id)} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
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
                <div className="flex p-8 justify-center"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <table className="w-full data-table">
                  <thead>
                    <tr><th>ID</th><th>Province Name</th><th>Code</th><th>Country</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {provincesData?.map((p: any) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td className="font-semibold">{p.name}</td>
                        <td>{p.code}</td>
                        <td>{p.country?.name ?? 'N/A'}</td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={() => handleOpenEdit(p)} className="btn btn-icon btn-secondary"><Edit2 size={12} /></button>
                            <button onClick={() => triggerDelete(p.id)} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
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
                <div className="flex p-8 justify-center"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <table className="w-full data-table">
                  <thead>
                    <tr><th>ID</th><th>City Name</th><th>Type</th><th>Postal Code</th><th>Province</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {citiesData?.map((ci: any) => (
                      <tr key={ci.id}>
                        <td>{ci.id}</td>
                        <td className="font-semibold">{ci.name}</td>
                        <td>{ci.type}</td>
                        <td>{ci.postal_code}</td>
                        <td>{ci.province?.name ?? 'N/A'}</td>
                        <td>
                          <div className="flex gap-2">
                            <button onClick={() => handleOpenEdit(ci)} className="btn btn-icon btn-secondary"><Edit2 size={12} /></button>
                            <button onClick={() => triggerDelete(ci.id)} className="btn btn-icon btn-danger"><Trash2 size={12} /></button>
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
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-md w-full">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="text-lg font-bold text-foreground">
                  {editingItem ? 'Edit Configuration' : 'Add Configuration'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {activeTab === 'taxes_units' && subTabTaxesUnits === 'taxes' && (
                  <>
                    <div>
                      <label className="label">Tax Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Rate (%)</label>
                        <input type="number" required value={rate} onChange={e => setRate(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Type</label>
                        <select value={taxType} onChange={e => setTaxType(e.target.value)} className="input w-full">
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                      <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active</label>
                    </div>
                  </>
                )}

                {activeTab === 'taxes_units' && subTabTaxesUnits === 'units' && (
                  <>
                    <div>
                      <label className="label">Unit Name</label>
                      <input type="text" required placeholder="e.g. Kilogram, Piece" value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Symbol</label>
                      <input type="text" required placeholder="e.g. kg, pcs" value={symbol} onChange={e => setSymbol(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Description</label>
                      <textarea value={description} onChange={e => setDescription(e.target.value)} className="input w-full min-h-[60px]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                      <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active</label>
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'countries' && (
                  <>
                    <div>
                      <label className="label">Country Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">ISO Code</label>
                        <input type="text" required placeholder="e.g. US, KH" value={code} onChange={e => setCode(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Phone Dial Code</label>
                        <input type="text" required placeholder="e.g. 1, 855" value={phoneCode} onChange={e => setPhoneCode(e.target.value)} className="input w-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                      <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active</label>
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'provinces' && (
                  <>
                    <div>
                      <label className="label">Country</label>
                      <select required value={countryId} onChange={e => setCountryId(e.target.value)} className="input w-full">
                        <option value="">Select Country</option>
                        {countriesData?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Province Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Province Code</label>
                      <input type="text" required placeholder="e.g. CA-01" value={code} onChange={e => setCode(e.target.value)} className="input w-full" />
                    </div>
                  </>
                )}

                {activeTab === 'locations' && subTabLocations === 'cities' && (
                  <>
                    <div>
                      <label className="label">Province</label>
                      <select required value={provinceId} onChange={e => setProvinceId(e.target.value)} className="input w-full">
                        <option value="">Select Province</option>
                        {provincesData?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">City Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Type</label>
                        <select value={cityType} onChange={e => setCityType(e.target.value)} className="input w-full">
                          <option value="city">City</option>
                          <option value="district">District</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Postal Code</label>
                        <input type="text" required value={postalCode} onChange={e => setPostalCode(e.target.value)} className="input w-full" />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 border-t border-border pt-3 mt-4">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn btn-primary flex items-center gap-2">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={16} />}
                    Save Config
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
        title="Are you sure you want to delete this configuration item?"
      />
    </div>
  )
}

export default SettingsPage
