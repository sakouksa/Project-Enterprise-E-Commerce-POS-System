import type { Purchase } from '../types/purchase.types'

export const formatCurrency = (val: number | string, curr: string = 'USD'): string => {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0
  if (curr === 'KHR') {
    return '៛' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0
    }).format(Math.round(num))
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(num)
}

export const getDualValues = (amountInSelected: number, currencyCode: string = 'USD', exchangeRate: number | string = 4100) => {
  const rate = typeof exchangeRate === 'number' ? exchangeRate : parseFloat(exchangeRate) || 4100
  if (currencyCode === 'USD') {
    return {
      usd: amountInSelected,
      khr: amountInSelected * rate
    }
  } else {
    return {
      usd: amountInSelected / rate,
      khr: amountInSelected
    }
  }
}

export const getDetailDualValues = (amountInSelected: number, purchase: Purchase) => {
  const rate = parseFloat(purchase.exchange_rate?.toString()) || 4100
  if (purchase.currency_code === 'USD') {
    return {
      usd: amountInSelected,
      khr: amountInSelected * rate
    }
  } else {
    return {
      usd: amountInSelected / rate,
      khr: amountInSelected
    }
  }
}

export const formatListDualCurrency = (val: number, row: Purchase): string => {
  const vals = getDetailDualValues(val, row)
  return `${formatCurrency(vals.usd, 'USD')} (${formatCurrency(vals.khr, 'KHR')})`
}
