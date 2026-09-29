import styles from './PremiumBadge.module.css'

interface PremiumBadgeProps {
  variant: 'premium' | 'featured' | 'golden'
}

const LABELS = {
  premium: 'PREMIUM',
  featured: 'DESTACADO',
  golden: 'PREMIUM DESTACADO',
}

function PremiumBadge({ variant }: PremiumBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {LABELS[variant]}
    </span>
  )
}

export default PremiumBadge