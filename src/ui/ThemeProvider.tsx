import { ConfigProvider, theme as antdTheme } from 'antd'
import { useAppSelector } from '../store/hooks'
import { lightTheme, darkTheme } from '../config/antdTheme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const currentTheme = useAppSelector((s) => s.ui.theme)
  const isDark = currentTheme === 'dark'

  return (
    <ConfigProvider
      theme={{
        ...(isDark ? darkTheme : lightTheme),
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  )
}
