import { useParams, Link } from 'react-router-dom'
import { mockCategories } from '../data/mockCategories'
import { mockWorkers } from '../data/mockWorkers'
import { getTopWorkers } from '../utils/ranking'
import WorkerCard from '../components/WorkerCard/WorkerCard'
import NotFound from './NotFound'
import styles from './CategoryPage.module.css'

function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const category = mockCategories.find((c) => c.id === id)

  if (!category) {
    return <NotFound />
  }

  const matchingWorkers = mockWorkers.filter((worker) =>
    worker.categoryIds.includes(category.id)
  )
  const rankedResults = getTopWorkers(matchingWorkers, matchingWorkers.length)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          {category.icon}
        </span>
        <h1 className={styles.title}>{category.name}</h1>
      </div>

      {rankedResults.length === 0 ? (
        <p className={styles.emptyState}>
          No encontramos trabajadores para los filtros seleccionados.
        </p>
      ) : (
        <div className={styles.grid}>
          {rankedResults.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}

      <Link to="/buscar" className={styles.link}>
        Ver todas las categorías y trabajadores →
      </Link>
    </div>
  )
}

export default CategoryPage