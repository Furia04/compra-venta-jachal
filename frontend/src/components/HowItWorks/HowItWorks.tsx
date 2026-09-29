import styles from './HowItWorks.module.css'

const steps = [
  {
    icon: '🔍',
    title: 'Buscá',
    description: 'Encontrá el oficio que necesitás por categoría o búsqueda directa.',
  },
  {
    icon: '👀',
    title: 'Compará',
    description: 'Revisá perfiles, puntuaciones y trabajos anteriores de cada profesional.',
  },
  {
    icon: '💬',
    title: 'Contactá',
    description: 'Comunicate directamente por WhatsApp o teléfono, sin intermediarios.',
  },
  {
    icon: '⭐',
    title: 'Calificá',
    description: 'Dejá tu opinión para ayudar a otros vecinos a elegir mejor.',
  },
]

function HowItWorks() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Cómo funciona OficiosYa</h2>
      <div className={styles.grid}>
        {steps.map((step) => (
          <div key={step.title} className={styles.step}>
            <span className={styles.icon} aria-hidden="true">
              {step.icon}
            </span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks