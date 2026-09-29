import { Link } from 'react-router-dom'
import styles from './WorkerCallToAction.module.css'

function WorkerCallToAction() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>¿Sos trabajador o profesional?</h2>
      <p className={styles.text}>
        Sumate a OficiosYa y hacé que más vecinos de Jáchal te encuentren.
      </p>
      <Link to="/registro-trabajador" className={styles.button}>
        Registrarme como trabajador
      </Link>
    </section>
  )
}

export default WorkerCallToAction