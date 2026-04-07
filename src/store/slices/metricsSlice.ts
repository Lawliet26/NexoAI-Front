import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { metricsService } from '../../services/metrics'
import type { CampaignMetrics, MetricsSummary } from '../../types/metrics.types'

interface MetricsState {
  campaignMetrics: CampaignMetrics[]
  summary: MetricsSummary[]
  loading: boolean
  error: string | null
}

const initialState: MetricsState = {
  campaignMetrics: [],
  summary: [],
  loading: false,
  error: null,
}

export const fetchCampaignMetrics = createAsyncThunk(
  'metrics/fetchCampaign',
  async ({ campaignId, params }: { campaignId: string; params?: Record<string, string> }, { rejectWithValue }) => {
    try {
      const res = await metricsService.getCampaignMetrics(campaignId, params)
      return res.results
    } catch {
      return rejectWithValue('Error al cargar métricas')
    }
  }
)

export const fetchMetricsSummary = createAsyncThunk(
  'metrics/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await metricsService.getSummary()
    } catch {
      return rejectWithValue('Error al cargar resumen')
    }
  }
)

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaignMetrics.pending, (state) => { state.loading = true })
      .addCase(fetchCampaignMetrics.fulfilled, (state, action) => {
        state.loading = false
        state.campaignMetrics = action.payload
      })
      .addCase(fetchCampaignMetrics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchMetricsSummary.fulfilled, (state, action) => {
        state.summary = action.payload
      })
  },
})

export default metricsSlice.reducer
