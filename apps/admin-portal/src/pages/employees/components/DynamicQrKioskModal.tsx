import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, RefreshCw, X, ShieldCheck, Clock, Building2, CheckCircle2, Download, AlertTriangle, ChevronDown, Calendar, Plus, Save } from 'lucide-react'
import api from '@/api/client'
import { useToast } from '@/hooks/useToast'

interface Shift {
  id: number
  name: string
  start_time: string
  end_time: string
  late_grace_minutes: number
  break_minutes: number
  max_overtime_minutes: number
}

interface DynamicQrKioskModalProps {
  open: boolean
  onClose: () => void
}

const DynamicQrKioskModal: React.FC<DynamicQrKioskModalProps> = ({ open, onClose }) => {
  const toast = useToast()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null)
  const [qrToken, setQrToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [intervalSecs, setIntervalSecs] = useState<number>(30)
  const [countdown, setCountdown] = useState<number>(30)

  // Quick Inline Create Shift State
  const [showConfig, setShowConfig] = useState(false)
  const [customName, setCustomName] = useState('Morning Shift (08:00)')
  const [customStartTime, setCustomStartTime] = useState('08:00')
  const [customEndTime, setCustomEndTime] = useState('17:00')
  const [customGrace, setCustomGrace] = useState(15)
  const [savingShift, setSavingShift] = useState(false)

  // Fetch available shifts
  const fetchShifts = () => {
    api.get('/shifts')
      .then(res => {
        const list = res.data?.data ?? []
        setShifts(list)
        if (list.length > 0 && !selectedShiftId) {
          setSelectedShiftId(list[0].id)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (open) {
      fetchShifts()
    }
  }, [open])

  const selectedShift = shifts.find(s => s.id === selectedShiftId) || shifts[0]

  const fetchNewQr = async (shiftId: number | null = selectedShiftId, secs: number = intervalSecs) => {
    setLoading(true)
    try {
      const res = await api.post('/attendances/generate-qr', {
        company_id: 1,
        branch_id: 1,
        shift_id: shiftId,
        interval_seconds: secs,
      })
      setQrToken(res.data?.data?.qr_token ?? null)
      setCountdown(secs)
    } catch (err: any) {
      toast.error('Failed to generate dynamic attendance QR token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchNewQr(selectedShiftId, intervalSecs)
    } else {
      setQrToken(null)
    }
  }, [open, selectedShiftId])

  useEffect(() => {
    if (!open || !qrToken) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchNewQr(selectedShiftId, intervalSecs)
          return intervalSecs
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [open, qrToken, intervalSecs, selectedShiftId])

  if (!open) return null

  // Create new shift inline
  const handleSaveCustomShift = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingShift(true)
    try {
      const payload = {
        company_id: 1,
        branch_id: 1,
        name: customName,
        start_time: customStartTime.length === 5 ? `${customStartTime}:00` : customStartTime,
        end_time: customEndTime.length === 5 ? `${customEndTime}:00` : customEndTime,
        late_grace_minutes: Number(customGrace),
        break_minutes: 60,
        max_overtime_minutes: 240,
        working_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        is_active: true,
      }
      const res = await api.post('/shifts', payload)
      const newShift = res.data?.data
      toast.success(`Shift "${customName}" created & applied!`)
      setShowConfig(false)
      fetchShifts()
      if (newShift?.id) {
        setSelectedShiftId(newShift.id)
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create custom shift')
    } finally {
      setSavingShift(false)
    }
  }

  // Preset Morning (08:00) vs Night (20:00) helpers
  const applyPresetMorning = () => {
    setCustomName('Morning Shift (08:00)')
    setCustomStartTime('08:00')
    setCustomEndTime('17:00')
    setCustomGrace(15)
  }

  const applyPresetNight = () => {
    setCustomName('Night Shift (20:00)')
    setCustomStartTime('20:00')
    setCustomEndTime('05:00')
    setCustomGrace(15)
  }

  // Generate QR Code URL using public QR API engine
  const qrImageUrl = qrToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrToken)}`
    : ''

  // Calculate Grace Deadline & Example Late Minutes for UI display
  const startTime = selectedShift ? selectedShift.start_time.substring(0, 5) : '08:00'
  const graceMinutes = selectedShift ? (selectedShift.late_grace_minutes ?? 15) : 15

  // Calculate grace end time string e.g. 08:00 + 15m = 08:15
  const [startHour, startMin] = startTime.split(':').map(Number)
  const graceDeadlineMinutes = (startMin + graceMinutes)
  const graceHour = (startHour + Math.floor(graceDeadlineMinutes / 60)) % 24
  const graceMinFormatted = String(graceDeadlineMinutes % 60).padStart(2, '0')
  const graceDeadlineStr = `${String(graceHour).padStart(2, '0')}:${graceMinFormatted}`

  // Download QR image
  const handleDownloadQr = async () => {
    if (!qrImageUrl) return
    setDownloading(true)
    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kiosk_attendance_qr_${selectedShift?.name || 'shift'}_${new Date().toISOString().split('T')[0]}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('QR Code image downloaded successfully')
    } catch (err) {
      toast.error('Failed to download QR Code image')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card w-full max-w-lg border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center p-6 space-y-4 max-h-[92vh] overflow-y-auto"
        >
          {/* Kiosk Header */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400">
                <QrCode size={22} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-foreground">Attendance Kiosk QR</h3>
                <p className="text-[11px] text-muted-foreground">Dynamic Encrypted QR Scanner & Kiosk</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
              <X size={18} />
            </button>
          </div>

          {/* Shift Selection & Quick Create Header */}
          <div className="w-full bg-muted/40 p-3.5 rounded-2xl border border-border/60 text-left space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={13} className="text-primary" /> Active Shift Schedule
              </label>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20"
              >
                <Plus size={11} /> {showConfig ? 'Close Config' : 'Configure Custom Shift'}
              </button>
            </div>

            {/* Shift Selector */}
            {shifts.length > 0 ? (
              <select
                value={selectedShiftId ?? ''}
                onChange={(e) => {
                  const id = Number(e.target.value)
                  setSelectedShiftId(id)
                }}
                className="form-select w-full text-xs font-bold rounded-xl border border-border bg-card text-foreground py-2 pl-3 pr-8 shadow-xs"
              >
                {shifts.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}) • Grace: {s.late_grace_minutes}m ({s.start_time.substring(0, 5)} - {String(Number(s.start_time.substring(0, 2)) + Math.floor((Number(s.start_time.substring(3, 5)) + s.late_grace_minutes)/60)).padStart(2, '0')}:{String((Number(s.start_time.substring(3, 5)) + s.late_grace_minutes)%60).padStart(2, '0')} Present)
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-muted-foreground italic">Morning Shift (08:00 - 17:00, Grace: 15m)</p>
            )}

            {/* Inline Custom Shift Creator */}
            <AnimatePresence>
              {showConfig && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSaveCustomShift}
                  className="pt-2 border-t border-border/50 space-y-3"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-foreground">Quick Presets:</span>
                    <div className="flex gap-1.5">
                      <button type="button" onClick={applyPresetMorning} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-500/20">
                        Morning (08:00)
                      </button>
                      <button type="button" onClick={applyPresetNight} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-500/20">
                        Night (20:00)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Shift Name</label>
                    <input
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      required
                      placeholder="e.g. Morning Shift (08:00), Night Shift (20:00)"
                      className="form-input w-full text-xs rounded-xl py-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Start Time</label>
                      <input
                        type="time"
                        value={customStartTime}
                        onChange={e => setCustomStartTime(e.target.value)}
                        required
                        className="form-input w-full text-xs rounded-xl py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">End Time</label>
                      <input
                        type="time"
                        value={customEndTime}
                        onChange={e => setCustomEndTime(e.target.value)}
                        required
                        className="form-input w-full text-xs rounded-xl py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-amber-500 uppercase mb-1">Grace (Mins)</label>
                      <input
                        type="number"
                        value={customGrace}
                        onChange={e => setCustomGrace(Number(e.target.value))}
                        required
                        className="form-input w-full text-xs rounded-xl py-1.5 border-amber-500/30"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingShift}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white bg-primary hover:opacity-90 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {savingShift ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                    <span>Save & Apply New Shift</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Shift Rules & Late Calculation Info Box */}
          <div className="w-full grid grid-cols-3 gap-2 text-left bg-primary/5 border border-primary/20 p-3 rounded-2xl">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold uppercase text-muted-foreground">Shift Start</span>
              <p className="text-sm font-extrabold text-foreground font-mono">{startTime}</p>
            </div>
            <div className="space-y-0.5 border-l border-border/40 pl-2">
              <span className="text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Present Window</span>
              <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {startTime} - {graceDeadlineStr}
              </p>
            </div>
            <div className="space-y-0.5 border-l border-border/40 pl-2">
              <span className="text-[9px] font-bold uppercase text-amber-500">Late Rule</span>
              <p className="text-[11px] font-bold text-amber-500 leading-tight">
                &gt; {graceDeadlineStr} = <span className="underline">Auto Late</span>
              </p>
            </div>
          </div>

          {/* QR Display Container */}
          <div className="relative bg-white p-4 rounded-3xl shadow-inner border border-slate-200 flex flex-col items-center justify-center min-h-[270px] w-full max-w-[290px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-2 text-slate-500 py-10">
                <RefreshCw size={36} className="animate-spin text-primary" />
                <span className="text-xs font-semibold">Generating encrypted token...</span>
              </div>
            ) : qrImageUrl ? (
              <>
                <img src={qrImageUrl} alt="Dynamic Attendance QR" className="w-60 h-60 object-contain rounded-xl" />
                <p className="text-[10px] font-mono text-slate-400 mt-1.5">Scan with Employee Mobile App</p>
              </>
            ) : (
              <div className="text-xs text-slate-400 py-10">Failed to render QR Code</div>
            )}
          </div>

          {/* Download QR Button */}
          <div className="w-full flex items-center justify-center gap-2">
            <button
              onClick={handleDownloadQr}
              disabled={!qrImageUrl || downloading}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-sm disabled:opacity-50"
            >
              {downloading ? <RefreshCw size={14} className="animate-spin" /> : <Download size={15} />}
              <span>Download QR Code Image</span>
            </button>
          </div>

          {/* Refresh Timer Progress Bar */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold px-1">
              <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                <Clock size={13} /> Auto Token Refresh
              </span>
              <span className="text-primary font-mono">{countdown}s</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '100%' }}
                animate={{ width: `${(countdown / intervalSecs) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>
          </div>

          {/* Footer Config Controls */}
          <div className="w-full flex items-center justify-between pt-2 border-t border-border/50 text-xs">
            <div className="flex items-center gap-1 font-semibold text-muted-foreground">
              <span className="text-[11px]">Refresh Interval:</span>
              <button
                onClick={() => { setIntervalSecs(30); fetchNewQr(selectedShiftId, 30); }}
                className={`px-2 py-0.5 rounded-lg font-mono text-[11px] ${intervalSecs === 30 ? 'bg-primary text-white font-bold' : 'bg-muted hover:bg-muted/80'}`}
              >
                30s
              </button>
              <button
                onClick={() => { setIntervalSecs(60); fetchNewQr(selectedShiftId, 60); }}
                className={`px-2 py-0.5 rounded-lg font-mono text-[11px] ${intervalSecs === 60 ? 'bg-primary text-white font-bold' : 'bg-muted hover:bg-muted/80'}`}
              >
                60s
              </button>
            </div>
            <button
              onClick={() => fetchNewQr(selectedShiftId, intervalSecs)}
              disabled={loading}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DynamicQrKioskModal
