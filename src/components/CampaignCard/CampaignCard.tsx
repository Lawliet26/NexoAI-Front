import { Card, Tag, Typography, Space, Button, Tooltip } from 'antd'
import { SyncOutlined, RightOutlined, PauseOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Campaign } from '../../types/campaign.types'
import { formatCurrency, formatDate } from '../../utils/formatters'

const { Text, Title } = Typography

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  ACTIVE: { color: 'success', icon: <CheckCircleOutlined />, label: 'Activa' },
  PAUSED: { color: 'warning', icon: <PauseOutlined />, label: 'Pausada' },
  ARCHIVED: { color: 'default', icon: null, label: 'Archivada' },
  DELETED: { color: 'error', icon: null, label: 'Eliminada' },
}

interface CampaignCardProps {
  campaign: Campaign
  onSync?: (id: string) => void
  syncing?: boolean
}

export const CampaignCard = ({ campaign, onSync, syncing }: CampaignCardProps) => {
  const navigate = useNavigate()
  const statusCfg = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.ACTIVE

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        style={{ borderRadius: 12, cursor: 'pointer' }}
        styles={{ body: { padding: '20px 24px' } }}
        onClick={() => navigate(`/campaigns/${campaign.id}`)}
        actions={[
          <Tooltip title="Sincronizar con Meta" key="sync">
            <Button
              type="text"
              icon={<SyncOutlined spin={syncing} />}
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                onSync?.(campaign.id)
              }}
            />
          </Tooltip>,
          <Button
            type="text"
            icon={<RightOutlined />}
            size="small"
            key="detail"
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          />,
        ]}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <Tag color={statusCfg.color} icon={statusCfg.icon}>
            {statusCfg.label}
          </Tag>
          {campaign.product_name && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {campaign.product_name}
            </Text>
          )}
        </div>

        {/* Name */}
        <Title level={5} style={{ marginBottom: 4, marginTop: 0 }} ellipsis={{ rows: 1 }}>
          {campaign.name}
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {campaign.meta_campaign_id}
        </Text>

        {/* Budget & dates */}
        <div style={{ marginTop: 16, display: 'flex', gap: 24 }}>
          <Space direction="vertical" size={2}>
            <Text type="secondary" style={{ fontSize: 11 }}>Presupuesto diario</Text>
            <Text strong style={{ fontSize: 14 }}>
              {campaign.daily_budget ? formatCurrency(campaign.daily_budget) : '—'}
            </Text>
          </Space>
          <Space direction="vertical" size={2}>
            <Text type="secondary" style={{ fontSize: 11 }}>Fecha inicio</Text>
            <Text style={{ fontSize: 14 }}>{formatDate(campaign.start_date)}</Text>
          </Space>
        </div>

        {/* Tags */}
        {campaign.tags.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {campaign.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} style={{ fontSize: 11, marginBottom: 4 }}>{tag}</Tag>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
