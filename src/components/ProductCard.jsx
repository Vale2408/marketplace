import React, { useState, useMemo } from 'react';
import { FiHeart, FiShoppingCart, FiZoomIn } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ProductModal from './ProductModal';

const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const images = useMemo(() => {
    try {
      return JSON.parse(product.images.replace(/'/g, '"'));
    } catch {
      return [];
    }
  }, [product.images]);

  if (!product || !Array.isArray(images) || images.length === 0) {
    return <div>Immagini non disponibili</div>;
  }

  const image = images[activeImage] ?? images[0];

  return (
    <>
      <motion.div
        className="relative bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-sm transition-all duration-300 hover:shadow-2xl group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.02 }}
      >
        {/* Image slider */}
        <div className="relative h-64 w-full overflow-hidden">
          <motion.img
            key={activeImage}
            src={image}
            alt={`${product.titolo} - immagine ${activeImage + 1}`}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover transition-all duration-300"
          />
          {/* Image thumbnails */}
          <div className="absolute bottom-2 left-2 flex gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-6 h-6 border-2 rounded overflow-hidden ${
                  index === activeImage ? 'border-blue-500' : 'border-white opacity-50'
                } cursor-pointer`}
                aria-label={`Seleziona immagine ${index + 1} di ${images.length}`}
              >
                <img src={img} alt={`Thumbnail ${index + 1} di ${product.titolo}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Zoom icon */}
          <button
            onClick={() => setOpenModal(true)}
            className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition cursor-pointer"
            aria-label="Apri immagine ingrandita"
          >
            <FiZoomIn />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.titolo}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.descrizione}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-blue-600 font-semibold text-md">€{product.prezzo}</span>
          </div>

          {/* Seller & date */}
          <div className="text-xs text-gray-400 mt-1 flex justify-between">
            <span>{product.seller}</span>
            <span>{product.date}</span>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {openModal && (
        <ProductModal product={product} onClose={() => setOpenModal(false)} />
      )}
    </>
  );
};

export default ProductCard;
