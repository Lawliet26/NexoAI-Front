export interface Product {
  id: string
  name: string
  description: string | null
  category: string | null
  sku: string | null
  landing_url: string | null
  image_url: string | null
  target_cpa: number | null
  target_roas: number | null
  target_ctr: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}
