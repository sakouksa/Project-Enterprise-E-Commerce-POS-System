import React from 'react'
import { MapPin, Plus } from 'lucide-react'
import { useAuthStore } from '@/stores'

const AddressesPage: React.FC = () => {
  const customer = useAuthStore((s) => s.customer)

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
          Saved Delivery Addresses
        </h2>
        <button className="btn-primary btn-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-600 space-y-2 relative">
          <span className="badge-primary text-[10px]">Default Address</span>
          <div className="font-bold text-sm text-gray-900 dark:text-white">{customer?.name}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Phnom Penh, Kingdom of Cambodia<br />
            Phone: {customer?.phone || 'Not provided'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressesPage
