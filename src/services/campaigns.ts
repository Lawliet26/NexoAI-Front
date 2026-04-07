import api from '../config/axiosGlobal'
import type { Campaign, AdAccount } from '../types/campaign.types'
import type { ApiResponse } from '../types/api.types'

export const campaignService = {
  async getAll(params?: Record<string, string>): Promise<ApiResponse<Campaign>> {
    const { data } = await api.get<ApiResponse<Campaign>>('/campaigns/', { params })
    return data
  },

  async getById(id: string): Promise<Campaign> {
    const { data } = await api.get<Campaign>(`/campaigns/${id}/`)
    return data
  },

  async create(payload: Partial<Campaign>): Promise<Campaign> {
    const { data } = await api.post<Campaign>('/campaigns/', payload)
    return data
  },

  async update(id: string, payload: Partial<Campaign>): Promise<Campaign> {
    const { data } = await api.patch<Campaign>(`/campaigns/${id}/`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/campaigns/${id}/`)
  },

  async syncCampaign(id: string): Promise<{ status: string }> {
    const { data } = await api.post<{ status: string }>(`/campaigns/${id}/sync/`)
    return data
  },

  async getAdAccounts(): Promise<ApiResponse<AdAccount>> {
    const { data } = await api.get<ApiResponse<AdAccount>>('/accounts/ad-accounts/')
    return data
  },
}
