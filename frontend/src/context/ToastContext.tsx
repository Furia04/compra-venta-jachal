import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
  showWarning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const lastToastRef = useState<{ message: string; timestamp: number }>({ message: '', timestamp: 0 })[0]

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const now = Date.now()
    // Si es exactamente el mismo mensaje en menos de 800ms, ignorar el duplicado
    if (lastToastRef.message === message && now - lastToastRef.timestamp < 800) {
      return
    }
    lastToastRef.message = message
    lastToastRef.timestamp = now

    const id = `toast-${now}-${Math.random().toString(36).substring(2, 7)}`
    const newToast: ToastItem = { id, message, type }

    setToasts((prev) => {
      // Evitar tener dos toasts con exactamente el mismo mensaje en pantalla simultáneamente
      const filtered = prev.filter((t) => t.message !== message)
      return [...filtered, newToast]
    })

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3500)
  }, [removeToast, lastToastRef])

  const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast])
  const showError = useCallback((message: string) => showToast(message, 'error'), [showToast])
  const showInfo = useCallback((message: string) => showToast(message, 'info'), [showToast])
  const showWarning = useCallback((message: string) => showToast(message, 'warning'), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      
      {/* Floating Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: '380px',
        width: 'calc(100% - 48px)'
      }}>
        {toasts.map((toast) => {
          let bg = '#1E293B'
          let border = '#334155'
          let IconComponent = Info
          let iconColor = '#38BDF8'

          if (toast.type === 'success') {
            bg = '#064E3B'
            border = '#059669'
            IconComponent = CheckCircle2
            iconColor = '#34D399'
          } else if (toast.type === 'error') {
            bg = '#7F1D1D'
            border = '#DC2626'
            IconComponent = AlertCircle
            iconColor = '#F87171'
          } else if (toast.type === 'warning') {
            bg = '#78350F'
            border = '#D97706'
            IconComponent = AlertTriangle
            iconColor = '#FBBF24'
          }

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                backgroundColor: bg,
                border: `1px solid ${border}`,
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#FFFFFF',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                animation: 'slideInToast 0.25s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconComponent size={18} style={{ color: iconColor, flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Cerrar notificación"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider')
  }
  return context
}
