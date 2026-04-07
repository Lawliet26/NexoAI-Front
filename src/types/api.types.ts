export interface ApiResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  detail?: string
  message?: string
  [key: string]: unknown
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  timezone: string
  created_at: string
}

export type ABTestStatus = 'draft' | 'running' | 'paused' | 'completed' | 'cancelled'
export type InsightType = 'performance' | 'recommendation' | 'alert' | 'anomaly'

export interface ABTestVariant {
  id: string
  ab_test: string
  campaign: string
  campaign_name: string
  variant_name: string
  is_control: boolean
  variant_description: string | null
  total_spend: number
  total_impressions: number
  total_clicks: number
  total_conversions: number
  total_conversion_value: number
  ctr: number | null
  cpc: number | null
  cpa: number | null
  roas: number | null
  p_value: number | null
  statistical_confidence: number | null
  is_winner: boolean
  created_at: string
}

export interface ABTest {
  id: string
  product: string | null
  product_name: string | null
  name: string
  description: string | null
  hypothesis: string | null
  status: ABTestStatus
  test_type: 'creative' | 'audience' | 'budget' | 'copy' | 'landing'
  metric_to_optimize: 'cpa' | 'ctr' | 'roas' | 'cpc' | 'conversions'
  minimum_sample_size: number
  confidence_level: number
  winner_campaign: string | null
  winner_declared_at: string | null
  winning_confidence: number | null
  conclusion: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  variants: ABTestVariant[]
}

export interface AIInsight {
  id: string
  campaign: string | null
  campaign_name: string | null
  product: string | null
  product_name: string | null
  ab_test: string | null
  insight_type: InsightType
  title: string
  content: string
  recommended_actions: { action: string; priority: string; expected_impact: string }[]
  confidence_score: number | null
  is_read: boolean
  is_dismissed: boolean
  is_resolved: boolean
  ai_model: string
  tokens_used: number | null
  generated_at: string
  expires_at: string | null
}

export interface MetricAlert {
  id: string
  campaign: string | null
  metric_name: string
  condition: 'gt' | 'lt' | 'gte' | 'lte'
  threshold_value: number
  is_active: boolean
  last_triggered_at: string | null
  trigger_count: number
  notify_email: boolean
  created_at: string
}
