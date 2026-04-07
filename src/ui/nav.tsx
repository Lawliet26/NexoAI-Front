import { Menu } from 'antd'
import {
  DashboardOutlined,
  FundProjectionScreenOutlined,
  ShopOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../config/routes'

const menuItems = [
  { key: ROUTES.DASHBOARD, icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: ROUTES.CAMPAIGNS, icon: <FundProjectionScreenOutlined />, label: 'Campañas' },
  { key: ROUTES.PRODUCTS, icon: <ShopOutlined />, label: 'Productos' },
  { key: ROUTES.AB_TESTING, icon: <ExperimentOutlined />, label: 'A/B Testing' },
  { key: ROUTES.ANALYTICS, icon: <BarChartOutlined />, label: 'Analytics' },
  { key: ROUTES.AI_INSIGHTS, icon: <BulbOutlined />, label: 'AI Insights' },
]

export const Nav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      style={{ border: 'none', background: 'transparent' }}
    />
  )
}
