import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Clock, Calendar, CheckCircle2, X, Loader2, ShieldAlert } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface Shift {
  id: number
  company_id: number
  branch_id: number
  name: string
  start_time: string
  end_time: string
  break_minutes: number
  late_grace_minutes: number
  max_check_in_time: string | null
  min_check_out_time: string | null
  max_overtime_minutes: number
  working_days: string[]
  is_active: boolean
}

const ShiftsTab: React.FC = () => {
  const toast = useToast()
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Shift | null>(null)

  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('17:00')
  const [breakMinutes, setBreakMinutes] = useState(60)
  const [lateGraceMinutes, setLateGraceMinutes] = useState(10)
  const [maxOvertimeMinutes, setMaxOvertimeMinutes] = useState(240)
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])

  const { data: shifts = [], isLoading } = useQuery<Shift[]>({
    queryKey: ['shifts'],
    queryFn: () => api.get('/shifts').then(r => r.data?.data ?? []),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/shifts', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] })
      toast.success('Shift schedule created successfully')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to create shift'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/shifts/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] })
      toast.success('Shift schedule updated successfully')
      closeModal()
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update shift'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/shifts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shifts'] })
      toast.success('Shift schedule deleted')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Failed to delete shift'),
  })

  const openCreateModal = () => {
    setEditingShift(null)
    setName('')
    setStartTime('08:00')
    setEndTime('17:00')
    setBreakMinutes(60)
    setLateGraceMinutes(10)
    setMaxOvertimeMinutes(240)
    setWorkingDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
    setModalOpen(true)
  }

  const openEditModal = (shift: Shift) => {
    setEditingShift(shift)
    setName(shift.name)
    setStartTime(shift.start_time.substring(0, 5))
    setEndTime(shift.end_time.substring(0, 5))
    setBreakMinutes(shift.break_minutes ?? 60)
    setLateGraceMinutes(shift.late_grace_minutes ?? 10)
    setMaxOvertimeMinutes(shift.max_overtime_minutes ?? 240)
    setWorkingDays(shift.working_days ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingShift(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      company_id: 1,
      branch_id: 1,
      name,
      start_time: startTime.length === 5 ? `${startTime}:00` : startTime,
      end_time: endTime.length === 5 ? `${endTime}:00` : endTime,
      break_minutes: Number(breakMinutes),
      late_grace_minutes: Number(lateGraceMinutes),
      max_overtime_minutes: Number(maxOvertimeMinutes),
      working_days: workingDays,
      is_active: true,
    }

    if (editingShift) {
      updateMutation.mutate({ id: editingShift.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const toggleDay = (day: string) => {
    setWorkingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Shift Management</h3>
          <p className="text-xs text-muted-foreground">Configure work hours, grace period, break durations, and working days.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 bg-primary text-white rounded-xl">
          <Plus size={14} /> Add Shift Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border p-4 rounded-xl h-36 animate-pulse" />
          ))
        ) : shifts.length === 0 ? (
          <div className="col-span-3 bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            <Clock size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-semibold">No work shifts defined</p>
            <p className="text-xs">Create a shift schedule like Morning (08:00 - 17:00) to get started.</p>
          </div>
        ) : (
          shifts.map(shift => (
            <div key={shift.id} className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Clock size={15} className="text-primary" />
                  {shift.name}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditModal(shift)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setDeleteTarget(shift)} className="p-1 hover:bg-rose-500/10 rounded text-rose-500 hover:text-rose-600">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="bg-muted/40 p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span>{shift.start_time?.substring(0, 5)} - {shift.end_time?.substring(0, 5)}</span>
                <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono text-[10px]">
                  Grace: {shift.late_grace_minutes}m
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground font-medium">
                <div>Break: <span className="font-bold text-foreground">{shift.break_minutes}m</span></div>
                <div>Max OT: <span className="font-bold text-foreground">{shift.max_overtime_minutes}m</span></div>
              </div>

              <div className="flex items-center gap-1 pt-1 border-t border-border/40">
                {allDays.map(day => (
                  <span
                    key={day}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      (shift.working_days ?? []).includes(day)
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground/40'
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card w-full max-w-md border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-bold text-base text-foreground">{editingShift ? 'Edit Shift Schedule' : 'Create New Shift Schedule'}</h3>
                <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Shift Name *</label>
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Morning Shift, Night Shift" className="form-input w-full text-xs rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Start Time *</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required className="form-input w-full text-xs rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">End Time *</label>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required className="form-input w-full text-xs rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Grace (Mins)</label>
                    <input type="number" value={lateGraceMinutes} onChange={e => setLateGraceMinutes(Number(e.target.value))} className="form-input w-full text-xs rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Break (Mins)</label>
                    <input type="number" value={breakMinutes} onChange={e => setBreakMinutes(Number(e.target.value))} className="form-input w-full text-xs rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Max OT (Mins)</label>
                    <input type="number" value={maxOvertimeMinutes} onChange={e => setMaxOvertimeMinutes(Number(e.target.value))} className="form-input w-full text-xs rounded-xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Working Days</label>
                  <div className="flex items-center gap-1.5">
                    {allDays.map(day => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all ${
                          workingDays.includes(day)
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-medium border border-border rounded-xl hover:bg-muted">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-xl flex items-center gap-1.5">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 size={13} className="animate-spin" />}
                    Save Shift
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteTarget} title="Delete Shift Schedule" message={`Are you sure you want to delete shift schedule ${deleteTarget?.name}?`} confirmText="Delete Shift" loading={deleteMutation.isPending} onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

export default ShiftsTab
