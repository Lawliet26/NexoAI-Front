import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { campaignService } from '../../services/campaigns'
import type { Campaign } from '../../types/campaign.types'

interface CampaignsState {
  items: Campaign[]
  selected: Campaign | null
  loading: boolean
  error: string | null
  total: number
}

const initialState: CampaignsState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
  total: 0,
}

export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchAll',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      return await campaignService.getAll(params)
    } catch {
      return rejectWithValue('Error al cargar campañas')
    }
  }
)

export const fetchCampaignById = createAsyncThunk(
  'campaigns/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await campaignService.getById(id)
    } catch {
      return rejectWithValue('Error al cargar la campaña')
    }
  }
)

export const syncCampaign = createAsyncThunk(
  'campaigns/sync',
  async (id: string, { rejectWithValue }) => {
    try {
      return await campaignService.syncCampaign(id)
    } catch {
      return rejectWithValue('Error al sincronizar')
    }
  }
)

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.results
        state.total = action.payload.count
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchCampaignById.pending, (state) => { state.loading = true })
      .addCase(fetchCampaignById.fulfilled, (state, action: PayloadAction<Campaign>) => {
        state.loading = false
        state.selected = action.payload
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearSelected } = campaignsSlice.actions
export default campaignsSlice.reducer
