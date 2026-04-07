export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED'

export type CampaignObjective =
  | 'OUTCOME_TRAFFIC'
  | 'OUTCOME_CONVERSIONS'
  | 'OUTCOME_SALES'
  | 'OUTCOME_LEADS'
  | 'OUTCOME_ENGAGEMENT'
  | 'OUTCOME_AWARENESS'
  | 'OUTCOME_APP_PROMOTION'

export interface Campaign {
  id: string
  ad_account: string
  ad_account_name: string
  product: string | null
  product_name: string | null
  meta_campaign_id: string
  name: string
  status: CampaignStatus
  objective: CampaignObjective | null
  daily_budget: number | null
  lifetime_budget: number | null
  budget_remaining: number | null
  start_date: string | null
  end_date: string | null
  last_synced_at: string | null
  sync_enabled: boolean
  notes: string | null
  tags: string[]
  created_at: string
  ad_sets: AdSet[]
}

export interface AdSet {
  id: string
  campaign: string
  meta_adset_id: string
  name: string
  status: CampaignStatus
  daily_budget: number | null
  lifetime_budget: number | null
  optimization_goal: string | null
  billing_event: string | null
  targeting_summary: Record<string, unknown>
  last_synced_at: string | null
  created_at: string
  ads: Ad[]
}

export interface Ad {
  id: string
  ad_set: string
  meta_ad_id: string
  name: string
  status: CampaignStatus
  creative_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | null
  headline: string | null
  body: string | null
  call_to_action: string | null
  image_url: string | null
  video_url: string | null
  destination_url: string | null
  last_synced_at: string | null
  created_at: string
}

export interface AdAccount {
  id: string
  meta_account_id: string
  name: string
  currency: string
  timezone: string
  business_name: string | null
  status: 'active' | 'inactive' | 'error'
  token_expires_at: string | null
  last_synced_at: string | null
  created_at: string
}
