import React from 'react'
import EnterpriseDatePicker from '@/components/common/EnterpriseDatePicker'
import type { EnterpriseDatePickerProps } from '@/components/common/EnterpriseDatePicker'

export type ModernDatePickerProps = EnterpriseDatePickerProps

export const ModernDatePicker: React.FC<ModernDatePickerProps> = (props) => {
  return <EnterpriseDatePicker {...props} />
}

export default ModernDatePicker
