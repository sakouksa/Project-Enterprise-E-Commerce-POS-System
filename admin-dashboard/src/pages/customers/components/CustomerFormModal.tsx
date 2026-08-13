import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image, Loader2 } from 'lucide-react'
import type { Customer, CustomerFormData } from '../types'

interface CustomerFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingCustomer: Customer | null
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  register: any
  errors: any
  companies: any[]
  groups: any[]
  users: any[]
  photoPreview: string | null
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removePhoto: () => void
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  editingCustomer,
  onSubmit,
  isSubmitting,
  register,
  errors,
  companies = [],
  groups = [],
  users = [],
  photoPreview,
  onPhotoChange,
  removePhoto,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="modal-content max-w-xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-foreground">
                {editingCustomer ? 'Edit Customer Profile' : 'Register New Customer'}
              </h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="label">Customer Full Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Customer name is required' })}
                  placeholder="e.g. John Doe"
                  className="input w-full"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="text"
                    {...register('phone')}
                    placeholder="+855 12 345 678"
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Customer Group</label>
                  <select {...register('customer_group_id')} className="input w-full">
                    <option value="">Standard Group</option>
                    {groups.map((g: any) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Gender</label>
                  <select {...register('gender')} className="input w-full">
                    <option value="">Unspecified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Credit Limit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('credit_limit')}
                    placeholder="1000.00"
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="label">Tax Number</label>
                  <input
                    type="text"
                    {...register('tax_number')}
                    placeholder="TAX-90124"
                    className="input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="label">Profile Photo</label>
                {photoPreview ? (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border group">
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-muted/20 transition-colors">
                    <Image size={24} className="text-muted-foreground mb-1" />
                    <span className="text-xs font-semibold text-foreground">Click to upload photo</span>
                    <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <label className="label">Internal Notes</label>
                <textarea
                  {...register('notes')}
                  placeholder="Special client preferences or notes..."
                  className="input w-full min-h-[60px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="custActive"
                  {...register('is_active')}
                  className="checkbox h-4 w-4"
                />
                <label htmlFor="custActive" className="text-sm font-medium text-foreground cursor-pointer">
                  Active customer account
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3 mt-4">
                <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary text-xs flex items-center gap-1.5">
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Customer</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CustomerFormModal
