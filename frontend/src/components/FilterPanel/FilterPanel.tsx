import { mockCategories } from '../../data/mockCategories'
import styles from './FilterPanel.module.css'

export interface Filters {
  categoryId: string
  zone: string
  minRating: number
}

interface FilterPanelProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const ZONES = ['Todas', 'Jáchal Centro', 'Zonas rurales', 'Otras']
const MIN_RATINGS = [0, 3, 4, 4.5]

function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function handleCategoryChange(categoryId: string) {
    onChange({ ...filters, categoryId })
  }

  function handleZoneChange(zone: string) {
    onChange({ ...filters, zone })
  }

  function handleMinRatingChange(minRating: number) {
    onChange({ ...filters, minRating })
  }

  return (
    <div className={styles.panel}>
      <div className={styles.field}>
        <label htmlFor="filter-department" className={styles.label}>
          Departamento
        </label>
        <select id="filter-department" className={styles.select} value="Jáchal" disabled>
          <option value="Jáchal">Jáchal</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-category" className={styles.label}>
          Categoría
        </label>
        <select
          id="filter-category"
          className={styles.select}
          value={filters.categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">Todas</option>
          {mockCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-zone" className={styles.label}>
          Zona
        </label>
        <select
          id="filter-zone"
          className={styles.select}
          value={filters.zone}
          onChange={(e) => handleZoneChange(e.target.value)}
        >
          {ZONES.map((zone) => (
            <option key={zone} value={zone === 'Todas' ? '' : zone}>
              {zone}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="filter-rating" className={styles.label}>
          Puntuación mínima
        </label>
        <select
          id="filter-rating"
          className={styles.select}
          value={filters.minRating}
          onChange={(e) => handleMinRatingChange(Number(e.target.value))}
        >
          {MIN_RATINGS.map((rating) => (
            <option key={rating} value={rating}>
              {rating === 0 ? 'Todas' : `${rating} estrellas o más`}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default FilterPanel