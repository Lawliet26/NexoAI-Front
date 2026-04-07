import { Card, Tag, Typography, Progress, Badge, Button, Tooltip } from 'antd'
import { TrophyOutlined, ExperimentOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import type { ABTest } from '../../types/api.types'
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters'

const { Text, Title } = Typography

const STATUS_COLOR: Record<string, string> = {
  draft: 'default',
  running: 'processing',
  paused: 'warning',
  completed: 'success',
  cancelled: 'error',
}

interface ABTestCardProps {
  test: ABTest
  onDeclareWinner?: (testId: string, variantId: string) => void
}

export const ABTestCard = ({ test, onDeclareWinner }: ABTestCardProps) => {
  const winner = test.variants.find((v) => v.is_winner)
  const control = test.variants.find((v) => v.is_control)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: '20px 24px' } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ExperimentOutlined style={{ color: '#6366F1' }} />
            <Title level={5} style={{ margin: 0 }} ellipsis>
              {test.name}
            </Title>
          </div>
        }
        extra={
          <Tag color={STATUS_COLOR[test.status]}>
            {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
          </Tag>
        }
      >
        {/* Hypothesis */}
        {test.hypothesis && (
          <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
            "{test.hypothesis}"
          </Text>
        )}

        {/* Variants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {test.variants.map((variant) => {
            const isWinner = variant.is_winner
            const confidence = variant.statistical_confidence
            return (
              <div
                key={variant.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `1px solid ${isWinner ? '#10B981' : 'rgba(255,255,255,0.08)'}`,
                  background: isWinner ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text strong style={{ fontSize: 13 }}>{variant.variant_name}</Text>
                    {variant.is_control && <Badge status="processing" text="Control" />}
                    {isWinner && (
                      <Tag color="success" icon={<TrophyOutlined />}>Ganador</Tag>
                    )}
                  </div>
                  {confidence != null && (
                    <Tooltip title="Confianza estadística">
                      <Text style={{ fontSize: 12, color: '#6366F1' }}>
                        {formatPercent(confidence)} confianza
                      </Text>
                    </Tooltip>
                  )}
                </div>

                {/* KPIs rápidos */}
                <div style={{ display: 'flex', gap: 20 }}>
                  <span style={{ fontSize: 12 }}>
                    <Text type="secondary">CPA: </Text>
                    <Text strong>{formatCurrency(variant.cpa)}</Text>
                  </span>
                  <span style={{ fontSize: 12 }}>
                    <Text type="secondary">ROAS: </Text>
                    <Text strong>{variant.roas ? `${variant.roas}x` : '—'}</Text>
                  </span>
                  <span style={{ fontSize: 12 }}>
                    <Text type="secondary">CTR: </Text>
                    <Text strong>{formatPercent(variant.ctr)}</Text>
                  </span>
                  <span style={{ fontSize: 12 }}>
                    <Text type="secondary">Gasto: </Text>
                    <Text strong>{formatCurrency(variant.total_spend)}</Text>
                  </span>
                </div>

                {/* Progreso de muestra */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>Impresiones</Text>
                    <Text style={{ fontSize: 11 }}>
                      {variant.total_impressions.toLocaleString()} / {test.minimum_sample_size.toLocaleString()}
                    </Text>
                  </div>
                  <Progress
                    percent={Math.min((variant.total_impressions / test.minimum_sample_size) * 100, 100)}
                    showInfo={false}
                    strokeColor="#6366F1"
                    trailColor="rgba(255,255,255,0.08)"
                    size="small"
                  />
                </div>

                {/* Declare winner button */}
                {test.status === 'running' && !test.winner_campaign && onDeclareWinner && (
                  <Button
                    size="small"
                    type="dashed"
                    style={{ marginTop: 10 }}
                    onClick={() => onDeclareWinner(test.id, variant.id)}
                  >
                    Declarar ganador
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Inicio: {formatDate(test.start_date)}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Optimizando: <Text style={{ fontSize: 12 }}>{test.metric_to_optimize.toUpperCase()}</Text>
          </Text>
        </div>
      </Card>
    </motion.div>
  )
}
