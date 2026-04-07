import { Row, Col, Typography, Table, Tag, Card, Select, DatePicker, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchMetricsSummary } from '../store/slices/metricsSlice'
import { fetchCampaigns } from '../store/slices/campaignsSlice'
import { KPIWidget } from '../components/KPIWidget/KPIWidget'
import { MetricsChart } from '../components/MetricsChart/MetricsChart'
import { fetchCampaignMetrics } from '../store/slices/metricsSlice'
import { KPI_CONFIG } from '../utils/kpiConfig'
import { formatCurrency, formatPercent } from '../utils/formatters'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const Analytics = () => {
  const dispatch = useAppDispatch()
  const { summary, campaignMetrics, loading } = useAppSelector((s) => s.metrics)
  const { items: campaigns } = useAppSelector((s) => s.campaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchMetricsSummary())
    dispatch(fetchCampaigns({}))
  }, [dispatch])

  useEffect(() => {
    if (selectedCampaign) {
      dispatch(fetchCampaignMetrics({
        campaignId: selectedCampaign,
        params: {
          date_after: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
          date_before: dayjs().format('YYYY-MM-DD'),
        },
      }))
    }
  }, [dispatch, selectedCampaign])

  const totalSpend = summary.reduce((a, s) => a + (s.total_spend || 0), 0)
  const totalConversions = summary.reduce((a, s) => a + (s.total_conversions || 0), 0)
  const avgRoas = summary.length
    ? summary.reduce((a, s) => a + (s.avg_roas || 0), 0) / summary.filter(s => s.avg_roas).length
    : null
  const avgCpa = summary.length
    ? summary.reduce((a, s) => a + (s.avg_cpa || 0), 0) / summary.filter(s => s.avg_cpa).length
    : null

  const summaryColumns = [
    { title: 'Campaña', dataIndex: 'campaign_name', key: 'campaign_name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Gasto', dataIndex: 'total_spend', key: 'total_spend', render: (v: number) => formatCurrency(v), sorter: (a: typeof summary[0], b: typeof summary[0]) => a.total_spend - b.total_spend },
    { title: 'Impresiones', dataIndex: 'total_impressions', key: 'total_impressions', render: (v: number) => v.toLocaleString() },
    { title: 'Conversiones', dataIndex: 'total_conversions', key: 'total_conversions' },
    { title: 'CPA', dataIndex: 'avg_cpa', key: 'avg_cpa', render: (v: number) => formatCurrency(v), sorter: (a: typeof summary[0], b: typeof summary[0]) => a.avg_cpa - b.avg_cpa },
    { title: 'ROAS', dataIndex: 'avg_roas', key: 'avg_roas', render: (v: number) => v ? `${v.toFixed(2)}x` : '—', sorter: (a: typeof summary[0], b: typeof summary[0]) => a.avg_roas - b.avg_roas },
    { title: 'CTR', dataIndex: 'avg_ctr', key: 'avg_ctr', render: (v: number) => formatPercent(v) },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ margin: 0 }}>Analytics</Title>
        <Text type="secondary">Vista agregada de todas tus campañas — últimos 30 días</Text>
      </div>

      {/* Global KPIs */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {[
          { config: KPI_CONFIG.find(k => k.key === 'cpa')!, value: avgCpa },
          { config: KPI_CONFIG.find(k => k.key === 'roas')!, value: avgRoas },
          { config: { key: 'spend', label: 'Gasto Total', format: 'currency' as const, good: 'low' as const, description: '' }, value: totalSpend },
          { config: { key: 'conv', label: 'Conversiones', format: 'number' as const, good: 'high' as const, description: '' }, value: totalConversions },
        ].map((item, i) => (
          <Col xs={12} sm={12} md={6} key={item.config.key}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <KPIWidget config={item.config} value={item.value} loading={loading} />
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Chart con selector de campaña */}
      <Card style={{ borderRadius: 12, marginBottom: 24 }} styles={{ body: { padding: '0 0 20px' } }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Evolución temporal</Text>
            <Select
              placeholder="Seleccionar campaña"
              value={selectedCampaign}
              onChange={setSelectedCampaign}
              style={{ width: 280 }}
              options={campaigns.map(c => ({ value: c.id, label: c.name }))}
              allowClear
            />
          </div>
        }
      >
        {selectedCampaign ? (
          <MetricsChart data={campaignMetrics} loading={loading} />
        ) : (
          <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>
            Seleccioná una campaña para ver la evolución
          </div>
        )}
      </Card>

      {/* Summary Table */}
      <Card style={{ borderRadius: 12 }} title={<Text strong>Resumen por campaña</Text>}>
        <Table
          dataSource={summary}
          columns={summaryColumns}
          rowKey="campaign_id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      </Card>
    </motion.div>
  )
}

export default Analytics
