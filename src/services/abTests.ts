import api from '../config/axiosGlobal'
import type { ABTest, ABTestVariant } from '../types/api.types'
import type { ApiResponse } from '../types/api.types'

export const abTestService = {
  async getAll(): Promise<ApiResponse<ABTest>> {
    const { data } = await api.get<ApiResponse<ABTest>>('/ab-testing/')
    return data
  },

  async getById(id: string): Promise<ABTest> {
    const { data } = await api.get<ABTest>(`/ab-testing/${id}/`)
    return data
  },

  async create(payload: Partial<ABTest>): Promise<ABTest> {
    const { data } = await api.post<ABTest>('/ab-testing/', payload)
    return data
  },

  async update(id: string, payload: Partial<ABTest>): Promise<ABTest> {
    const { data } = await api.patch<ABTest>(`/ab-testing/${id}/`, payload)
    return data
  },

  async declareWinner(testId: string, variantId: string): Promise<{ status: string }> {
    const { data } = await api.post(`/ab-testing/${testId}/declare_winner/`, {
      variant_id: variantId,
    })
    return data
  },

  async addVariant(payload: Partial<ABTestVariant>): Promise<ABTestVariant> {
    const { data } = await api.post<ABTestVariant>('/ab-testing/variants/', payload)
    return data
  },
}
