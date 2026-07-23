import React, { useState, useEffect } from 'react'
import { X, QrCode, CheckCircle2, RefreshCw, ShieldCheck, Copy, Clock } from 'lucide-react'

interface POSKHQRModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  referenceNo: string
  onPaymentSuccess: () => void
}

export const POSKHQRModal: React.FC<POSKHQRModalProps> = ({
  isOpen,
  onClose,
  amount,
  referenceNo,
  onPaymentSuccess,
}) => {
  if (!isOpen) return null

  const [timeLeft, setTimeLeft] = useState(180) // 3 mins timer
  const [isVerifying, setIsVerifying] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const mins = Math.floor(timeLeft / 60)
  const secs = String(timeLeft % 60).padStart(2, '0')

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceNo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSimulatePayment = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      onPaymentSuccess()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] tracking-wide">
              KHQR
            </span>
            <h3 className="font-extrabold text-sm text-foreground">Bakong KHQR Payment</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Amount Header */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-3 space-y-1">
          <span className="text-xs text-muted-foreground font-medium block">Total Payable Amount</span>
          <div className="text-2xl font-black text-primary">${amount.toFixed(2)}</div>
          <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-1 font-mono">
            Ref: {referenceNo}
            <button onClick={handleCopyRef} className="hover:text-primary">
              <Copy size={11} />
            </button>
            {copied && <span className="text-emerald-500 font-bold">Copied!</span>}
          </div>
        </div>

        {/* KHQR Graphic Display */}
        <div className="relative mx-auto w-56 h-56 bg-white p-3 rounded-2xl border-4 border-rose-500/80 shadow-lg flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-gray-200 pb-1">
            <span className="text-[9px] font-black text-rose-600 tracking-tighter">Bakong KHQR</span>
            <span className="text-[8px] font-bold text-gray-500">Enterprise POS</span>
          </div>

          {/* QR Pattern SVG */}
          <div className="p-2 bg-white rounded-lg">
            <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="white"/>
              <rect x="10" y="10" width="25" height="25" fill="#111827"/>
              <rect x="15" y="15" width="15" height="15" fill="white"/>
              <rect x="18" y="18" width="9" height="9" fill="#111827"/>

              <rect x="65" y="10" width="25" height="25" fill="#111827"/>
              <rect x="70" y="15" width="15" height="15" fill="white"/>
              <rect x="73" y="18" width="9" height="9" fill="#111827"/>

              <rect x="10" y="65" width="25" height="25" fill="#111827"/>
              <rect x="15" y="70" width="15" height="15" fill="white"/>
              <rect x="18" y="73" width="9" height="9" fill="#111827"/>

              {/* Data modules */}
              <rect x="42" y="12" width="6" height="6" fill="#111827"/>
              <rect x="52" y="18" width="6" height="6" fill="#111827"/>
              <rect x="42" y="28" width="12" height="6" fill="#111827"/>
              <rect x="42" y="42" width="16" height="16" fill="#E11D48"/>
              <rect x="65" y="45" width="12" height="6" fill="#111827"/>
              <rect x="12" y="42" width="16" height="8" fill="#111827"/>
              <rect x="42" y="65" width="8" height="15" fill="#111827"/>
              <rect x="65" y="65" width="20" height="20" fill="#111827"/>
              <rect x="70" y="70" width="10" height="10" fill="white"/>
            </svg>
          </div>

          <div className="w-full text-center text-[9px] font-bold text-gray-700">
            Scan with any ABA / Wing / ACLEDA App
          </div>
        </div>

        {/* Timer & Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
          <span className="flex items-center gap-1 font-mono font-bold text-amber-500">
            <Clock size={13} /> {mins}:{secs}
          </span>
          <span className="flex items-center gap-1 text-emerald-500 font-semibold">
            <ShieldCheck size={13} /> Auto-checking
          </span>
        </div>

        {/* Simulated Verify Button */}
        <button
          onClick={handleSimulatePayment}
          disabled={isVerifying}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {isVerifying ? (
            <>
              <RefreshCw size={14} className="animate-spin" /> Verifying KHQR Payment...
            </>
          ) : (
            <>
              <CheckCircle2 size={14} /> Confirm KHQR Received
            </>
          )}
        </button>

      </div>
    </div>
  )
}
