import { Row, Col, Typography, Button, Spin, Empty, Select, message } from 'antd'
import { PlusOutlined, FilterOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { abTestService } from '../services/abTests'
import { ABTestCard } from '../components/ABTestCard/ABTestCard'
import type { ABTest, ABTestStatus } from '../types/api.types'

const { Title, Text } = Typography

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'running', label: 'En curso' },
  { value: 'completed', label: 'Completados' },
  { value: 'draft', label: 'Borrador' },
  { value: 'paused', label: 'Pausados' },
]

const ABTesting = () => {
  const [tests, setTests] = useState<ABTest[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<ABTestStatus | ''>('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await abTestService.getAll()
      setTests(res.results)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDeclareWinner = async (testId: string, variantId: string) => {
    try {
      await abTestService.declareWinner(testId, variantId)
      message.success('¡Ganador declarado!')
      load()
    } catch {
      message.error('Error al declarar ganador')
    }
  }

  const filtered = status ? tests.filter((t) => t.status === status) : tests

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>A/B Testing</Title>
          <Text type="secondary">{tests.length} tests registrados</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>Nuevo test</Button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Select
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          prefix={<FilterOutlined />}
          style={{ width: 180 }}
          placeholder="Filtrar estado"
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
      ) : filtered.length === 0 ? (
        <Empty description="No hay tests A/B" style={{ padding: 80 }}>
          <Button type="primary" icon={<PlusOutlined />}>Crear primer test</Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((test) => (
            <Col xs={24} lg={12} key={test.id}>
              <ABTestCard test={test} onDeclareWinner={handleDeclareWinner} />
            </Col>
          ))}
        </Row>
      )}
    </motion.div>
  )
}

export default ABTesting
