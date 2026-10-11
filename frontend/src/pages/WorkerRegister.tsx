import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  User, 
  MapPin, 
  Wrench, 
  FileText, 
  Image as ImageIcon, 
  ChevronLeft, 
  Clock, 
  Award,
  Sparkles
} from 'lucide-react'
import { mockCategories } from '../data/mockCategories'
import { registerWorker } from '../services/providersService'
import RatingStars from '../components/RatingStars/RatingStars'
import styles from './WorkerRegister.module.css'

export default function WorkerRegister() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    whatsapp: '',
    department: 'San José de Jáchal',
    zone: 'Jáchal Centro',
    categoryIds: ['cat-01'],
    yearsOfExperience: 3,
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=300',
    schedulesDays: 'Lunes a viernes',
    schedulesHours: '08:00 - 18:00'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryToggle = (catId: string) => {
    setFormData(prev => {
      const exists = prev.categoryIds.includes(catId)
      let updated: string[]
      if (exists) {
        if (prev.categoryIds.length === 1) return prev // Al menos 1 categoría
        updated = prev.categoryIds.filter(id => id !== catId)
      } else {
        updated = [...prev.categoryIds, catId]
      }
      return { ...prev, categoryIds: updated }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const cleanPhone = formData.phone.replace(/\D/g, '')
      const cleanWhatsapp = (formData.whatsapp || formData.phone).replace(/\D/g, '')
      const fullWhatsapp = cleanWhatsapp.startsWith('549') ? cleanWhatsapp : `549${cleanWhatsapp}`

      const newWorker = await registerWorker({
        firstName: formData.firstName,
        lastName: formData.lastName,
        photoUrl: formData.photoUrl,
        categoryIds: formData.categoryIds,
        description: formData.description || `Profesional con ${formData.yearsOfExperience} años de experiencia en ${formData.zone}.`,
        phone: cleanPhone,
        whatsapp: fullWhatsapp,
        department: formData.department,
        zone: formData.zone,
        coverage: 'centro',
        schedules: [
          { days: formData.schedulesDays, hours: formData.schedulesHours }
        ],
        yearsOfExperience: Number(formData.yearsOfExperience) || 1,
        workPhotos: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400'
        ]
      })

      // Redirigir al nuevo perfil
      navigate(`/trabajador/${newWorker.id}`)
    } catch (err) {
      console.error('Error registrando trabajador:', err)
      setIsSubmitting(false)
    }
  }

  const mainCat = mockCategories.find(c => c.id === formData.categoryIds[0])

  return (
    <main className={styles.container}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
        <ChevronLeft size={18} /> Volver a OficiosYa
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Registrate como Profesional</h1>
        <p className={styles.subtitle}>
          Sumate al directorio oficial de oficios de Jáchal y conecta directamente con cientos de vecinos que buscan tus servicios a diario.
        </p>
      </div>

      <div className={styles.layoutGrid}>
        {/* Formulario */}
        <div className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Sección 1: Datos Personales */}
            <div>
              <h2 className={styles.sectionTitle}>
                <User size={18} /> Datos de Contacto
              </h2>
              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Ej: Carlos"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Apellido *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Ej: Gómez"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.grid2} style={{ marginTop: '12px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Teléfono de Llamadas *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Ej: 264 5123456"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>WhatsApp (para mensajes)</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="Ej: 264 5123456"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Especialidad y Categorías */}
            <div>
              <h2 className={styles.sectionTitle}>
                <Wrench size={18} /> Oficio y Especialidad
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                Selecciona uno o más oficios que ejerces:
              </p>
              <div className={styles.categoriesGrid}>
                {mockCategories.map(cat => {
                  const isChecked = formData.categoryIds.includes(cat.id)
                  return (
                    <label
                      key={cat.id}
                      className={`${styles.categoryChip} ${isChecked ? styles.categoryChipSelected : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCategoryToggle(cat.id)}
                      />
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </label>
                  )
                })}
              </div>

              <div className={styles.grid2} style={{ marginTop: '16px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Zona / Localidad en Jáchal *</label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="Jáchal Centro">Jáchal Centro</option>
                    <option value="Villa Mercedes">Villa Mercedes</option>
                    <option value="Niquivil">Niquivil</option>
                    <option value="Huaco">Huaco</option>
                    <option value="Pampa Vieja">Pampa Vieja</option>
                    <option value="Gran China">Gran China</option>
                    <option value="La Falda">La Falda</option>
                    <option value="Zonas rurales">Zonas rurales y alrededores</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Años de Experiencia *</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    min="1"
                    max="50"
                    required
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Biografía y Horarios */}
            <div>
              <h2 className={styles.sectionTitle}>
                <FileText size={18} /> Descripción y Horarios
              </h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Presentación profesional *</label>
                <textarea
                  name="description"
                  required
                  placeholder="Cuenta sobre tu experiencia, tipo de trabajos que realizas, si das presupuesto sin cargo, etc."
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.grid2} style={{ marginTop: '12px' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Días de atención</label>
                  <input
                    type="text"
                    name="schedulesDays"
                    placeholder="Ej: Lunes a viernes"
                    value={formData.schedulesDays}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Horarios habituales</label>
                  <input
                    type="text"
                    name="schedulesHours"
                    placeholder="Ej: 08:00 - 18:00"
                    value={formData.schedulesHours}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            {/* Sección 4: Foto de Perfil */}
            <div>
              <h2 className={styles.sectionTitle}>
                <ImageIcon size={18} /> Foto de Perfil
              </h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Enlace a imagen / avatar</label>
                <input
                  type="url"
                  name="photoUrl"
                  placeholder="https://..."
                  value={formData.photoUrl}
                  onChange={handleChange}
                  className={styles.input}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Puedes usar la imagen predeterminada o pegar el enlace de tu foto.
                </span>
              </div>
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={isSubmitting}>
              <Sparkles size={18} />
              {isSubmitting ? 'Creando perfil...' : 'Publicar mi Perfil en OficiosYa'}
            </button>
          </form>
        </div>

        {/* Vista previa en tiempo real */}
        <aside className={styles.previewWrapper}>
          <div className={styles.previewTitle}>👁️ Vista Previa en Vivo</div>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <img
                src={formData.photoUrl || 'https://i.pravatar.cc/300?img=12'}
                alt="Vista previa"
                className={styles.previewPhoto}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.pravatar.cc/300?img=12'
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text)', fontWeight: 700 }}>
                  {formData.firstName || 'Nombre'} {formData.lastName || 'Apellido'}
                </h3>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(27, 73, 101, 0.1)',
                  color: 'var(--color-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  marginTop: '4px'
                }}>
                  {mainCat?.icon} {mainCat?.name || 'Profesional'}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem' }}>
              <RatingStars averageRating={5.0} reviewCount={1} />
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.4, margin: 0 }}>
              {formData.description || 'Aquí aparecerá la descripción de tus servicios profesionales y trayectoria.'}
            </p>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                <span>{formData.zone}, San José de Jáchal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--color-accent)' }} />
                <span>{formData.schedulesDays} ({formData.schedulesHours})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} style={{ color: 'var(--color-success)' }} />
                <span>{formData.yearsOfExperience} años de experiencia</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
