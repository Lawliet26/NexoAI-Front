export interface CampaignMetrics {
  id: string
  campaign: string
  campaign_name: string
  date: string
  // Raw
  impressions: number
  clicks: number
  spend: number
  conversions: number
  conversion_value: number
  reach: number
  frequency: number
  video_views: number
  link_clicks: number
  landing_page_views: number
  // KPIs calculados
  ctr: number | null
  cpc: number | null
  cpm: number | null
  cpa: number | null
  roas: number | null
  cpp: number | null
  hook_rate: number | null
  hold_rate: number | null
  // vs targets
  cpa_vs_target: number | null
  roas_vs_target: number | null
  synced_at: string
}

export interface MetricsSummary {
  campaign_id: string
  campaign_name: string
  total_spend: number
  total_impressions: number
  total_clicks: number
  total_conversions: number
  total_conversion_value: number
  avg_ctr: number
  avg_cpc: number
  avg_cpm: number
  avg_cpa: number
  avg_roas: number
  last_metric_date: string
}

export type KPIKey = 'ctr' | 'cpc' | 'cpm' | 'cpa' | 'roas' | 'cpp' | 'hook_rate' | 'hold_rate'

export interface KPIConfig {
  key: KPIKey
  label: string
  format: 'currency' | 'percent' | 'multiplier' | 'number'
  good: 'high' | 'low'   // si 'high' → verde cuando sube; si 'low' → verde cuando baja
  description: string
}
