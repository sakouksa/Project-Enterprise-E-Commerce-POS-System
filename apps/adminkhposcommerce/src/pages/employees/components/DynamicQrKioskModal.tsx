import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode,
  Printer,
  Download,
  ShieldCheck,
  Building2,
  MapPin,
  Wifi,
  Smartphone,
  Sparkles,
  RefreshCw,
  X,
  CheckCircle2,
  Copy,
  Clock,
  Eye,
  Sliders,
  Lock,
  Layers
} from 'lucide-react'
import { employeeService } from '@/services/employeeService'
import { useToast } from '@/hooks/useToast'
import { sound } from '@/utils/sound'

interface Shift {
  id: number
  name: string
  start_time: string
  end_time: string
  late_grace_minutes: number
}

interface DynamicQrKioskModalProps {
  open: boolean
  onClose: () => void
}

const DynamicQrKioskModal: React.FC<DynamicQrKioskModalProps> = ({ open, onClose }) => {
  const toast = useToast()
  const posterRef = useRef<HTMLDivElement>(null)

  // Configuration States
  const [branchName, setBranchName] = useState('Headquarters (Main Office)')
  const [companyName] = useState('ENTERPRISE ERP & POS')
  const [radiusMeters, setRadiusMeters] = useState(50)
  const [wifiSsid, setWifiSsid] = useState('COMPANY_STAFF_5G')
  const [standeeSize, setStandeeSize] = useState<'a4' | 'a5' | 'sticker'>('a5')
  
  // Shifts
  const [shifts, setShifts] = useState<Shift[]>([])
  const [selectedShiftId, setSelectedShiftId] = useState<number | 'all'>('all')
  
  // QR Token & Key
  const [qrToken, setQrToken] = useState<string>('ATT_HQ_ENTRANCE_STANDEE_SECURE_KEY')
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Load shifts on open
  useEffect(() => {
    if (open) {
      employeeService.shifts()
        .then((res) => {
          const list = res.data?.data ?? res.data ?? []
          setShifts(list)
        })
        .catch(() => {})
    }
  }, [open])

  if (!open) return null

  const selectedShiftObj = shifts.find(s => s.id === selectedShiftId)
  const shiftDisplayText = selectedShiftId === 'all'
    ? 'គ្រប់វេនការងារទាំងអស់ (All Shifts)'
    : `${selectedShiftObj?.name || 'Shift'} (${selectedShiftObj?.start_time.substring(0, 5)} - ${selectedShiftObj?.end_time.substring(0, 5)})`

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(
    `${qrToken}_BRANCH_${branchName.replace(/\s+/g, '_')}_SHIFT_${selectedShiftId}`
  )}`

  // Regenerate security key
  const handleRegenerateKey = () => {
    sound.playClick()
    setIsRegenerating(true)
    setTimeout(() => {
      const newKey = `ATT_${branchName.slice(0, 3).toUpperCase()}_KEY_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      setQrToken(newKey)
      setIsRegenerating(false)
      sound.playSuccess()
      toast.success('បង្កើតកូដសុវត្ថិភាព QR ថ្មីជោគជ័យ!')
    }, 400)
  }

  // Direct Print
  const handlePrint = () => {
    sound.playClick()
    window.print()
  }

  // Download High-Res PNG
  const handleDownload = async () => {
    sound.playClick()
    setDownloading(true)
    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `attendance_standee_${branchName.replace(/\s+/g, '_').toLowerCase()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      sound.playSuccess()
      toast.success('ទាញយករូបភាព QR Standee ជោគជ័យ')
    } catch {
      toast.error('ទាញយកបរាជ័យ')
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyLink = () => {
    sound.playClick()
    navigator.clipboard.writeText(qrToken)
    toast.success('ចម្លង Token ជោគជ័យ')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-card w-full max-w-5xl border border-border/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:w-full print:max-w-none"
        >
          {/* Header - Hidden on Print */}
          <div className="px-6 py-4 border-b border-border/60 bg-muted/15 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-2xs">
                <QrCode size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-bold text-base text-foreground tracking-tight">
                    បង្កើត QR កូដវត្តមានក្រុមហ៊ុន (Company Entrance QR)
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] border border-emerald-500/20">
                    <Sparkles size={11} /> $0 Extra Hardware
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  បោះពុម្ព Standee ឬ Sticker សម្រាប់ដាក់នៅមាត់ទ្វារ — បុគ្គលិកស្កេនតាម Mobile App ដោយសុវត្ថិភាព
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/80 border border-border/40 transition-colors"
              title="បិទ"
            >
              <X size={18} />
            </button>
          </div>

          {/* 2-Column Clean Workspace */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 print:p-0 print:block">
            {/* Left Column: Live Standee / Poster Preview */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/40 p-5 sm:p-6 rounded-2xl border border-border/50 print:bg-white print:border-none print:p-0">
              <div className="w-full flex items-center justify-between mb-3 text-xs font-semibold text-muted-foreground print:hidden">
                <span className="flex items-center gap-1.5 text-foreground/80">
                  <Eye size={14} className="text-primary" /> ទម្រង់បោះពុម្ព Standee (Live Preview)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-card border border-border/70 text-[11px] font-mono uppercase text-muted-foreground shadow-2xs">
                  {standeeSize.toUpperCase()} FORMAT
                </span>
              </div>

              {/* Printable Standee Card */}
              <div
                ref={posterRef}
                id="printable-company-standee"
                className={`w-full bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200/90 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 ${
                  standeeSize === 'a4'
                    ? 'max-w-[390px]'
                    : standeeSize === 'a5'
                    ? 'max-w-[340px] p-5'
                    : 'max-w-[300px] p-4'
                }`}
              >
                {/* Top Subtle Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                {/* Company Header */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    POS
                  </div>
                  <div className="text-left">
                    <h3 className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 leading-none">
                      {companyName}
                    </h3>
                    <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                      Official Checkpoint
                    </p>
                  </div>
                </div>

                {/* Branch Badge & Shift Scope */}
                <div className="mt-3 flex flex-col items-center gap-1">
                  <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs">
                    <Building2 size={12} className="text-blue-600 shrink-0" />
                    <span className="truncate max-w-[240px]">{branchName}</span>
                  </div>
                  {selectedShiftId !== 'all' && (
                    <div className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-semibold flex items-center gap-1">
                      <Clock size={10} className="text-indigo-600" />
                      <span>{shiftDisplayText}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="mt-3 space-y-0.5">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    ស្កេនវត្តមានចូលធ្វើការ
                  </h1>
                  <p className="text-[11px] font-bold text-indigo-600">
                    Scan with Employee Mobile App
                  </p>
                </div>

                {/* QR Code Container with Frame */}
                <div className="mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center shadow-inner relative group">
                  {/* Scanner Guide Corners */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-indigo-500 rounded-tl-xs" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-indigo-500 rounded-tr-xs" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-indigo-500 rounded-bl-xs" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-indigo-500 rounded-br-xs" />

                  <img
                    src={qrImageUrl}
                    alt="Company Entrance QR"
                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg bg-white p-2 shadow-xs"
                  />
                  <div className="mt-2 text-[9px] font-mono font-medium text-slate-500 flex items-center gap-1">
                    <Lock size={10} className="text-indigo-600" />
                    <span>KEY: {qrToken.slice(0, 16)}...</span>
                  </div>
                </div>

                {/* 3 Steps Instructions */}
                <div className="w-full mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-left space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span className="text-slate-700 font-medium">
                      បើក <strong>Employee App</strong> ចុច <strong>ស្កេនវត្តមាន</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span className="text-slate-700 font-medium">
                      បើក <strong>GPS</strong> ឬភ្ជាប់ <strong>Wi-Fi ({wifiSsid})</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                      3
                    </span>
                    <span className="text-slate-700 font-medium">
                      ចង្អុលកាមេរ៉ាស្កេនលើ QR នេះ ដើម្បីកត់ត្រាវត្តមាន
                    </span>
                  </div>
                </div>

                {/* Multi-Factor Badges */}
                <div className="w-full grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-center">
                  <div className="p-1.5 bg-blue-50/80 rounded-lg text-blue-700 border border-blue-100/60">
                    <MapPin size={11} className="mx-auto" />
                    <p className="text-[8px] font-bold mt-0.5">GPS Geofence</p>
                    <p className="text-[8px] text-blue-500 font-mono">&lt;{radiusMeters}m</p>
                  </div>
                  <div className="p-1.5 bg-emerald-50/80 rounded-lg text-emerald-700 border border-emerald-100/60">
                    <Wifi size={11} className="mx-auto" />
                    <p className="text-[8px] font-bold mt-0.5">Office Wi-Fi</p>
                    <p className="text-[8px] text-emerald-500 font-mono">Verified</p>
                  </div>
                  <div className="p-1.5 bg-purple-50/80 rounded-lg text-purple-700 border border-purple-100/60">
                    <Smartphone size={11} className="mx-auto" />
                    <p className="text-[8px] font-bold mt-0.5">Device ID</p>
                    <p className="text-[8px] text-purple-500 font-mono">Bound</p>
                  </div>
                </div>

                {/* Footer Security Note */}
                <div className="mt-2.5 flex items-center gap-1 text-[9px] font-semibold text-slate-400">
                  <ShieldCheck size={11} className="text-emerald-500" />
                  <span>Anti-Buddy Punching Protected</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Settings & Instant Export Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4 print:hidden">
              {/* Standee Configuration Card */}
              <div className="bg-card border border-border/70 rounded-2xl p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Sliders size={14} className="text-primary" />
                    ការកំណត់ព័ត៌មានលើ Standee (Standee Settings)
                  </h3>
                </div>

                {/* Branch Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Building2 size={13} className="text-primary" /> ឈ្មោះសាខា / ទីតាំងវត្តមាន
                  </label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="ឧ. Headquarters (Main Branch)"
                    className="w-full text-xs font-medium rounded-xl px-3 py-2 border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Shift Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Clock size={13} className="text-primary" /> ភាវាងនៃពេលវេលាការងារ (Shift Scope)
                  </label>
                  <select
                    value={selectedShiftId}
                    onChange={(e) => {
                      const val = e.target.value === 'all' ? 'all' : Number(e.target.value)
                      setSelectedShiftId(val)
                    }}
                    className="w-full text-xs font-medium rounded-xl px-3 py-2 border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="all">គ្រប់វេនទាំងអស់ (All Shifts Supported)</option>
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* GPS Radius & Wi-Fi */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                        <MapPin size={12} className="text-blue-500" /> GPS Radius
                      </label>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md font-mono">
                        {radiusMeters}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      step="5"
                      value={radiusMeters}
                      onChange={(e) => setRadiusMeters(Number(e.target.value))}
                      className="w-full accent-blue-600 h-1.5 bg-muted rounded-lg cursor-pointer mt-1"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                      <Wifi size={12} className="text-emerald-500" /> Office Wi-Fi
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="SSID Name"
                      className="w-full text-xs rounded-xl px-3 py-1.5 border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Standee Size Selector */}
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Layers size={13} className="text-primary" /> ទំហំបោះពុម្ព (Print Size Format)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setStandeeSize('a4')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                        standeeSize === 'a4'
                          ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
                      }`}
                    >
                      A4 Poster
                    </button>
                    <button
                      type="button"
                      onClick={() => setStandeeSize('a5')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                        standeeSize === 'a5'
                          ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
                      }`}
                    >
                      A5 Standee
                    </button>
                    <button
                      type="button"
                      onClick={() => setStandeeSize('sticker')}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                        standeeSize === 'sticker'
                          ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
                      }`}
                    >
                      Sticker
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Key & Action Buttons Card */}
              <div className="bg-card border border-border/70 rounded-2xl p-5 space-y-4 shadow-2xs">
                {/* Security Token Bar */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                      <Lock size={11} className="text-emerald-500" /> កូដសម្ងាត់ QR (Security Key)
                    </span>
                    <p className="font-mono text-xs font-semibold text-foreground truncate">
                      {qrToken}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={handleRegenerateKey}
                      disabled={isRegenerating}
                      title="បង្កើតកូដសម្ងាត់ថ្មី (Revoke & Regenerate)"
                      className="p-2 rounded-lg bg-card hover:bg-muted text-foreground border border-border/70 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <RefreshCw size={13} className={isRegenerating ? 'animate-spin text-primary' : ''} />
                    </button>
                    <button
                      onClick={handleCopyLink}
                      title="ចម្លង Token"
                      className="p-2 rounded-lg bg-card hover:bg-muted text-foreground border border-border/70 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handlePrint}
                    className="py-2.5 px-4 bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Printer size={16} />
                    <span>បោះពុម្ព Standee ភ្លាមៗ</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="py-2.5 px-4 bg-card hover:bg-muted active:scale-[0.98] text-foreground border border-border font-bold text-xs sm:text-sm rounded-xl shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {downloading ? (
                      <RefreshCw size={15} className="animate-spin text-primary" />
                    ) : (
                      <Download size={15} className="text-primary" />
                    )}
                    <span>ទាញយក PNG កម្រិតច្បាស់</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar - Hidden on Print */}
          <div className="px-6 py-3 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground print:hidden">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 size={13} /> $0 Extra Hardware
              </span>
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <ShieldCheck size={13} /> GPS Geofence Protected
              </span>
              <span className="hidden sm:flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium">
                <Sparkles size={13} /> Print-Ready High-DPI
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-card hover:bg-muted text-foreground border border-border/70 font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              បិទ (Close)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DynamicQrKioskModal
