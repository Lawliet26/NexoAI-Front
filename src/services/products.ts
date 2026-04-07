import api from '../config/axiosGlobal'
import type { Product } from '../types/product.types'
import type { ApiResponse } from '../types/api.types'

export const productService = {
  async getAll(): Promise<ApiResponse<Product>> {
    const { data } = await api.get<ApiResponse<Product>>('/products/')
    return data
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}/`)
    return data
  },

  async create(payload: Partial<Product>): Promise<Product> {
    const { data } = await api.post<Product>('/products/', payload)
    return data
  },

  async update(id: string, payload: Partial<Product>): Promise<Product> {
    const { data } = await api.patch<Product>(`/products/${id}/`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}/`)
  },
}
