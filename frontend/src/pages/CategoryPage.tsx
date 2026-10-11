import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mockCategories } from '../data/mockCategories'
import { getProviders } from '../services/providersService'
import type { Worker } from '../types/worker'
import { getTopWorkers } from '../utils/ranking'
import WorkerCard from '../components/WorkerCard/WorkerCard'
import NotFound from './NotFound'
import styles from './CategoryPage.module.css'

function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  const category = mockCategories.find((c) => c.id === id || c.slug === id)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getProviders()
        setWorkers(data)
      } catch (err) {
        console.error('Error loading workers:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (!category) {
    return <NotFound />
  }

  const matchingWorkers = workers.filter((worker) =>
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

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
          Cargando profesionales...
        </p>
      ) : rankedResults.length === 0 ? (
        <p className={styles.emptyState}>
          No encontramos trabajadores registrados para esta categoría todavía.
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