import styles from './Hero.module.css'

function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Encontrá el profesional que necesitás</h1>
      <p className={styles.subtitle}>
        Conectamos vecinos de San Jose De Jáchal con trabajadores de confianza, cerca tuyo.
      </p>
    </section>
  )
}

export default Hero