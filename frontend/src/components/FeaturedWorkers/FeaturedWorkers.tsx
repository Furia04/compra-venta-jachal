import { mockWorkers } from '../../data/mockWorkers'
import { getTopWorkers } from '../../utils/ranking'
import WorkerCard from '../WorkerCard/WorkerCard'
import styles from './FeaturedWorkers.module.css'

const MAX_FEATURED = 8

export function FeaturedWorkers() {
  const featured = getTopWorkers(mockWorkers, MAX_FEATURED)

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Oficios destacados</h2>
      <div className={styles.grid}>
        {featured.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </section>
  )
}

