import { Layout, Avatar, Dropdown, Button, Typography, Badge, Switch, Grid } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  MoonFilled,
  SunFilled,
} from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { Nav } from './nav'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleSidebar, toggleTheme } from '../store/slices/uiSlice'
import { logout } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../config/routes'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid
const { Text } = Typography

export const AppLayout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed)
  const theme = useAppSelector((s) => s.ui.theme)
  const user = useAppSelector((s) => s.auth.user)
  const screens = useBreakpoint()
  const isDark = theme === 'dark'

  const siderWidth = 220

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: user?.email || 'Mi perfil',
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={siderWidth}
        collapsedWidth={screens.xs ? 0 : 64}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
          background: isDark ? '#0A0A14' : '#0F0F1A',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <BulbOutlined style={{ fontSize: 22, color: '#6366F1' }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: '-0.5px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  NexoAI
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <Nav />
      </Sider>

      {/* ── MAIN AREA ────────────────────────────────────────────────── */}
      <Layout
        style={{
          marginLeft: collapsed ? (screens.xs ? 0 : 64) : siderWidth,
          transition: 'margin-left 0.2s',
        }}
      >
        {/* Header */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 99,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#E8EAF0'}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Collapse trigger */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => dispatch(toggleSidebar())}
            style={{ fontSize: 16, width: 40, height: 40 }}
          />

          {/* Right side actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Theme toggle */}
            <Switch
              checked={isDark}
              onChange={() => dispatch(toggleTheme())}
              checkedChildren={<MoonFilled />}
              unCheckedChildren={<SunFilled />}
              style={{ background: isDark ? '#4F46E5' : '#d9d9d9' }}
            />

            {/* Notifications */}
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} style={{ fontSize: 18 }} />
            </Badge>

            {/* User avatar dropdown */}
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                <Avatar
                  src={user?.avatar_url}
                  icon={<UserOutlined />}
                  style={{ background: '#4F46E5' }}
                />
                {screens.sm && (
                  <Text style={{ fontSize: 13 }}>
                    {user?.full_name || user?.email?.split('@')[0]}
                  </Text>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Page content */}
        <Content
          style={{
            padding: screens.xs ? 16 : 24,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  )
}
