import React, { useState } from "react";

function ImageUploader({ onImagesChange }) {
  const [images, setImages] = useState([]); // {id, url}
  const [removingIds, setRemovingIds] = useState([]);

  const updateImages = (newImages) => {
    setImages(newImages);
    if (onImagesChange) {
      onImagesChange(newImages.map(img => img.url));
    }
  };

  // genera id unico semplice
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) =>
            resolve({ id: generateId(), url: event.target.result });
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((newImages) => {
      updateImages([...images, ...newImages]);
    });

    e.target.value = null;
  };

  const removeImage = (id) => {
    setRemovingIds((prev) => [...prev, id]);
  };

  const handleAnimationEnd = (id) => {
    const newImages = images.filter((img) => img.id !== id);
    updateImages(newImages);
    setRemovingIds((prev) => prev.filter((remId) => remId !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center cursor-pointer bg-blue-600 text-white
                   px-8 py-4 rounded-lg shadow-md hover:bg-blue-700 active:scale-95
                   transition-transform duration-150 select-none font-semibold text-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7m-7 7v4m0 0h3m-3 0H8"
          />
        </svg>
        Carica immagini
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {images.map(({ id, url }) => {
            const isRemoving = removingIds.includes(id);
            return (
              <div
                key={id}
                className={`relative rounded-xl overflow-hidden shadow-lg border border-gray-200 group
                            ${isRemoving ? "animate-crumple" : ""}`}
                onAnimationEnd={() => isRemoving && handleAnimationEnd(id)}
              >
                <img
                  src={url}
                  alt={`preview-${id}`}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => removeImage(id)}
                  type="button"
                  className="absolute top-2 right-2 bg-white bg-opacity-80 text-gray-800
                             rounded-full p-1 hover:bg-red-600 hover:text-white
                             shadow-md transition-colors duration-200"
                  aria-label="Rimuovi immagine"
                  disabled={isRemoving}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes crumple {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          40% {
            transform: rotate(15deg) scale(0.75);
            opacity: 0.7;
          }
          70% {
            transform: rotate(-10deg) scale(0.5);
            opacity: 0.5;
          }
          100% {
            transform: rotate(45deg) scale(0);
            opacity: 0;
          }
        }
        .animate-crumple {
          animation: crumple 0.5s forwards;
        }
      `}</style>
    </div>
  );
}

export default ImageUploader;
