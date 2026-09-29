import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { mockWorkers } from '../data/mockWorkers'
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

  const matchingCategoryIds = mockCategories
    .filter((category) => normalizeText(category.name).includes(normalizedQuery))
    .map((category) => category.id)

  const searchFilteredWorkers = mockWorkers.filter((worker) => {
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
          'Todos los trabajadores'
        )}
      </h1>

      <FilterPanel filters={filters} onChange={handleFiltersChange} />

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
    </div>
  )
}

export default SearchResults