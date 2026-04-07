import { Card, Statistic, Tooltip, Typography } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { formatKPI } from '../../utils/formatters'
import type { KPIConfig } from '../../types/metrics.types'

const { Text } = Typography

interface KPIWidgetProps {
  config: KPIConfig
  value: number | null | undefined
  previousValue?: number | null
  loading?: boolean
}

export const KPIWidget = ({ config, value, previousValue, loading }: KPIWidgetProps) => {
  const formattedValue = formatKPI(value, config.format)
  const change =
    value != null && previousValue != null && previousValue !== 0
      ? ((value - previousValue) / previousValue) * 100
      : null

  const isPositive = change != null ? change > 0 : null
  const isGood =
    isPositive != null
      ? config.good === 'high'
        ? isPositive
        : !isPositive
      : null

  const changeColor =
    isGood === true ? '#10B981' : isGood === false ? '#EF4444' : undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        loading={loading}
        style={{ borderRadius: 12 }}
        styles={{ body: { padding: '20px 24px' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                {config.label}
              </Text>
              <Tooltip title={config.description}>
                <InfoCircleOutlined style={{ fontSize: 12, color: '#94A3B8', cursor: 'pointer' }} />
              </Tooltip>
            </div>

            <Statistic
              value={formattedValue}
              valueStyle={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}
              formatter={(v) => String(v)}
            />
          </div>

          {change != null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 20,
                background: `${changeColor}18`,
                color: changeColor,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {isPositive ? (
                <ArrowUpOutlined style={{ fontSize: 11 }} />
              ) : (
                <ArrowDownOutlined style={{ fontSize: 11 }} />
              )}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
