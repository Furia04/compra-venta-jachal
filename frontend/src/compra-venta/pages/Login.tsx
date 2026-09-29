import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingBag } from 'lucide-react'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/mercado'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Credenciales inválidas. Verifica tu correo y contraseña.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'var(--spacing-xl) var(--spacing-lg)' }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'var(--color-surface)',
        padding: '2rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <ShoppingBag size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
            Iniciar Sesión
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
            Ingresá a tu cuenta de Jáchal Vende
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                fontSize: '1rem',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1rem',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          ¿No tenés una cuenta?{' '}
          <Link to="/mercado/registro" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Registrate gratis
          </Link>
        </div>
      </div>
    </div>
  )
}
