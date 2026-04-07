import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, Empty, Select, Typography } from 'antd'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useAppSelector } from '../../store/hooks'
import type { CampaignMetrics } from '../../types/metrics.types'
import { formatKPI } from '../../utils/formatters'
import { KPI_CONFIG } from '../../utils/kpiConfig'

const { Text } = Typography

type MetricKey = 'spend' | 'ctr' | 'cpc' | 'cpa' | 'roas' | 'impressions' | 'clicks' | 'conversions'

const METRIC_OPTIONS: { value: MetricKey; label: string }[] = [
  { value: 'spend', label: 'Gasto ($)' },
  { value: 'ctr', label: 'CTR (%)' },
  { value: 'cpc', label: 'CPC ($)' },
  { value: 'cpa', label: 'CPA ($)' },
  { value: 'roas', label: 'ROAS (x)' },
  { value: 'impressions', label: 'Impresiones' },
  { value: 'clicks', label: 'Clicks' },
  { value: 'conversions', label: 'Conversiones' },
]

interface MetricsChartProps {
  data: CampaignMetrics[]
  loading?: boolean
  title?: string
}

export const MetricsChart = ({ data, loading, title = 'Rendimiento' }: MetricsChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('spend')
  const theme = useAppSelector((s) => s.ui.theme)
  const isDark = theme === 'dark'

  const kpiConf = KPI_CONFIG.find((k) => k.key === selectedMetric)

  const chartData = [...data]
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
    .map((d) => ({
      date: dayjs(d.date).format('MMM D'),
      value: d[selectedMetric] ?? 0,
    }))

  const axisStyle = { fill: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }
  const gridColor = isDark ? '#2D3748' : '#E8EAF0'

  return (
    <Card
      loading={loading}
      style={{ borderRadius: 12 }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>{title}</Text>
          <Select
            value={selectedMetric}
            onChange={setSelectedMetric}
            options={METRIC_OPTIONS}
            size="small"
            style={{ width: 160 }}
          />
        </div>
      }
    >
      {chartData.length === 0 ? (
        <Empty description="Sin datos para el período seleccionado" style={{ padding: '40px 0' }} />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                kpiConf ? formatKPI(v, kpiConf.format) : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                background: isDark ? '#1A1A2E' : '#FFFFFF',
                border: `1px solid ${isDark ? '#2D3748' : '#E8EAF0'}`,
                borderRadius: 8,
                fontSize: 13,
              }}
              formatter={(v: number) =>
                kpiConf ? [formatKPI(v, kpiConf.format), kpiConf.label] : [v, selectedMetric]
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={kpiConf?.label || selectedMetric}
              stroke="#6366F1"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#6366F1' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
