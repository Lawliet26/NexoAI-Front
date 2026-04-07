import api from '../config/axiosGlobal'
import type { CampaignMetrics, MetricsSummary } from '../types/metrics.types'
import type { ApiResponse } from '../types/api.types'

export const metricsService = {
  async getCampaignMetrics(
    campaignId: string,
    params?: { date_after?: string; date_before?: string }
  ): Promise<ApiResponse<CampaignMetrics>> {
    const { data } = await api.get<ApiResponse<CampaignMetrics>>('/metrics/campaigns/', {
      params: { campaign: campaignId, ...params },
    })
    return data
  },

  async getSummary(): Promise<MetricsSummary[]> {
    const { data } = await api.get<MetricsSummary[]>('/metrics/campaigns/summary/')
    return data
  },

  async getAdSetMetrics(adSetId: string): Promise<ApiResponse<CampaignMetrics>> {
    const { data } = await api.get<ApiResponse<CampaignMetrics>>('/metrics/ad-sets/', {
      params: { ad_set: adSetId },
    })
    return data
  },

  async getAdMetrics(adId: string): Promise<ApiResponse<CampaignMetrics>> {
    const { data } = await api.get<ApiResponse<CampaignMetrics>>('/metrics/ads/', {
      params: { ad: adId },
    })
    return data
  },
}
