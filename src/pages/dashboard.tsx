import { Row, Col, Typography, Spin, Empty, Button, Grid } from 'antd'
import { SyncOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCampaigns, syncCampaign } from '../store/slices/campaignsSlice'
import { fetchMetricsSummary } from '../store/slices/metricsSlice'
import { KPIWidget } from '../components/KPIWidget/KPIWidget'
import { CampaignCard } from '../components/CampaignCard/CampaignCard'
import { KPI_CONFIG } from '../utils/kpiConfig'
import { ROUTES } from '../config/routes'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const screens = useBreakpoint()
  const { items: campaigns, loading: campaignsLoading } = useAppSelector((s) => s.campaigns)
  const { summary } = useAppSelector((s) => s.metrics)
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    dispatch(fetchCampaigns({ status: 'ACTIVE' }))
    dispatch(fetchMetricsSummary())
  }, [dispatch])

  // Agregar métricas de todas las campañas para el overview
  const totalSpend = summary.reduce((acc, s) => acc + (s.total_spend || 0), 0)
  const avgCpa = summary.length > 0
    ? summary.reduce((acc, s) => acc + (s.avg_cpa || 0), 0) / summary.filter(s => s.avg_cpa).length
    : null
  const avgRoas = summary.length > 0
    ? summary.reduce((acc, s) => acc + (s.avg_roas || 0), 0) / summary.filter(s => s.avg_roas).length
    : null
  const avgCtr = summary.length > 0
    ? summary.reduce((acc, s) => acc + (s.avg_ctr || 0), 0) / summary.filter(s => s.avg_ctr).length
    : null

  const overviewKPIs = [
    { config: KPI_CONFIG.find(k => k.key === 'cpa')!, value: avgCpa },
    { config: KPI_CONFIG.find(k => k.key === 'roas')!, value: avgRoas },
    { config: KPI_CONFIG.find(k => k.key === 'ctr')!, value: avgCtr },
    {
      config: {
        key: 'spend' as never,
        label: 'Gasto Total',
        format: 'currency' as const,
        good: 'low' as const,
        description: 'Gasto total en todas las campañas activas (últimos 30 días)',
      },
      value: totalSpend,
    },
  ]

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Buen día{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''} 👋
            </Title>
            <Text type="secondary">Vista general de tus campañas activas</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(ROUTES.CAMPAIGNS)}
          >
            {screens.sm ? 'Nueva campaña' : ''}
          </Button>
        </div>
      </motion.div>

      {/* KPI Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {overviewKPIs.map((kpi, i) => (
          <Col xs={12} sm={12} md={6} key={kpi.config.key}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <KPIWidget config={kpi.config} value={kpi.value} loading={campaignsLoading} />
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Active campaigns */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Campañas Activas</Title>
        <Button
          type="text"
          icon={<SyncOutlined />}
          onClick={() => dispatch(fetchCampaigns({ status: 'ACTIVE' }))}
          size="small"
        >
          Actualizar
        </Button>
      </div>

      {campaignsLoading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : campaigns.length === 0 ? (
        <Empty
          description="No hay campañas activas"
          style={{ padding: 60 }}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.CAMPAIGNS)}>
            Crear campaña
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {campaigns.slice(0, 6).map((campaign) => (
            <Col xs={24} sm={12} lg={8} key={campaign.id}>
              <CampaignCard
                campaign={campaign}
                onSync={(id) => dispatch(syncCampaign(id))}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Dashboard
