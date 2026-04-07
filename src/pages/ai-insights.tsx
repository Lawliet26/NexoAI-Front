import { Row, Col, Typography, Button, Select, Spin, Empty, message } from 'antd'
import { RobotOutlined, ReloadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { insightService } from '../services/insights'
import { campaignService } from '../services/campaigns'
import { InsightAlert } from '../components/InsightAlert/InsightAlert'
import type { AIInsight, InsightType } from '../types/api.types'
import type { Campaign } from '../types/campaign.types'

const { Title, Text } = Typography

const TYPE_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'performance', label: 'Rendimiento' },
  { value: 'recommendation', label: 'Recomendaciones' },
  { value: 'alert', label: 'Alertas' },
  { value: 'anomaly', label: 'Anomalías' },
]

const AIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [filterType, setFilterType] = useState<InsightType | ''>('')
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)

  const loadInsights = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (filterType) params.insight_type = filterType
      const res = await insightService.getAll(params)
      setInsights(res.results)
    } finally {
      setLoading(false)
    }
  }

  const loadCampaigns = async () => {
    const res = await campaignService.getAll({ status: 'ACTIVE' })
    setCampaigns(res.results)
  }

  useEffect(() => {
    loadInsights()
    loadCampaigns()
  }, [filterType])

  const handleGenerate = async () => {
    if (!selectedCampaign) {
      message.warning('Seleccioná una campaña primero')
      return
    }
    setGenerating(true)
    try {
      const insight = await insightService.generate(selectedCampaign)
      setInsights((prev) => [insight, ...prev])
      message.success('Insight generado con IA')
    } catch {
      message.error('Error al generar insight')
    } finally {
      setGenerating(false)
    }
  }

  const handleMarkRead = async (id: string) => {
    await insightService.markRead(id)
    setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, is_read: true } : i)))
  }

  const handleDismiss = async (id: string) => {
    await insightService.dismiss(id)
    setInsights((prev) => prev.filter((i) => i.id !== id))
  }

  const unreadCount = insights.filter((i) => !i.is_read).length

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Title level={3} style={{ margin: 0 }}>AI Insights</Title>
            {unreadCount > 0 && (
              <span style={{
                background: '#6366F1', color: '#FFF',
                borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600,
              }}>
                {unreadCount} nuevos
              </span>
            )}
          </div>
          <Text type="secondary">Análisis inteligente de tus campañas con Google Gemini</Text>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Select
            placeholder="Campaña para analizar"
            value={selectedCampaign}
            onChange={setSelectedCampaign}
            style={{ width: 260 }}
            options={campaigns.map(c => ({ value: c.id, label: c.name }))}
            allowClear
          />
          <Button
            type="primary"
            icon={<RobotOutlined />}
            loading={generating}
            onClick={handleGenerate}
          >
            Generar análisis
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <Select
          value={filterType}
          onChange={setFilterType}
          options={TYPE_OPTIONS}
          style={{ width: 200 }}
        />
        <Button icon={<ReloadOutlined />} onClick={loadInsights} type="text">
          Actualizar
        </Button>
      </div>

      {/* Insights list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
      ) : insights.length === 0 ? (
        <Empty
          description="No hay insights disponibles"
          style={{ padding: 80 }}
          image={<RobotOutlined style={{ fontSize: 64, color: '#6366F1' }} />}
        >
          <Text type="secondary">Seleccioná una campaña y generá tu primer análisis con IA</Text>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          <AnimatePresence>
            {insights.map((insight) => (
              <Col xs={24} lg={12} key={insight.id}>
                <InsightAlert
                  insight={insight}
                  onMarkRead={handleMarkRead}
                  onDismiss={handleDismiss}
                />
              </Col>
            ))}
          </AnimatePresence>
        </Row>
      )}
    </motion.div>
  )
}

export default AIInsights
