import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Award, 
  Phone, 
  MessageCircle, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon,
  Star,
  Heart,
  Share2
} from 'lucide-react'
import type { Worker } from '../types/worker'
import type { Rating } from '../types/rating'
import { mockCategories } from '../data/mockCategories'
import { getProviderById, getRatingsByWorkerId } from '../services/providersService'
import RatingStars from '../components/RatingStars/RatingStars'
import PremiumBadge from '../components/PremiumBadge/PremiumBadge'
import ServiceRequestModal from '../components/ServiceRequestModal/ServiceRequestModal'
import ReviewModal from '../components/ReviewModal/ReviewModal'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import { isExcellentByReviews } from '../utils/ranking'
import styles from './WorkerDetail.module.css'

export default function WorkerDetail() {
  const { id } = useParams<{ id: string }>()
  const [worker, setWorker] = useState<Worker | null>(null)
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  const { isWorkerFavorite, toggleWorkerFavorite } = useFavorites()
  const { showSuccess } = useToast()

  useEffect(() => {
    async function loadWorkerData() {
      if (!id) return
      setLoading(true)
      try {
        const found = await getProviderById(id)
        if (found) {
          setWorker(found)
          const reviews = await getRatingsByWorkerId(found.id)
          setRatings(reviews)
        }
      } catch (err) {
        console.error('Error fetching worker details:', err)
      } finally {
        setLoading(false)
      }
    }

    loadWorkerData()
  }, [id])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.centerState}>
          <p>Cargando información del profesional...</p>
        </div>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className={styles.container}>
        <div className={styles.centerState}>
          <h2 style={{ color: 'var(--color-text)', marginBottom: '10px' }}>Trabajador no encontrado</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            No pudimos encontrar el perfil que estás buscando. Puede haber sido modificado o no existir.
          </p>
          <Link to="/" className={styles.backLink}>
            <ChevronLeft size={18} /> Volver al inicio de OficiosYa
          </Link>
        </div>
      </div>
    )
  }

  const mainCategory = mockCategories.find((c) => c.id === worker.categoryIds[0])
  const otherCategories = worker.categoryIds.slice(1).map(cid => mockCategories.find(c => c.id === cid)?.name).filter(Boolean)
  
  const isPremium = worker.premiumStatus === 'premium'
  const isExcellent = isExcellentByReviews(worker)

  let badgeVariant: 'premium' | 'featured' | 'golden' | null = null
  if (isPremium && isExcellent) badgeVariant = 'golden'
  else if (isPremium) badgeVariant = 'premium'
  else if (isExcellent) badgeVariant = 'featured'

  const whatsappMessage = encodeURIComponent(
    `Hola ${worker.firstName}, te contacto desde la plataforma OficiosYa de Jáchal para consultar sobre tus servicios de ${mainCategory?.name || 'profesional'}.`
  )

  const isFav = isWorkerFavorite(worker.id)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${worker.firstName} ${worker.lastName} - ${mainCategory?.name || 'OficiosYa'}`,
          text: `Mirá el perfil de ${worker.firstName} ${worker.lastName} (${mainCategory?.name}) en OficiosYa Jáchal:`,
          url,
        })
      } catch {
        // Cancelado por el usuario
      }
    } else {
      navigator.clipboard.writeText(url)
      showSuccess('¡Enlace del perfil copiado al portapapeles!')
    }
  }

  const handleReviewSuccess = (newRating: Rating, updatedWorker?: Worker) => {
    setRatings(prev => [newRating, ...prev])
    if (updatedWorker) {
      setWorker(updatedWorker)
    } else {
      setWorker(prev => prev ? {
        ...prev,
        reviewCount: (prev.reviewCount || 0) + 1,
        averageRating: Number((((prev.averageRating || 5) * (prev.reviewCount || 1) + newRating.score) / ((prev.reviewCount || 1) + 1)).toFixed(1))
      } : null)
    }
    showSuccess('¡Muchas gracias! Tu opinión ha sido publicada.')
  }

  return (
    <main className={styles.container}>
      {/* Botón Volver y Acciones Superiores */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className={styles.backLink}>
          <ChevronLeft size={18} /> Volver al directorio de oficios
        </Link>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => toggleWorkerFavorite(worker)}
            className={`${styles.btnFav} ${isFav ? styles.btnFavActive : ''}`}
            aria-label="Guardar en favoritos"
            title={isFav ? 'Quitar de guardados' : 'Guardar en favoritos'}
          >
            <Heart size={16} className={isFav ? 'fill-current' : ''} />
            <span>{isFav ? 'Guardado' : 'Guardar'}</span>
          </button>

          <button
            onClick={handleShare}
            className={styles.btnShare}
            title="Compartir o copiar enlace"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>

      {/* Tarjeta Principal de Perfil */}
      <section className={styles.headerCard}>
        <div className={styles.profileTop}>
          <div className={styles.photoWrapper}>
            <img
              src={worker.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={`${worker.firstName} ${worker.lastName}`}
              className={styles.photo}
            />
            {badgeVariant && (
              <div className={styles.badgePosition}>
                <PremiumBadge variant={badgeVariant} />
              </div>
            )}
          </div>

          <div className={styles.profileInfo}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>
                {worker.firstName} {worker.lastName}
              </h1>
              {isPremium && (
                <span title="Prestador verificado" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center' }}>
                  <ShieldCheck size={20} />
                </span>
              )}
            </div>

            <div className={styles.categoryTag}>
              {mainCategory?.icon} {mainCategory?.name || 'Servicio Profesional'}
            </div>

            <div style={{ marginTop: '4px' }}>
              <RatingStars
                averageRating={worker.averageRating}
                reviewCount={worker.reviewCount}
              />
            </div>

            <div className={styles.quickDetails}>
              <span className={styles.detailItem}>
                <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
                {worker.zone || 'Jáchal Centro'}, {worker.department || 'San José de Jáchal'}
              </span>
              <span className={styles.detailItem}>
                <Award size={16} style={{ color: 'var(--color-accent)' }} />
                {worker.yearsOfExperience} años de experiencia
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Acciones / Contacto */}
        <div className={styles.actionsBar}>
          <a
            href={`https://wa.me/${worker.whatsapp || worker.phone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsapp}
          >
            <MessageCircle size={18} />
            Contactar por WhatsApp
          </a>

          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.btnRequest}
          >
            <Calendar size={18} />
            Solicitar Presupuesto
          </button>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className={styles.btnReview}
            title="Calificar a este profesional"
          >
            <Star size={18} />
            Calificar
          </button>

          {worker.phone && (
            <a href={`tel:${worker.phone}`} className={styles.btnCall} title="Llamar directamente">
              <Phone size={18} />
              Llamar
            </a>
          )}
        </div>
      </section>

      {/* Grid con detalles y contenido */}
      <div className={styles.contentGrid}>
        {/* Columna Principal */}
        <div className={styles.mainCol}>
          {/* Biografía y Servicios */}
          <section className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>
              <FileText size={18} />
              Sobre el Profesional y Servicios
            </h2>
            <p className={styles.bioText}>
              {worker.description || 'Profesional comprometido con la calidad y la puntualidad en cada trabajo realizado en la zona de Jáchal.'}
            </p>

            {otherCategories.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  Otros oficios y especialidades:
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {otherCategories.map((name, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--color-text)'
                    }}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Fotos de Trabajos Realizados */}
          <section className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>
              <ImageIcon size={18} />
              Galería de Trabajos Realizados
            </h2>
            {worker.workPhotos && worker.workPhotos.length > 0 ? (
              <div className={styles.photosGrid}>
                {worker.workPhotos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Trabajo realizado ${index + 1}`}
                    className={styles.workPhoto}
                  />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                El prestador aún no ha subido fotos a su galería.
              </p>
            )}
          </section>

          {/* Calificaciones y Reseñas */}
          <section className={styles.cardSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                <Star size={18} style={{ color: 'var(--color-golden)' }} />
                Reseñas de Vecinos ({ratings.length})
              </h2>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-accent)',
                  color: 'var(--color-accent)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ★ Dejar mi opinión
              </button>
            </div>

            {ratings.length > 0 ? (
              <div className={styles.reviewsList}>
                {ratings.map((r) => (
                  <div key={r.id} className={styles.reviewItem}>
                    <div className={styles.reviewTop}>
                      <span className={styles.reviewerName}>{r.clientName}</span>
                      <span className={styles.reviewDate}>
                        {new Date(r.createdAt).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#E8A93A', fontSize: '0.85rem' }}>
                        {'★'.repeat(r.score)}{'☆'.repeat(5 - r.score)}
                      </span>
                    </div>
                    {r.comment && (
                      <p className={styles.reviewComment}>{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>
                  Aún no hay opiniones registradas para este profesional.
                </p>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Sé el primero en calificar
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Columna Lateral: Horarios y Cobertura */}
        <aside className={styles.sideCol}>
          {/* Horarios de Atención */}
          <div className={styles.cardSection}>
            <h3 className={styles.sectionTitle} style={{ fontSize: '1rem' }}>
              <Clock size={16} />
              Horarios de Atención
            </h3>
            {worker.schedules && worker.schedules.length > 0 ? (
              <div className={styles.scheduleList}>
                {worker.schedules.map((s, idx) => (
                  <div key={idx} className={styles.scheduleItem}>
                    <span className={styles.scheduleDays}>{s.days}</span>
                    <span className={styles.scheduleHours}>{s.hours}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Lunes a Viernes: 08:00 a 18:00 hs.
              </p>
            )}
          </div>

          {/* Zona de Cobertura */}
          <div className={styles.cardSection}>
            <h3 className={styles.sectionTitle} style={{ fontSize: '1rem' }}>
              <MapPin size={16} />
              Zona de Cobertura
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
              Atención en <strong>{worker.zone || 'Jáchal Centro'}</strong> y alrededores (San José, Villa Mercedes, Niquivil y zonas rurales con coordinación previa).
            </p>
          </div>

          {/* Garantía Comunitaria */}
          <div className={styles.cardSection} style={{ backgroundColor: 'rgba(27, 73, 101, 0.05)', borderColor: 'rgba(27, 73, 101, 0.2)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ShieldCheck size={16} /> Compromiso OficiosYa
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Fomentamos la transparencia y el trabajo de confianza en la comunidad de Jáchal. Recuerda calificar al profesional una vez finalizado el trabajo.
            </p>
          </div>
        </aside>
      </div>

      {/* Modal de Solicitud de Servicio */}
      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        worker={worker}
      />

      {/* Modal de Calificación y Reseñas */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        worker={worker}
        onSuccess={handleReviewSuccess}
      />
    </main>
  )
}
