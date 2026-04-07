import { Row, Col, Typography, Button, Tag, Tabs, Spin, DatePicker, Breadcrumb } from 'antd'
import { SyncOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCampaignById, syncCampaign } from '../store/slices/campaignsSlice'
import { fetchCampaignMetrics } from '../store/slices/metricsSlice'
import { KPIWidget } from '../components/KPIWidget/KPIWidget'
import { MetricsChart } from '../components/MetricsChart/MetricsChart'
import { KPI_CONFIG } from '../utils/kpiConfig'
import { ROUTES } from '../config/routes'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'success', PAUSED: 'warning', ARCHIVED: 'default', DELETED: 'error',
}

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selected: campaign, loading: campaignLoading } = useAppSelector((s) => s.campaigns)
  const { campaignMetrics, loading: metricsLoading } = useAppSelector((s) => s.metrics)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ])

  useEffect(() => {
    if (id) {
      dispatch(fetchCampaignById(id))
      dispatch(fetchCampaignMetrics({
        campaignId: id,
        params: {
          date_after: dateRange[0].format('YYYY-MM-DD'),
          date_before: dateRange[1].format('YYYY-MM-DD'),
        },
      }))
    }
  }, [dispatch, id, dateRange])

  if (campaignLoading && !campaign) {
    return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
  }

  if (!campaign) return null

  // Tomar la última métrica para los KPIs del header
  const latestMetric = campaignMetrics[0]

  const kpisToShow = KPI_CONFIG.slice(0, 4)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Breadcrumb */}
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <span onClick={() => navigate(ROUTES.CAMPAIGNS)} style={{ cursor: 'pointer' }}>Campañas</span> },
          { title: campaign.name },
        ]}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ROUTES.CAMPAIGNS)}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Title level={3} style={{ margin: 0 }}>{campaign.name}</Title>
              <Tag color={STATUS_COLOR[campaign.status]}>{campaign.status}</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {campaign.meta_campaign_id}
              {campaign.ad_account_name && ` · ${campaign.ad_account_name}`}
            </Text>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <RangePicker
            value={dateRange}
            onChange={(v) => v && setDateRange(v as [dayjs.Dayjs, dayjs.Dayjs])}
            size="middle"
          />
          <Button
            icon={<SyncOutlined />}
            onClick={() => dispatch(syncCampaign(campaign.id))}
          >
            Sincronizar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {kpisToShow.map((kpi, i) => (
          <Col xs={12} sm={12} md={6} key={kpi.key}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <KPIWidget
                config={kpi}
                value={latestMetric?.[kpi.key] as number}
                loading={metricsLoading}
              />
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Chart + Tabs */}
      <Tabs
        defaultActiveKey="metrics"
        items={[
          {
            key: 'metrics',
            label: 'Métricas',
            children: (
              <MetricsChart
                data={campaignMetrics}
                loading={metricsLoading}
                title={`Rendimiento — ${campaign.name}`}
              />
            ),
          },
          {
            key: 'adsets',
            label: `Ad Sets (${campaign.ad_sets?.length || 0})`,
            children: (
              <div>
                {campaign.ad_sets?.map((adSet) => (
                  <div
                    key={adSet.id}
                    style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Text strong>{adSet.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12, marginLeft: 12 }}>{adSet.meta_adset_id}</Text>
                    <Tag style={{ marginLeft: 12 }} color={STATUS_COLOR[adSet.status]}>{adSet.status}</Tag>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
    </motion.div>
  )
}

export default CampaignDetail
