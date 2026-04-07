import { Row, Col, Card, Typography, Button, Table, Tag, Modal, Form, Input, InputNumber, Switch, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { productService } from '../services/products'
import type { Product } from '../types/product.types'
import { formatCurrency, formatPercent } from '../utils/formatters'

const { Title, Text } = Typography

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      const res = await productService.getAll()
      setProducts(res.results)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (values: Partial<Product>) => {
    try {
      if (editing) {
        await productService.update(editing.id, values)
        message.success('Producto actualizado')
      } else {
        await productService.create(values)
        message.success('Producto creado')
      }
      setModalOpen(false)
      form.resetFields()
      setEditing(null)
      load()
    } catch {
      message.error('Error al guardar')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id)
      message.success('Producto eliminado')
      load()
    } catch {
      message.error('Error al eliminar')
    }
  }

  const columns = [
    { title: 'Nombre', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Categoría', dataIndex: 'category', key: 'category', render: (v: string | null) => v || '—' },
    { title: 'Target CPA', dataIndex: 'target_cpa', key: 'target_cpa', render: (v: number | null) => formatCurrency(v) },
    { title: 'Target ROAS', dataIndex: 'target_roas', key: 'target_roas', render: (v: number | null) => v ? `${v}x` : '—' },
    { title: 'Target CTR', dataIndex: 'target_ctr', key: 'target_ctr', render: (v: number | null) => formatPercent(v) },
    {
      title: 'Estado', dataIndex: 'is_active', key: 'is_active',
      render: (v: boolean) => <Tag color={v ? 'success' : 'default'}>{v ? 'Activo' : 'Inactivo'}</Tag>
    },
    {
      title: 'Acciones', key: 'actions',
      render: (_: unknown, record: Product) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="text" icon={<EditOutlined />} size="small"
            onClick={() => { setEditing(record); form.setFieldsValue(record); setModalOpen(true) }}
          />
          <Button
            type="text" icon={<DeleteOutlined />} danger size="small"
            onClick={() => Modal.confirm({ title: '¿Eliminar producto?', onOk: () => handleDelete(record.id) })}
          />
        </div>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Productos</Title>
          <Text type="secondary">{products.length} productos registrados</Text>
        </div>
        <Button
          type="primary" icon={<PlusOutlined />}
          onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true) }}
        >
          Nuevo producto
        </Button>
      </div>

      <Card style={{ borderRadius: 12 }}>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 700 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditing(null) }}
        onOk={() => form.submit()}
        okText="Guardar"
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="category" label="Categoría">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sku" label="SKU">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="landing_url" label="Landing URL">
            <Input placeholder="https://" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="target_cpa" label="Target CPA ($)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="target_roas" label="Target ROAS (x)">
                <InputNumber style={{ width: '100%' }} min={0} step={0.1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="target_ctr" label="Target CTR (%)">
                <InputNumber style={{ width: '100%' }} min={0} max={100} step={0.1} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="is_active" label="Activo" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  )
}

export default Products
