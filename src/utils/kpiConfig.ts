import type { KPIConfig } from '../types/metrics.types'

export const KPI_CONFIG: KPIConfig[] = [
  {
    key: 'ctr',
    label: 'CTR',
    format: 'percent',
    good: 'high',
    description: 'Click-Through Rate: porcentaje de impresiones que generan un click',
  },
  {
    key: 'cpc',
    label: 'CPC',
    format: 'currency',
    good: 'low',
    description: 'Costo por Click: cuánto cuesta cada click en tu anuncio',
  },
  {
    key: 'cpm',
    label: 'CPM',
    format: 'currency',
    good: 'low',
    description: 'Costo por Mil Impresiones: saturación de audiencia',
  },
  {
    key: 'cpa',
    label: 'CPA',
    format: 'currency',
    good: 'low',
    description: 'Costo por Adquisición: cuánto cuesta cada conversión',
  },
  {
    key: 'roas',
    label: 'ROAS',
    format: 'multiplier',
    good: 'high',
    description: 'Retorno en Inversión Publicitaria: revenue por cada $ gastado',
  },
  {
    key: 'cpp',
    label: 'CPP',
    format: 'currency',
    good: 'low',
    description: 'Costo por Persona: eficiencia de alcance',
  },
  {
    key: 'hook_rate',
    label: 'Hook Rate',
    format: 'percent',
    good: 'high',
    description: 'Porcentaje de personas que inician el video',
  },
  {
    key: 'hold_rate',
    label: 'Hold Rate',
    format: 'percent',
    good: 'high',
    description: 'Porcentaje que ve el video completo',
  },
]
