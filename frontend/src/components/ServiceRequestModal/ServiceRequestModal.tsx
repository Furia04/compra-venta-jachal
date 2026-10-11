import React, { useState } from 'react'
import { X, Send, CheckCircle2 } from 'lucide-react'
import type { Worker } from '../../types/worker'
import { mockCategories } from '../../data/mockCategories'
import { submitServiceRequest } from '../../services/providersService'
import styles from './ServiceRequestModal.module.css'

interface ServiceRequestModalProps {
  isOpen: boolean
  onClose: () => void
  worker?: Worker
}

export default function ServiceRequestModal({ isOpen, onClose, worker }: ServiceRequestModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    category: worker?.categoryIds[0] ? (mockCategories.find(c => c.id === worker.categoryIds[0])?.name || 'General') : 'Electricidad',
    title: '',
    description: '',
    location: 'San José de Jáchal',
    urgency: 'media' as 'baja' | 'media' | 'alta',
    preferredDate: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitServiceRequest({
        workerId: worker?.id,
        workerName: worker ? `${worker.firstName} ${worker.lastName}` : undefined,
        ...formData
      })
      setIsSuccess(true)
    } catch (err) {
      console.error('Error submitting request:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetAndClose = () => {
    setIsSuccess(false)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleResetAndClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>
              {worker ? `Solicitar servicio a ${worker.firstName}` : 'Solicitud de Presupuesto'}
            </h3>
            <p className={styles.subtitle}>
              {worker ? 'Describe lo que necesitas y el prestador se pondrá en contacto.' : 'Completa los detalles de tu necesidad.'}
            </p>
          </div>
          <button className={styles.closeButton} onClick={handleResetAndClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              <CheckCircle2 size={40} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)' }}>
              ¡Solicitud Enviada con Éxito!
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '380px' }}>
              Tu solicitud para <strong>{formData.title}</strong> fue registrada. 
              {worker 
                ? ` ${worker.firstName} recibirá la notificación para coordinar contigo a la brevedad.`
                : ' Los profesionales de la zona podrán revisar tu requerimiento.'}
            </p>
            {worker?.whatsapp && (
              <a
                href={`https://wa.me/${worker.whatsapp}?text=${encodeURIComponent(
                  `Hola ${worker.firstName}, te envié una solicitud desde OficiosYa sobre: ${formData.title}. Descripción: ${formData.description}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#25D366',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                💬 Abrir chat directo en WhatsApp
              </a>
            )}
            <button className={styles.btnCancel} onClick={handleResetAndClose} style={{ marginTop: '8px' }}>
              Cerrar ventana
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Título o resumen del trabajo *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="Ej: Arreglo de toma corriente y térmicas"
                value={formData.title}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción detallada *</label>
              <textarea
                name="description"
                required
                placeholder="Explica qué problema tienes, materiales requeridos o detalles específicos..."
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
              />
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tu Nombre y Apellido *</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  placeholder="Ej: Roberto Pérez"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Teléfono / WhatsApp de contacto *</label>
                <input
                  type="tel"
                  name="clientPhone"
                  required
                  placeholder="Ej: 264 5112233"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Zona / Barrio en Jáchal</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="San José de Jáchal (Centro)">San José de Jáchal (Centro)</option>
                  <option value="Villa Mercedes">Villa Mercedes</option>
                  <option value="Niquivil">Niquivil</option>
                  <option value="Huaco">Huaco</option>
                  <option value="Pampa Vieja">Pampa Vieja</option>
                  <option value="Gran China">Gran China</option>
                  <option value="La Falda">La Falda</option>
                  <option value="Otra localidad rural">Otra localidad rural</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Urgencia</label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="baja">Baja (Dentro de la semana)</option>
                  <option value="media">Media (Próximos 2 a 3 días)</option>
                  <option value="alta">🚨 Alta / Urgente (Hoy o 24hs)</option>
                </select>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.btnCancel} onClick={handleResetAndClose}>
                Cancelar
              </button>
              <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
                <Send size={16} />
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
