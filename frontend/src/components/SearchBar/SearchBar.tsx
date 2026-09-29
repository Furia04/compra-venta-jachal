import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SearchBar.module.css'

function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length === 0) return
    navigate(`/buscar?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
      <input
        type="text"
        className={styles.input}
        placeholder="¿Qué oficio buscás? Ej: plomero, electricista..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar oficio"
      />
      <button type="submit" className={styles.button}>
        Buscar
      </button>
    </form>
  )
}

export default SearchBar