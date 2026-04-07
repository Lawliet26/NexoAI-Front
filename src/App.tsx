import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { lazy, Suspense, useEffect } from 'react'
import { Spin } from 'antd'
import { store } from './store'
import { ThemeProvider } from './ui/ThemeProvider'
import { AppLayout } from './ui/AppLayout'
import { ProtectedRoute } from './ui/ProtectedRoute'
import { ROUTES } from './config/routes'
import { fetchMeThunk } from './store/slices/authSlice'

// Lazy pages
const Login = lazy(() => import('./pages/login'))
const Dashboard = lazy(() => import('./pages/dashboard'))
const Campaigns = lazy(() => import('./pages/campaigns'))
const CampaignDetail = lazy(() => import('./pages/campaign-detail'))
const Products = lazy(() => import('./pages/products'))
const ABTesting = lazy(() => import('./pages/ab-testing'))
const Analytics = lazy(() => import('./pages/analytics'))
const AIInsights = lazy(() => import('./pages/ai-insights'))

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <Spin size="large" />
  </div>
)

// Inner component that can access the store via hooks
const AppContent = () => {
  useEffect(() => {
    // Intentar recuperar el usuario si hay token guardado
    store.dispatch(fetchMeThunk())
  }, [])

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Ruta pública */}
          <Route path={ROUTES.LOGIN} element={<Login />} />

          {/* Rutas protegidas con layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="products" element={<Products />} />
            <Route path="ab-testing" element={<ABTesting />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai-insights" element={<AIInsights />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  )
}

export default App
