import { Link } from 'react-router-dom'
import type { Category } from '../../types/Category'
import styles from './CategoryCard.module.css'

interface CategoryCardProps {
  category: Category
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/categoria/${category.id}`} className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        {category.icon}
      </span>
      <span className={styles.name}>{category.name}</span>
    </Link>
  )
}

export default CategoryCard