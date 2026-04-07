import { Row, Col, Typography, Input, Select, Button, Spin, Empty, Pagination } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCampaigns, syncCampaign } from '../store/slices/campaignsSlice'
import { CampaignCard } from '../components/CampaignCard/CampaignCard'
import type { CampaignStatus } from '../types/campaign.types'

const { Title, Text } = Typography

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'PAUSED', label: 'Pausadas' },
  { value: 'ARCHIVED', label: 'Archivadas' },
]

const Campaigns = () => {
  const dispatch = useAppDispatch()
  const { items, loading, total } = useAppSelector((s) => s.campaigns)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<CampaignStatus | ''>('')
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    const params: Record<string, string> = {}
    if (status) params.status = status
    if (search) params.search = search
    params.page = String(page)
    dispatch(fetchCampaigns(params))
  }, [dispatch, status, search, page])

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Campañas</Title>
          <Text type="secondary">{total} campañas en total</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Nueva campaña
        </Button>
      </div>

      {/* Filters */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={14} md={16}>
          <Input
            placeholder="Buscar por nombre o ID de Meta..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            allowClear
          />
        </Col>
        <Col xs={24} sm={10} md={8}>
          <Select
            value={status}
            onChange={(v) => { setStatus(v); setPage(1) }}
            options={STATUS_OPTIONS}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : items.length === 0 ? (
        <Empty description="No se encontraron campañas" style={{ padding: 80 }} />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {items.map((campaign) => (
              <Col xs={24} sm={12} xl={8} key={campaign.id}>
                <CampaignCard
                  campaign={campaign}
                  onSync={(id) => dispatch(syncCampaign(id))}
                />
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Campaigns
