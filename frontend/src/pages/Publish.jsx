import { UploadCloud, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Publish() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Publicación Exitosa!</h2>
        <p className="text-gray-600 mb-8">
          Tu artículo ya está disponible en Jáchal Vende. ¡Esperamos que lo vendas pronto!
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-brand-500 text-white font-semibold py-3 px-8 rounded-xl hover:bg-brand-600 transition-colors shadow-sm"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Publicar un artículo</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Photos section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Fotos del producto</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="flex justify-center mb-3">
              <UploadCloud size={40} className="text-gray-400 group-hover:text-brand-500 transition-colors" />
            </div>
            <p className="text-gray-600 font-medium">Hacé clic o arrastrá las fotos acá</p>
            <p className="text-sm text-gray-400 mt-1">Podés subir hasta 6 imágenes en formato JPG o PNG.</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
            <input 
              type="text" 
              placeholder="Ej: Bicicleta Mountain Bike Rodado 29"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Precio ($)</label>
              <input 
                type="number" 
                placeholder="0.00"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all" required>
                <option value="">Selecciona una categoría</option>
                <option value="vehiculos">Vehículos</option>
                <option value="inmuebles">Inmuebles</option>
                <option value="tecnologia">Tecnología</option>
                <option value="hogar">Hogar</option>
                <option value="deportes">Deportes</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <textarea 
              rows="5"
              placeholder="Describe el estado de tu artículo, características principales..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
              required
            ></textarea>
          </div>
        </div>

        {/* Location Info */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación (Barrio / Distrito en Jáchal)</label>
          <input 
            type="text" 
            placeholder="Ej: San José, Niquivil, Centro..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <button type="submit" className="w-full bg-brand-500 text-white font-semibold py-4 px-4 rounded-xl hover:bg-brand-600 transition-colors shadow-sm text-lg">
          Publicar Ahora
        </button>
      </form>
    </div>
  );
}
