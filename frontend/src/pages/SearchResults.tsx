import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProviders } from '../services/providersService'
import type { Worker } from '../types/worker'
import { mockCategories } from '../data/mockCategories'
import { normalizeText } from '../utils/normalizeText'
import { getTopWorkers } from '../utils/ranking'
import WorkerCard from '../components/WorkerCard/WorkerCard'
import FilterPanel, { type Filters } from '../components/FilterPanel/FilterPanel'
import styles from './SearchResults.module.css'

const INITIAL_FILTERS: Filters = {
  categoryId: '',
  zone: '',
  minRating: 0,
}

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const normalizedQuery = normalizeText(query)
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getProviders()
        setWorkers(data)
      } catch (err) {
        console.error('Error loading providers:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const matchingCategoryIds = mockCategories
    .filter((category) => normalizeText(category.name).includes(normalizedQuery))
    .map((category) => category.id)

  const searchFilteredWorkers = workers.filter((worker) => {
    if (normalizedQuery === '') return true
    const fullName = normalizeText(`${worker.firstName} ${worker.lastName}`)
    const matchesName = fullName.includes(normalizedQuery)
    const matchesCategory = worker.categoryIds.some((id) =>
      matchingCategoryIds.includes(id)
    )
    return matchesName || matchesCategory
  })

  const finalResults = searchFilteredWorkers.filter((worker) => {
    const matchesCategory =
      filters.categoryId === '' || worker.categoryIds.includes(filters.categoryId)
    const matchesZone = filters.zone === '' || worker.zone === filters.zone
    const matchesRating = worker.averageRating >= filters.minRating
    return matchesCategory && matchesZone && matchesRating
  })

  const rankedResults = getTopWorkers(finalResults, finalResults.length)

  function handleFiltersChange(nextFilters: Filters) {
    const changedCategory = nextFilters.categoryId !== filters.categoryId
    const conflictsWithCategorySearch =
      matchingCategoryIds.length > 0 &&
      !matchingCategoryIds.includes(nextFilters.categoryId)

    if (changedCategory && conflictsWithCategorySearch) {
      setSearchParams((currentParams) => {
        const updatedParams = new URLSearchParams(currentParams)
        updatedParams.delete('q')
        return updatedParams
      })
    }

    setFilters(nextFilters)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        {query ? (
          <>
            Resultados para: <span className={styles.query}>"{query}"</span>
          </>
        ) : (
          'Todos los profesionales'
        )}
      </h1>

      <FilterPanel filters={filters} onChange={handleFiltersChange} />

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
          Cargando profesionales...
        </p>
      ) : rankedResults.length === 0 ? (
        <p className={styles.emptyState}>
          No encontramos profesionales para los filtros seleccionados.
        </p>
      ) : (
        <div className={styles.grid}>
          {rankedResults.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults