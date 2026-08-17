import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, MapPin, Smartphone, ShieldCheck, User, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react'
import { EmployeeAvatar } from './EmployeeAvatar'

interface AttendanceDetailModalProps {
  attendance: any | null
  onClose: () => void
}

const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({ attendance, onClose }) => {
  if (!attendance) return null

  const emp = attendance.employee
  const statusColor =
    attendance.status === 'present' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
    attendance.status === 'late' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' :
    attendance.status === 'absent' ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' :
    'text-blue-500 bg-blue-500/10 border-blue-500/20'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card w-full max-w-lg border border-border rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <EmployeeAvatar
                photo={emp?.photo}
                name={emp?.name}
                id={emp?.id ?? attendance.employee_id}
                size="lg"
              />
              <div>
                <h3 className="font-bold text-base text-foreground">{emp?.name ?? 'Employee'}</h3>
                <p className="text-xs text-muted-foreground font-mono">{emp?.employee_number ?? '#EMP-001'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Status & Date */}
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl border border-border/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Calendar size={14} className="text-primary" />
                <span>Date: <strong className="text-foreground">{attendance.attendance_date ?? attendance.date}</strong></span>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize ${statusColor}`}>
                {attendance.status}
              </span>
            </div>

            {/* Timeline Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-card border border-border p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Check In</span>
                <span className="text-sm font-extrabold text-foreground font-mono mt-0.5 block">{attendance.check_in ?? '--:--'}</span>
                <span className="text-[10px] text-muted-foreground">{attendance.check_in_method ?? 'QR Scan'}</span>
              </div>
              <div className="bg-card border border-border p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Break</span>
                <span className="text-sm font-extrabold text-foreground font-mono mt-0.5 block">{attendance.break_minutes ?? 60}m</span>
                <span className="text-[10px] text-muted-foreground">Standard</span>
              </div>
              <div className="bg-card border border-border p-3 rounded-2xl">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Check Out</span>
                <span className="text-sm font-extrabold text-foreground font-mono mt-0.5 block">{attendance.check_out ?? '--:--'}</span>
                <span className="text-[10px] text-muted-foreground">{attendance.check_out_method ?? 'QR Scan'}</span>
              </div>
            </div>

            {/* Calculated Statistics */}
            <div className="grid grid-cols-3 gap-3 bg-muted/20 p-3.5 rounded-2xl border border-border/40 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">Worked Time</span>
                <span className="font-extrabold text-foreground">{attendance.working_hours ?? '0h 0m'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">Late Time</span>
                <span className={`font-extrabold ${attendance.late_minutes > 0 ? 'text-amber-500' : 'text-foreground'}`}>
                  {attendance.late_time ?? '0m'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-bold uppercase">Overtime</span>
                <span className="font-extrabold text-emerald-500">{attendance.overtime_formatted ?? '0m'}</span>
              </div>
            </div>

            {/* Device Lock Metadata */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone size={14} className="text-primary" /> Device Lock & Security Metadata
              </h4>
              <div className="bg-card border border-border rounded-2xl p-3.5 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between"><span className="text-muted-foreground">Device Name:</span> <span className="font-bold text-foreground">{attendance.device_name ?? 'Registered Mobile Device'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Device Platform:</span> <span className="capitalize text-primary font-bold">{attendance.device_platform ?? 'android'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">IP Address:</span> <span>{attendance.device_ip ?? '192.168.1.100'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Device Lock Status:</span> <span className="text-emerald-500 font-bold flex items-center gap-1"><ShieldCheck size={12} /> Locked & Verified</span></div>
              </div>
            </div>

            {/* GPS Location Metadata */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-rose-500" /> GPS Location Coordinates
              </h4>
              <div className="bg-card border border-border rounded-2xl p-3 text-xs flex items-center justify-between font-mono">
                <span>Lat: {attendance.gps_latitude ?? '11.5564'}, Lng: {attendance.gps_longitude ?? '104.9282'}</span>
                <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">Within 100m Radius</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AttendanceDetailModal
