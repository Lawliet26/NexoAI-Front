import type { ThemeConfig } from 'antd'

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#4F46E5',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F5F6FA',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    colorTextBase: '#1A1A2E',
  },
  components: {
    Layout: {
      siderBg: '#0F0F1A',
      headerBg: '#FFFFFF',
      bodyBg: '#F5F6FA',
    },
    Menu: {
      darkItemBg: '#0F0F1A',
      darkItemHoverBg: '#1A1A2E',
      darkItemSelectedBg: '#4F46E5',
      darkItemColor: '#A0AEC0',
      darkItemSelectedColor: '#FFFFFF',
    },
    Card: {
      borderRadius: 12,
      colorBorderSecondary: '#E8EAF0',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#F5F6FA',
    },
    Button: {
      borderRadius: 8,
    },
    Input: {
      borderRadius: 8,
    },
    Select: {
      borderRadius: 8,
    },
    Statistic: {
      titleFontSize: 13,
    },
  },
}

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#6366F1',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',
    colorBgContainer: '#1A1A2E',
    colorBgElevated: '#16213E',
    colorBgLayout: '#0F0F1A',
    colorText: '#E2E8F0',
    colorTextSecondary: '#94A3B8',
    colorBorder: '#2D3748',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
  },
  components: {
    Layout: {
      siderBg: '#0A0A14',
      headerBg: '#1A1A2E',
      bodyBg: '#0F0F1A',
    },
    Menu: {
      darkItemBg: '#0A0A14',
      darkItemHoverBg: '#1A1A2E',
      darkItemSelectedBg: '#4F46E5',
      darkItemColor: '#94A3B8',
      darkItemSelectedColor: '#FFFFFF',
    },
    Card: {
      colorBgContainer: '#1A1A2E',
      colorBorderSecondary: '#2D3748',
      borderRadius: 12,
    },
    Table: {
      colorBgContainer: '#1A1A2E',
      headerBg: '#16213E',
      borderRadius: 8,
    },
    Button: {
      borderRadius: 8,
    },
    Input: {
      colorBgContainer: '#16213E',
      borderRadius: 8,
    },
    Select: {
      colorBgContainer: '#16213E',
      borderRadius: 8,
    },
  },
}
