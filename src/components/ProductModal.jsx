import React, { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ProfileModal from './Profile';

const ProductModal = ({ product, onClose }) => {
  const [index, setIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    try {
      const imgs = JSON.parse(product.images.replace(/'/g, '"'));
      setImages(Array.isArray(imgs) ? imgs : []);
    } catch {
      setImages([]);
    }
  }, [product.images]);

  const nextImage = () =>
    setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  // gestione tastiera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-4xl w-full shadow-lg relative p-6"
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10 cursor-pointer"
            onClick={onClose}
            aria-label="Chiudi modal"
          >
            <FiX size={24} />
          </button>
          <p>Immagini non disponibili.</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-4xl w-full shadow-lg relative overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10 cursor-pointer"
            onClick={onClose}
            aria-label="Chiudi modal"
          >
            <FiX size={24} />
          </button>

          {/* Image carousel */}
          <div className="relative w-full h-96 bg-gray-100">
            <img
              src={images[index]}
              alt={`${product.titolo} - immagine ${index + 1}`}
              className="object-contain w-full h-full"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-105"
              aria-label="Immagine precedente"
            >
              <FiChevronLeft className='cursor-pointer' />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-105"
              aria-label="Immagine successiva"
            >
              <FiChevronRight className='cursor-pointer' />
            </button>
          </div>

          {/* Info */}
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <h2 id="product-modal-title" className="text-2xl font-bold">{product.titolo}</h2>
              <p className="mt-2 text-gray-700">{product.descrizione}</p>
              <div className="mt-4 text-gray-600 text-sm">
                <p><strong>Prezzo:</strong> €{product.prezzo}</p>
                <p><strong>Venditore:</strong> {product.seller}</p>
                <p><strong>Pubblicato:</strong> {product.date}</p>
              </div>
            </div>
            <div className="flex items-end justify-end">
              <button
                onClick={() => {
                  setUsername(product.seller);
                  setShowProfile(true);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Contatta il venditore
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showProfile && (
        <ProfileModal
          isOpen={true}
          username={username}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default ProductModal;
