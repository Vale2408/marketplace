import { useEffect, useState } from 'react';
import { FaUser, FaPlus, FaEuroSign } from 'react-icons/fa';
import ImageUploader from '../components/ImageUploader';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import ErrorToast from '../components/ErrorToast';
import { backend } from '../App';

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const today = new Date().toLocaleDateString('it-IT');

  // Load user products on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(backend);
        const filteredProducts = response.data.filter(product => product.seller === user.username);
        setUserProducts(filteredProducts);
      } catch (err) {
        console.error('Errore nel caricamento prodotti:', err);
      }
    }

    fetchProducts();
  }, [user.username]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !description.trim() || !price.trim() || images.length === 0) {
      setError('Tutti i campi sono obbligatori');
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      setError('Inserisci un prezzo valido');
      return;
    }

    setError('');

    const newProduct = {
      titolo: title,
      descrizione: description,
      prezzo: parseFloat(price).toFixed(2),
      images: JSON.stringify(images),
      seller: user.username,
      date: today,
    };

    try {
      const result = await axios.post(`${backend}/newproduct`, newProduct);

      if (result.data.status === "success") {
        setUserProducts(prev => [...prev, newProduct]);
        setToastVisible(true);
        resetForm();
        setShowModal(false);
      } else {
        setErrorToast(true);
      }
    } catch (error) {
      console.error('Errore pubblicazione prodotto:', error);
      setErrorToast(true);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImages([]);
    setError('');
  };

  const handleImagesChange = (newImageUrls) => {
    setImages(newImageUrls);
  };

  return (
    <div>
      {/* Profile header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-600 rounded-full p-4 mr-4">
            <FaUser size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Header and add button */}
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold">I tuoi annunci</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Vendi un oggetto
        </button>
      </div>

      {/* Products list or empty state */}
      {userProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProducts.map(product => (
            <ProductCard key={product.id || product.titolo} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">Non hai ancora pubblicato nessun annuncio</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Inizia a vendere
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Vendi un oggetto</h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                aria-label="Chiudi"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div
                  role="alert"
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleFormSubmit} noValidate>
                {/* Titolo */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Titolo
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Nome del prodotto"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Descrizione */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                    Descrizione
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    placeholder="Descrivi il tuo prodotto"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Prezzo */}
                <div className="mb-4">
                  <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                    Prezzo (€)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaEuroSign className="text-gray-400" />
                    </div>
                    <input
                      id="price"
                      type="text"
                      placeholder="0.00"
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Image uploader */}
                <ImageUploader onImagesChange={handleImagesChange} />

                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Pubblica annuncio
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastVisible && (
        <Toast
          message="Prodotto pubblicato con successo!"
          duration={3000}
          onClose={() => setToastVisible(false)}
        />
      )}

      {errorToast && (
        <ErrorToast
          message="Errore nella pubblicazione!"
          duration={3000}
          onClose={() => setErrorToast(false)}
        />
      )}
    </div>
  );
}

export default Profile;
