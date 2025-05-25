import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { backend, title } from '../App';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(backend);
        setProducts(response.data);
      } catch (error) {
        console.error('Errore nel fetch prodotti:', error);
      }
    }
    fetchProducts();
  }, []);

  // Filtro prodotti per ricerca testuale su titolo e descrizione
  const searchTermLower = searchTerm.toLowerCase();
  const filteredProducts = products.filter(product => {
    const titolo = product?.titolo?.toLowerCase() || '';
    const descrizione = product?.descrizione?.toLowerCase() || '';
    return titolo.includes(searchTermLower) || descrizione.includes(searchTermLower);
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">Trova e acquista oggetti da altri utenti</p>
      </div>

      {/* Barra di ricerca */}
      <div className="flex items-center flex-col md:flex-row gap-4 mb-8">
        <div
          className="flex items-center w-full mx-auto bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition"
        >
          <FiSearch className="text-gray-500 text-xl mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cerca..."
            className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Griglia prodotti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id || product.titolo} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">Nessun prodotto trovato</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
