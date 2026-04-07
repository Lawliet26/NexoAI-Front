import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark'

interface UIState {
  theme: Theme
  sidebarCollapsed: boolean
}

const savedTheme = (localStorage.getItem('nexoai_theme') as Theme) || 'dark'

const initialState: UIState = {
  theme: savedTheme,
  sidebarCollapsed: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('nexoai_theme', state.theme)
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      localStorage.setItem('nexoai_theme', action.payload)
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload
    },
  },
})

export const { toggleTheme, setTheme, toggleSidebar, setSidebarCollapsed } = uiSlice.actions
export default uiSlice.reducer
