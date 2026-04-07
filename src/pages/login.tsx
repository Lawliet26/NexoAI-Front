import { Form, Input, Button, Typography, Alert, Card } from 'antd'
import { UserOutlined, LockOutlined, BulbOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loginThunk, clearError } from '../store/slices/authSlice'
import { ROUTES } from '../config/routes'

const { Title, Text } = Typography

const Login = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth)

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true })
  }, [isAuthenticated, navigate])

  const onFinish = ({ email, password }: { email: string; password: string }) => {
    dispatch(loginThunk({ email, password }))
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <BulbOutlined style={{ fontSize: 48, color: '#6366F1', marginBottom: 12 }} />
          </motion.div>
          <Title level={2} style={{ color: '#FFFFFF', margin: 0, letterSpacing: '-1px' }}>
            NexoAI
          </Title>
          <Text style={{ color: '#94A3B8', fontSize: 15 }}>
            Plataforma de análisis de campañas Meta Ads
          </Text>
        </div>

        <Card
          style={{
            borderRadius: 16,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}
          styles={{ body: { padding: 32 } }}
        >
          <Title level={4} style={{ marginBottom: 24, marginTop: 0, color: '#FFFFFF' }}>
            Iniciar sesión
          </Title>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => dispatch(clearError())}
              style={{ marginBottom: 20, borderRadius: 8 }}
            />
          )}

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Ingresá tu email' },
                { type: 'email', message: 'Email inválido' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
                placeholder="Email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Ingresá tu contraseña' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94A3B8' }} />}
                placeholder="Contraseña"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ height: 44, fontWeight: 600, fontSize: 15 }}
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Text style={{ display: 'block', textAlign: 'center', marginTop: 24, color: '#4A5568', fontSize: 12 }}>
          NexoAI © {new Date().getFullYear()}
        </Text>
      </motion.div>
    </div>
  )
}

export default Login
