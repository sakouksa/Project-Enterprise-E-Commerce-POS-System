import React from 'react'
import ConfirmModal from '@/components/common/ConfirmModal'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message?: React.ReactNode
  confirmText?: string
  cancelText?: string
  loading?: boolean
  variant?: 'danger' | 'warning' | 'info' | 'success'
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText,
  cancelText,
  loading = false,
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmModal
      isOpen={open}
      variant={variant}
      title={title}
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
      isPending={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}

export default ConfirmDialog
