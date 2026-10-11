import { useState } from 'react'
import type { FormEvent } from 'react'
import { X, Send } from 'lucide-react'
import type { Worker } from '../../types/worker'
import type { Rating } from '../../types/rating'
import { addWorkerRating } from '../../services/providersService'
import { useAuth } from '../../context/AuthContext'
import styles from './ReviewModal.module.css'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  worker: Worker
  onSuccess: (newRating: Rating, updatedWorker?: Worker) => void
}

const SCORE_LABELS: Record<number, string> = {
  1: '1 estrella - Malo / Insatisfecho',
  2: '2 estrellas - Regular',
  3: '3 estrellas - Bueno / Cumplió',
  4: '4 estrellas - Muy bueno',
  5: '5 estrellas - ¡Excelente trabajo y atención!',
}

export default function ReviewModal({ isOpen, onClose, worker, onSuccess }: ReviewModalProps) {
  const { user } = useAuth()
  const [score, setScore] = useState<number>(5)
  const [hoverScore, setHoverScore] = useState<number>(0)
  const [clientName, setClientName] = useState<string>(user?.name || '')
  const [comment, setComment] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await addWorkerRating(worker.id, {
        clientName: clientName.trim() || 'Vecino de Jáchal',
        score,
        comment: comment.trim()
      })
      onSuccess(result.rating, result.updatedWorker)
      onClose()
    } catch (err) {
      console.error('Error al calificar profesional:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentDisplayScore = hoverScore || score

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Calificar a {worker.firstName} {worker.lastName}</h3>
            <p className={styles.subtitle}>Tu opinión ayuda a otros vecinos a contratar con confianza.</p>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Estrellas Interactivas */}
          <div className={styles.starRatingContainer}>
            <div className={styles.starsRow} onMouseLeave={() => setHoverScore(0)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`${styles.starButton} ${star <= currentDisplayScore ? styles.starActive : ''}`}
                  onMouseEnter={() => setHoverScore(star)}
                  onClick={() => setScore(star)}
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className={styles.scoreLabel}>
              {SCORE_LABELS[currentDisplayScore] || `${currentDisplayScore} estrellas`}
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tu Nombre y Apellido</label>
            <input
              type="text"
              required
              placeholder="Ej: Sofía López"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Comentario u opinión sobre el trabajo *</label>
            <textarea
              required
              placeholder="Contá cómo fue el trabajo realizado, si fue puntual, prolijo y si lo recomendás..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
              <Send size={16} />
              {isSubmitting ? 'Guardando opinión...' : 'Publicar Calificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
