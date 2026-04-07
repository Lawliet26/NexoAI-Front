import api from '../config/axiosGlobal'
import type { AIInsight, MetricAlert } from '../types/api.types'
import type { ApiResponse } from '../types/api.types'

export const insightService = {
  async getAll(params?: { insight_type?: string }): Promise<ApiResponse<AIInsight>> {
    const { data } = await api.get<ApiResponse<AIInsight>>('/ai-insights/insights/', { params })
    return data
  },

  async generate(campaignId: string): Promise<AIInsight> {
    const { data } = await api.post<AIInsight>('/ai-insights/insights/generate/', {
      campaign_id: campaignId,
    })
    return data
  },

  async markRead(id: string): Promise<void> {
    await api.patch(`/ai-insights/insights/${id}/mark_read/`)
  },

  async dismiss(id: string): Promise<void> {
    await api.patch(`/ai-insights/insights/${id}/dismiss/`)
  },

  async getAlerts(): Promise<ApiResponse<MetricAlert>> {
    const { data } = await api.get<ApiResponse<MetricAlert>>('/ai-insights/alerts/')
    return data
  },

  async createAlert(payload: Partial<MetricAlert>): Promise<MetricAlert> {
    const { data } = await api.post<MetricAlert>('/ai-insights/alerts/', payload)
    return data
  },

  async deleteAlert(id: string): Promise<void> {
    await api.delete(`/ai-insights/alerts/${id}/`)
  },
}
