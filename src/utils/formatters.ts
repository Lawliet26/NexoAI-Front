import dayjs from 'dayjs'

export const formatCurrency = (value: number | null | undefined, currency = 'USD'): string => {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatPercent = (value: number | null | undefined, decimals = 2): string => {
  if (value == null) return '—'
  return `${value.toFixed(decimals)}%`
}

export const formatMultiplier = (value: number | null | undefined): string => {
  if (value == null) return '—'
  return `${value.toFixed(2)}x`
}

export const formatNumber = (value: number | null | undefined): string => {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatDate = (date: string | null | undefined, fmt = 'MMM D, YYYY'): string => {
  if (!date) return '—'
  return dayjs(date).format(fmt)
}

export const formatRelativeDate = (date: string | null | undefined): string => {
  if (!date) return '—'
  return dayjs(date).fromNow()
}

export const formatKPI = (
  value: number | null | undefined,
  format: 'currency' | 'percent' | 'multiplier' | 'number'
): string => {
  switch (format) {
    case 'currency': return formatCurrency(value)
    case 'percent': return formatPercent(value)
    case 'multiplier': return formatMultiplier(value)
    case 'number': return formatNumber(value)
    default: return String(value ?? '—')
  }
}
