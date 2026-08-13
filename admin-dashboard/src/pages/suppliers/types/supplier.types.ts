export interface SupplierContact {
  id?:                 number
  name:                string
  email?:              string
  phone?:              string
  position?:           string
  title?:              string
  is_primary?:         boolean
}

export interface Supplier {
  id:                  number
  company_id?:         number
  name:                string
  code:                string
  email?:              string
  phone?:              string
  fax?:                string
  address?:            string
  city?:               string
  province?:           string
  country?:            string
  postal_code?:        string
  tax_number?:         string
  bank_name?:          string
  bank_account_number?: string
  bank_account_name?:   string
  notes?:              string
  is_active:           boolean
  contacts?:           SupplierContact[]
  purchases_count?:    number
  total_purchased?:    number
}

export interface SupplierFormData {
  name:                string
  code:                string
  email:               string
  phone:               string
  fax:                 string
  address:             string
  city:                string
  province:            string
  country:             string
  postal_code:         string
  tax_number:          string
  bank_name:           string
  bank_account_number: string
  bank_account_name:   string
  notes:               string
  is_active:           boolean
}

export const BLANK_SUPPLIER_FORM: SupplierFormData = {
  name: '',
  code: '',
  email: '',
  phone: '',
  fax: '',
  address: '',
  city: '',
  province: '',
  country: '',
  postal_code: '',
  tax_number: '',
  bank_name: '',
  bank_account_number: '',
  bank_account_name: '',
  notes: '',
  is_active: true,
}
