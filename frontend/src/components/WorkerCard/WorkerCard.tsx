import { Link } from 'react-router-dom'
import type { Worker } from '../../types/worker'
import { mockCategories } from '../../data/mockCategories'
import RatingStars from '../RatingStars/RatingStars'
import PremiumBadge from '../PremiumBadge/PremiumBadge'
import { isExcellentByReviews } from '../../utils/ranking'
import styles from './WorkerCard.module.css'

interface WorkerCardProps {
  worker: Worker
}

function WorkerCard({ worker }: WorkerCardProps) {
  const mainCategory = mockCategories.find((c) => c.id === worker.categoryIds[0])
  const isPremium = worker.premiumStatus === 'premium'
  const isExcellent = isExcellentByReviews(worker)

  let badgeVariant: 'premium' | 'featured' | 'golden' | null = null
  if (isPremium && isExcellent) badgeVariant = 'golden'
  else if (isPremium) badgeVariant = 'premium'
  else if (isExcellent) badgeVariant = 'featured'

  return (
    <article className={styles.card}>
      <img
        src={worker.photoUrl}
        alt={`Foto de ${worker.firstName} ${worker.lastName}`}
        className={styles.photo}
      />
      {badgeVariant && (
        <div className={styles.badgeWrapper}>
          <PremiumBadge variant={badgeVariant} />
        </div>
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>
          {worker.firstName} {worker.lastName}
        </h3>
        <p className={styles.category}>{mainCategory?.name}</p>
        <RatingStars
          averageRating={worker.averageRating}
          reviewCount={worker.reviewCount}
        />
        <Link to={`/trabajador/${worker.id}`} className={styles.button}>
          Ver perfil
        </Link>
      </div>
    </article>
  )
}

export default WorkerCard