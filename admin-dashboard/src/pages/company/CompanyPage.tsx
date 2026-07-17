import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Building2, Store, Warehouse, User, Loader2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import PageHeader from '@/components/common/PageHeader'
import Breadcrumb from '@/components/common/Breadcrumb'
import BranchesPage from './BranchesPage'
import StoresPage from './StoresPage'
import WarehousesPage from './WarehousesPage'

type TabType = 'profile' | 'branches' | 'stores' | 'warehouses'

const CompanyPage: React.FC<{ activeTab?: TabType }> = ({ activeTab: initialTab }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const toast = useToast()

  // Determine active tab from URL query param or initialTab prop
  const currentTab = (searchParams.get('tab') as TabType) || initialTab || 'profile'

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab })
  }

  // Company Profile state
  const { data: company, isLoading: loadingCompany, refetch } = useQuery({
    queryKey: ['company-profile'],
    queryFn: () => api.get('/companies/1').then(r => r.data.data ?? r.data), // Defaulting to company 1
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (company) {
      setName(company.name ?? '')
      setEmail(company.email ?? '')
      setPhone(company.phone ?? '')
      setAddress(company.address ?? '')
    }
  }, [company])

  const updateProfileMutation = useMutation({
    mutationFn: (payload: any) => api.put('/companies/1', payload),
    onSuccess: () => {
      refetch()
      toast.success('Company profile updated successfully.')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update company profile.')
    }
  })

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate({ name, email, phone, address })
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Company' }, { label: currentTab.charAt(0).toUpperCase() + currentTab.slice(1) }]} />

      <PageHeader
        title="Company Workspace"
        subtitle="Manage company profile metadata, branches, stores, and warehouses in one consolidated view"
      />

      {/* Tabs list */}
      <div className="flex border-b border-border overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            currentTab === 'profile'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <User size={16} />
          Company Profile
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            currentTab === 'branches'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 size={16} />
          Branches
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            currentTab === 'stores'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Store size={16} />
          Stores
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
            currentTab === 'warehouses'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Warehouse size={16} />
          Warehouses
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {currentTab === 'profile' && (
          <div className="bg-card rounded-xl border border-border p-6 max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Edit Profile Details</h3>
            {loadingCompany ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : (
              <form onSubmit={handleSubmitProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">HQ Address</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="company-profile-save px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {currentTab === 'branches' && <BranchesPage isTab />}
        {currentTab === 'stores' && <StoresPage isTab />}
        {currentTab === 'warehouses' && <WarehousesPage isTab />}
      </div>
    </div>
  )
}

export default CompanyPage
