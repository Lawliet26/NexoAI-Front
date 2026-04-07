import { Card, Button, Tag, Typography, Space } from 'antd'
import {
  BulbOutlined,
  WarningOutlined,
  CheckOutlined,
  CloseOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import type { AIInsight } from '../../types/api.types'
import { formatDate } from '../../utils/formatters'

const { Text, Title, Paragraph } = Typography

const INSIGHT_CONFIG = {
  performance: { icon: <BarChartOutlined />, color: '#3B82F6', tag: 'Rendimiento' },
  recommendation: { icon: <BulbOutlined />, color: '#F59E0B', tag: 'Recomendación' },
  alert: { icon: <WarningOutlined />, color: '#EF4444', tag: 'Alerta' },
  anomaly: { icon: <ThunderboltOutlined />, color: '#8B5CF6', tag: 'Anomalía' },
}

interface InsightAlertProps {
  insight: AIInsight
  onMarkRead?: (id: string) => void
  onDismiss?: (id: string) => void
}

export const InsightAlert = ({ insight, onMarkRead, onDismiss }: InsightAlertProps) => {
  const cfg = INSIGHT_CONFIG[insight.insight_type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card
        style={{
          borderRadius: 12,
          borderLeft: `4px solid ${cfg.color}`,
          opacity: insight.is_read ? 0.7 : 1,
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: cfg.color, fontSize: 16 }}>{cfg.icon}</span>
            <Tag color={cfg.color} style={{ margin: 0, fontSize: 11 }}>{cfg.tag}</Tag>
            {!insight.is_read && (
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#6366F1',
                  display: 'inline-block',
                }}
              />
            )}
          </div>
          <Space size={4}>
            {!insight.is_read && onMarkRead && (
              <Button
                type="text"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => onMarkRead(insight.id)}
                style={{ color: '#10B981' }}
              />
            )}
            {onDismiss && (
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => onDismiss(insight.id)}
                style={{ color: '#94A3B8' }}
              />
            )}
          </Space>
        </div>

        {/* Content */}
        <Title level={5} style={{ marginBottom: 8, marginTop: 0 }}>{insight.title}</Title>
        <Paragraph
          style={{ fontSize: 13, marginBottom: 12, color: '#94A3B8' }}
          ellipsis={{ rows: 3, expandable: true, symbol: 'ver más' }}
        >
          {insight.content}
        </Paragraph>

        {/* Recommended actions */}
        {insight.recommended_actions?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Acciones recomendadas
            </Text>
            <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
              {insight.recommended_actions.slice(0, 3).map((action, i) => (
                <li key={i} style={{ fontSize: 13, marginBottom: 4 }}>
                  <Text>{action.action}</Text>
                  {action.expected_impact && (
                    <Text type="secondary" style={{ fontSize: 12 }}> → {action.expected_impact}</Text>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {insight.campaign_name && (
            <Text type="secondary" style={{ fontSize: 12 }}>📢 {insight.campaign_name}</Text>
          )}
          <Text type="secondary" style={{ fontSize: 12 }}>
            {formatDate(insight.generated_at, 'MMM D, HH:mm')}
          </Text>
        </div>
      </Card>
    </motion.div>
  )
}
