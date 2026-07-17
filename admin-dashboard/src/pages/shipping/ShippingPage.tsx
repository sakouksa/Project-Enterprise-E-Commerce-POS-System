import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, X, Loader2, 
  Truck, Globe, DollarSign, Package
} from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'
import { useServerPagination } from '@/hooks/useServerPagination'
import TableWrapper from '@/components/shared/TableWrapper'
import SearchInput from '@/components/shared/SearchInput'
import ResetButton from '@/components/shared/ResetButton'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'

type Tab = 'shipping-methods' | 'shipping-zones' | 'shipping-rates' | 'shipments'

const ShippingPage: React.FC = () => {
  const qc = useQueryClient()
  const toast = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'shipping-methods'
  const setActiveTab = (tab: Tab) => setSearchParams({ tab })
    const {
    page,
    setPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    debouncedSearch,
    reset,
    adjustAfterDelete,
  } = useServerPagination({ storageKey: 'shipping' })
    const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  
  // Entity states
  const [editingItem, setEditingItem] = useState<any>(null)

  // Shipping Method fields
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [provider, setProvider] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [isActive, setIsActive] = useState(true)

  // Shipping Zone fields
  const [countries, setCountries] = useState('["US", "CA"]')
  const [provinces, setProvinces] = useState('[]')
  const [cities, setCities] = useState('[]')

  // Shipping Rate fields
  const [shippingMethodId, setShippingMethodId] = useState('')
  const [shippingZoneId, setShippingZoneId] = useState('')
  const [minWeight, setMinWeight] = useState('0')
  const [maxWeight, setMaxWeight] = useState('10')
  const [price, setPrice] = useState('')
  const [estimatedDaysMin, setEstimatedDaysMin] = useState('1')
  const [estimatedDaysMax, setEstimatedDaysMax] = useState('5')

  // Shipment fields (mostly read-only log updates)
  const [orderId, setOrderId] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('')
  const [shipmentStatus, setShipmentStatus] = useState('pending')

  // API List
  const { data: listData, isLoading, isFetching } = useQuery({
    queryKey: [activeTab, page, search],
    queryFn: () => api.get(`/${activeTab}`, { params: { page, search: debouncedSearch, per_page: perPage } }).then(r => r.data),
    placeholderData: (prev) => prev,
  })

  // Dropdown helper data
  const { data: methodsList } = useQuery({
    queryKey: ['shipping-methods-list'],
    queryFn: () => api.get('/shipping-methods', { params: { per_page: 100 } }).then(r => r.data.data),
    enabled: activeTab === 'shipping-rates' || activeTab === 'shipments',
  })

  const { data: zonesList } = useQuery({
    queryKey: ['shipping-zones-list'],
    queryFn: () => api.get('/shipping-zones', { params: { per_page: 100 } }).then(r => r.data.data),
    enabled: activeTab === 'shipping-rates',
  })

  const records = listData?.data ?? []
  const pagination = listData?.pagination ?? { total: 0, current_page: 1, last_page: 1 }

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: any) => api.post(`/${activeTab}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      closeModal()
      toast.success('Created successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create shipping config.')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/${activeTab}/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      closeModal()
      toast.success('Updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update shipping config.')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/${activeTab}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [activeTab] })
      setConfirmOpen(false)
      toast.success('Deleted successfully.')
      adjustAfterDelete(records.length)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete shipping config.')
      setConfirmOpen(false)
    }
  })

  const openCreateModal = () => {
    setEditingItem(null)
    setName('')
    setCode('')
    setProvider('')
    setBasePrice('')
    setIsActive(true)
    setCountries('["US", "CA"]')
    setProvinces('[]')
    setCities('[]')
    setShippingMethodId('')
    setShippingZoneId('')
    setMinWeight('0')
    setMaxWeight('10')
    setPrice('')
    setEstimatedDaysMin('1')
    setEstimatedDaysMax('5')
    setOrderId('')
    setTrackingNumber('')
    setCarrier('')
    setShipmentStatus('pending')
    setModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingItem(item)
    setName(item.name ?? '')
    setCode(item.code ?? '')
    setProvider(item.provider ?? '')
    setBasePrice(item.base_price ?? '')
    setIsActive(item.is_active ?? true)
    setCountries(item.countries ?? '[]')
    setProvinces(item.provinces ?? '[]')
    setCities(item.cities ?? '[]')
    setShippingMethodId(item.shipping_method_id ?? '')
    setShippingZoneId(item.shipping_zone_id ?? '')
    setMinWeight(item.min_weight?.toString() ?? '0')
    setMaxWeight(item.max_weight?.toString() ?? '10')
    setPrice(item.price ?? '')
    setEstimatedDaysMin(item.estimated_days_min?.toString() ?? '1')
    setEstimatedDaysMax(item.estimated_days_max?.toString() ?? '5')
    setOrderId(item.order_id ?? '')
    setTrackingNumber(item.tracking_number ?? '')
    setCarrier(item.carrier ?? '')
    setShipmentStatus(item.status ?? 'pending')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let payload: any = {}
    if (activeTab === 'shipping-methods') {
      payload = { company_id: 1, name, code, provider, base_price: Number(basePrice), is_active: isActive ? 1 : 0 }
    } else if (activeTab === 'shipping-zones') {
      payload = { company_id: 1, name, countries, provinces, cities }
    } else if (activeTab === 'shipping-rates') {
      payload = {
        shipping_method_id: Number(shippingMethodId), shipping_zone_id: Number(shippingZoneId),
        min_weight: Number(minWeight), max_weight: Number(maxWeight), price: Number(price),
        estimated_days_min: Number(estimatedDaysMin), estimated_days_max: Number(estimatedDaysMax), is_active: isActive ? 1 : 0
      }
    } else if (activeTab === 'shipments') {
      payload = {
        order_id: Number(orderId), shipping_method_id: Number(shippingMethodId),
        tracking_number: trackingNumber, carrier, status: shipmentStatus
      }
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  const tabsList: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'shipping-methods', label: 'Methods', icon: <Truck size={16} /> },
    { id: 'shipping-zones', label: 'Zones', icon: <Globe size={16} /> },
    { id: 'shipping-rates', label: 'Rates', icon: <DollarSign size={16} /> },
    { id: 'shipments', label: 'Shipments log', icon: <Package size={16} /> },
  ]

  return (
    <div className="space-y-4">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'Shipping' }]} />
      
      <PageHeader 
        title="Shipping & Fulfillment" 
        subtitle="Configure shipping methods, geozones, custom rates, and trace active shipments"
        action={
          <button onClick={openCreateModal} className="btn btn-primary flex items-center gap-2">
            <Plus size={16} /> Add New
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-border gap-2">
        {tabsList.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTab(t.id); setPage(1); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-lg border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input w-full pl-10"
          />
        </div>
        <button onClick={() => qc.invalidateQueries({ queryKey: [activeTab] })} className="btn btn-secondary flex items-center gap-2 w-full sm:w-auto">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                {activeTab === 'shipping-methods' && (
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Provider</th>
                    <th>Base Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'shipping-zones' && (
                  <tr>
                    <th>ID</th>
                    <th>Zone Name</th>
                    <th>Countries Included</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'shipping-rates' && (
                  <tr>
                    <th>ID</th>
                    <th>Method</th>
                    <th>Zone</th>
                    <th>Min Wt</th>
                    <th>Max Wt</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                )}
                {activeTab === 'shipments' && (
                  <tr>
                    <th>ID</th>
                    <th>Order ID</th>
                    <th>Carrier</th>
                    <th>Tracking #</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted-foreground p-8">No records found.</td>
                  </tr>
                ) : (
                  records.map((r: any) => (
                    <tr key={r.id}>
                      {activeTab === 'shipping-methods' && (
                        <>
                          <td>{r.id}</td>
                          <td className="font-semibold text-foreground">{r.name}</td>
                          <td>{r.code}</td>
                          <td>{r.provider}</td>
                          <td>${Number(r.base_price).toLocaleString()}</td>
                          <td>
                            <span className={`badge ${r.is_active ? 'badge-success' : 'badge-muted'}`}>
                              {r.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </>
                      )}
                      {activeTab === 'shipping-zones' && (
                        <>
                          <td>{r.id}</td>
                          <td className="font-semibold text-foreground">{r.name}</td>
                          <td>{r.countries}</td>
                        </>
                      )}
                      {activeTab === 'shipping-rates' && (
                        <>
                          <td>{r.id}</td>
                          <td>{r.shipping_method?.name ?? 'N/A'}</td>
                          <td>{r.shipping_zone?.name ?? 'N/A'}</td>
                          <td>{r.min_weight} kg</td>
                          <td>{r.max_weight} kg</td>
                          <td className="font-semibold">${Number(r.price).toLocaleString()}</td>
                        </>
                      )}
                      {activeTab === 'shipments' && (
                        <>
                          <td>{r.id}</td>
                          <td>#{r.order_id}</td>
                          <td>{r.carrier}</td>
                          <td>{r.tracking_number}</td>
                          <td>
                            <span className={`badge ${
                              r.status === 'delivered' ? 'badge-success' : r.status === 'shipped' ? 'badge-warning' : 'badge-muted'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                        </>
                      )}
                      <td>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(r)} className="btn btn-icon btn-secondary" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => confirmDelete(r.id)} className="btn btn-icon btn-danger" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} total={pagination.total} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>

      {/* CRUD Modal Form */}
      <AnimatePresence>
        {modalOpen && (
          <div className="modal-backdrop">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="modal-content max-w-md w-full">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <h3 className="text-lg font-bold text-foreground">
                  {editingItem ? 'Edit Shipping Item' : 'Add Shipping Item'}
                </h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'shipping-methods' && (
                  <>
                    <div>
                      <label className="label">Method Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Method Code</label>
                      <input type="text" required value={code} onChange={e => setCode(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Carrier Provider</label>
                      <input type="text" required placeholder="e.g. FedEx, DHL, Local" value={provider} onChange={e => setProvider(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Base Flat Price ($)</label>
                      <input type="number" required value={basePrice} onChange={e => setBasePrice(e.target.value)} className="input w-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="checkbox" />
                      <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">Active</label>
                    </div>
                  </>
                )}

                {activeTab === 'shipping-zones' && (
                  <>
                    <div>
                      <label className="label">Zone Name</label>
                      <input type="text" required placeholder="e.g. North America, Southeast Asia" value={name} onChange={e => setName(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Countries (JSON String Array)</label>
                      <textarea required value={countries} onChange={e => setCountries(e.target.value)} className="input w-full min-h-[60px]" />
                    </div>
                    <div>
                      <label className="label">Provinces (JSON String Array)</label>
                      <textarea required value={provinces} onChange={e => setProvinces(e.target.value)} className="input w-full min-h-[60px]" />
                    </div>
                    <div>
                      <label className="label">Cities (JSON String Array)</label>
                      <textarea required value={cities} onChange={e => setCities(e.target.value)} className="input w-full min-h-[60px]" />
                    </div>
                  </>
                )}

                {activeTab === 'shipping-rates' && (
                  <>
                    <div>
                      <label className="label">Shipping Method</label>
                      <select required value={shippingMethodId} onChange={e => setShippingMethodId(e.target.value)} className="input w-full">
                        <option value="">Select Method</option>
                        {methodsList?.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Shipping Zone</label>
                      <select required value={shippingZoneId} onChange={e => setShippingZoneId(e.target.value)} className="input w-full">
                        <option value="">Select Zone</option>
                        {zonesList?.map((z: any) => <option key={z.id} value={z.id}>{z.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Min Weight (kg)</label>
                        <input type="number" required value={minWeight} onChange={e => setMinWeight(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Max Weight (kg)</label>
                        <input type="number" required value={maxWeight} onChange={e => setMaxWeight(e.target.value)} className="input w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Rate Price ($)</label>
                      <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="input w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Min Est Days</label>
                        <input type="number" required value={estimatedDaysMin} onChange={e => setEstimatedDaysMin(e.target.value)} className="input w-full" />
                      </div>
                      <div>
                        <label className="label">Max Est Days</label>
                        <input type="number" required value={estimatedDaysMax} onChange={e => setEstimatedDaysMax(e.target.value)} className="input w-full" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'shipments' && (
                  <>
                    <div>
                      <label className="label">Order ID</label>
                      <input type="number" required value={orderId} onChange={e => setOrderId(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Shipping Method</label>
                      <select required value={shippingMethodId} onChange={e => setShippingMethodId(e.target.value)} className="input w-full">
                        <option value="">Select Method</option>
                        {methodsList?.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Carrier</label>
                      <input type="text" required value={carrier} onChange={e => setCarrier(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Tracking Number</label>
                      <input type="text" required value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} className="input w-full" />
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <select value={shipmentStatus} onChange={e => setShipmentStatus(e.target.value)} className="input w-full">
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 border-t border-border pt-3 mt-4">
                  <button type="button" onClick={closeModal} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn btn-primary flex items-center gap-2">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin" size={16} />}
                    Save Changes
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
        onConfirm={handleDelete} 
        title="Are you sure you want to delete this item?"
      />
    </div>
  )
}

export default ShippingPage
