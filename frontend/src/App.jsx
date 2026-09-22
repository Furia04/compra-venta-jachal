import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Publish from './pages/Publish';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/publicar" element={<Publish />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
