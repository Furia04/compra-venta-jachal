import { mockCategories } from '../../data/mockCategories'
import CategoryCard from '../CategoryCard/CategoryCard'
import styles from './CategoryList.module.css'

function CategoryList() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Categorías de oficios</h2>
      <div className={styles.grid}>
        {mockCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}

export default CategoryList