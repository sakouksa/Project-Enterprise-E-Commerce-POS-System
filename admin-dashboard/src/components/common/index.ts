// Common shared components — barrel export
export { default as PageHeader }     from './PageHeader'
export { default as Breadcrumb }     from './Breadcrumb'
export { default as DataTable }      from './DataTable'
export type { Column }               from './DataTable'
export { default as FormDrawer }     from './FormDrawer'
export { default as StatusBadge }    from './StatusBadge'
export { default as SearchFilter }   from './SearchFilter'
export { default as EmptyState }     from './EmptyState'
export { default as LoadingSpinner } from './LoadingSpinner'
export { default as EnterpriseSelect } from './EnterpriseSelect'
export type { EnterpriseSelectOption, EnterpriseSelectProps } from './EnterpriseSelect'
export { default as ToggleSwitch }     from './ToggleSwitch'
export type { ToggleSwitchProps }       from './ToggleSwitch'
export { default as DeleteConfirmDialog } from './DeleteConfirmDialog'
export { default as ConfirmModal } from './ConfirmModal'
export type { ConfirmVariant, ConfirmModalProps } from './ConfirmModal'
export { default as TableActionMenu } from '../shared/TableActionMenu'
export type { TableActionItem } from '../shared/TableActionMenu'
export { default as FormHeader } from './FormHeader'
export type { FormHeaderProps } from './FormHeader'
export { default as FormFooter } from './FormFooter'
export type { FormFooterProps } from './FormFooter'
export { default as FileUpload } from './FileUpload'
export type { FileUploadProps } from './FileUpload'
export { default as IconColorPicker } from './IconColorPicker'
export type { IconColorPickerProps } from './IconColorPicker'
export { CATEGORY_ICONS_MAP, CATEGORY_COLORS, resolveCategoryVisual } from './categoryIconConstants'
export type { ColorDef } from './categoryIconConstants'
export { default as ModalHeader } from './ModalHeader'
export type { ModalHeaderProps, ModalHeaderIconVariant } from './ModalHeader'
export { default as ModalFooter } from './ModalFooter'
export type { ModalFooterProps } from './ModalFooter'
export { default as EnterpriseModal } from './EnterpriseModal'
export type { EnterpriseModalProps, ModalSize } from './EnterpriseModal'
export { default as CustomerAddressModal } from './CustomerAddressModal'
export type { CustomerAddressModalProps, CustomerAddress, AddressFormData } from './CustomerAddressModal'
export { default as CustomerGroupModal } from './CustomerGroupModal'
export type { CustomerGroupModalProps, CustomerGroup, CustomerGroupFormData } from './CustomerGroupModal'
export { default as PercentBadge } from './PercentBadge'
export { default as AppImage } from './AppImage'
export type { AppImageProps } from './AppImage'
export { default as AvatarImage } from './AvatarImage'
export type { AvatarImageProps } from './AvatarImage'
export type { PercentBadgeProps, PercentBadgeVariant } from './PercentBadge'
export {
  HeaderActionsGroup,
  AddButton,
  ExportButton,
  ImportButton,
  QrKioskButton,
  SaveButton,
  CancelButton,
  FilterButton,
  RefreshButton,
} from './GlobalActionButtons'
export type {
  HeaderActionsGroupProps,
  AddButtonProps,
  ExportButtonProps,
  ImportButtonProps,
  QrKioskButtonProps,
  SaveButtonProps,
  CancelButtonProps,
  FilterButtonProps,
  RefreshButtonProps,
} from './GlobalActionButtons'


