import styles from './RatingStars.module.css'

interface RatingStarsProps {
  averageRating: number
  reviewCount: number
}

const MIN_REVIEWS_TO_SHOW_AVERAGE = 3

function RatingStars({ averageRating, reviewCount }: RatingStarsProps) {
  const hasEnoughReviews = reviewCount >= MIN_REVIEWS_TO_SHOW_AVERAGE

  return (
    <div className={styles.wrapper}>
      {hasEnoughReviews ? (
        <>
          <span className={styles.stars} aria-hidden="true">
            {'⭐'.repeat(Math.round(averageRating))}
          </span>
          <span className={styles.score}>{averageRating.toFixed(1)}</span>
        </>
      ) : (
        <span className={styles.noScore}>Sin puntuación disponible</span>
      )}
      <span className={styles.count}>
        {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
      </span>
    </div>
  )
}

export default RatingStars