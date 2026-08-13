import React, { useState, useEffect } from 'react'
import { X, CheckCircle2, RefreshCw, Copy, Clock, QrCode } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { sound } from '@/utils/sound'

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
  const { t } = useTranslation(['pos', 'common'])
  const [timeLeft, setTimeLeft] = useState(180)
  const [isVerifying, setIsVerifying] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setTimeLeft(180)
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000)
    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen) return null

  const mins = Math.floor(timeLeft / 60)
  const secs = String(timeLeft % 60).padStart(2, '0')

  const handleCopyRef = () => {
    sound.playClick()
    navigator.clipboard.writeText(referenceNo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSimulatePayment = () => {
    setIsVerifying(true)
    sound.playClick()
    setTimeout(() => {
      setIsVerifying(false)
      sound.playSuccess()
      onPaymentSuccess()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-card border border-border/90 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary">
              <QrCode size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-base text-foreground leading-tight">
                {t('bakongKhqrPayment', 'Bakong KHQR Payment')}
              </h3>
              <span className="text-xs text-muted-foreground font-medium">
                Bakong KHQR Standard
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Amount Summary Box */}
        <div className="bg-muted/30 border border-border/70 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-muted-foreground font-medium block">
            {t('totalPayableAmount', 'Total Payable Amount')}
          </span>
          <div className="text-3xl font-black text-primary tracking-tight">
            ${amount.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 pt-1">
            <span>{t('refNoLabel', 'Ref:')} <strong className="font-mono text-foreground font-bold">{referenceNo}</strong></span>
            <button 
              type="button"
              onClick={handleCopyRef} 
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              title={t('copyAccount', 'Copy')}
            >
              {copied ? <span className="text-emerald-500 font-bold text-[11px]">{t('copied', 'Copied!')}</span> : <Copy size={13} />}
            </button>
          </div>
        </div>

        {/* KHQR Graphic Display Card */}
        <div className="relative mx-auto w-full max-w-[240px] bg-white dark:bg-card p-4 rounded-3xl border border-border/80 shadow-sm flex flex-col items-center gap-3">
          {/* Header Bar inside QR Card */}
          <div className="w-full flex items-center justify-between border-b border-border/60 pb-2 px-1">
            <span className="text-xs font-black text-primary tracking-tight">Bakong KHQR</span>
            <span className="text-[10px] font-bold text-muted-foreground">Enterprise POS</span>
          </div>

          {/* QR Code SVG Visual */}
          <div className="p-2 bg-white rounded-2xl border border-gray-100 dark:border-border/40 shadow-2xs">
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

              <rect x="42" y="12" width="6" height="6" fill="#111827"/>
              <rect x="52" y="18" width="6" height="6" fill="#111827"/>
              <rect x="42" y="28" width="12" height="6" fill="#111827"/>
              <rect x="42" y="42" width="16" height="16" fill="hsl(var(--primary))"/>
              <rect x="65" y="45" width="12" height="6" fill="#111827"/>
              <rect x="12" y="42" width="16" height="8" fill="#111827"/>
              <rect x="42" y="65" width="8" height="15" fill="#111827"/>
              <rect x="65" y="65" width="20" height="20" fill="#111827"/>
              <rect x="70" y="70" width="10" height="10" fill="white"/>
            </svg>
          </div>

          <p className="text-[11px] font-semibold text-muted-foreground leading-normal px-1">
            {t('scanKhqrDesc', 'Scan with any ABA, Wing, or ACLEDA App')}
          </p>
        </div>

        {/* Timer & Auto-Checking Status */}
        <div className="flex items-center justify-between text-xs px-1 pt-1">
          <span className="flex items-center gap-1.5 font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 text-xs">
            <Clock size={13} /> {mins}:{secs}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t('autoChecking', 'Auto-checking')}
          </span>
        </div>

        {/* Confirm Payment Action Button */}
        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={isVerifying}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-50 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          {isVerifying ? (
            <>
              <RefreshCw size={16} className="animate-spin" /> 
              <span>{t('verifyingKhqr', 'Verifying KHQR Payment...')}</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> 
              <span>{t('confirmKhqrReceived', 'Confirm KHQR Received')}</span>
            </>
          )}
        </button>

      </div>
    </div>
  )
}
