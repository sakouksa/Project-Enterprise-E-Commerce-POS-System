import React from 'react'
import ConfirmModal from '@/components/common/ConfirmModal'
import type { ConfirmVariant } from '@/components/common/ConfirmModal'

export interface ConfirmDialogProps {
  open: boolean
  title?: string
  subtitle?: string
  message?: React.ReactNode
  itemName?: string
  warningText?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  isPending?: boolean
  variant?: ConfirmVariant
  icon?: React.ComponentType<{ size?: number; className?: string }>
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  subtitle,
  message,
  itemName,
  warningText,
  confirmText,
  cancelText,
  loading = false,
  isPending = false,
  variant = 'danger',
  icon,
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmModal
      isOpen={open}
      variant={variant}
      title={title}
      subtitle={subtitle}
      message={message}
      itemName={itemName}
      warningText={warningText}
      confirmText={confirmText}
      cancelText={cancelText}
      isPending={loading || isPending}
      icon={icon}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}

export default ConfirmDialog
