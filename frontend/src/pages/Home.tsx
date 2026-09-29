import Hero from '../components/Hero/Hero'
import SearchBar from '../components/SearchBar/SearchBar'
import CategoryList from '../components/CategoryList/CategoryList'
import {FeaturedWorkers} from '../components/FeaturedWorkers/FeaturedWorkers'
import HowItWorks from'../components/HowItWorks/HowItWorks'
import WorkerCallToAction from '../components/WorkerCallToAction/WorkerCallToAction'

function Home() {
  return (
    <div>
      <Hero />
      <SearchBar />
      <CategoryList />
      <FeaturedWorkers />
      <HowItWorks />
      <WorkerCallToAction />
    </div>
  )
}

export default Home