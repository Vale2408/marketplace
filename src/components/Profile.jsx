import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { backend } from '../App';

export default function ProfileModal({ isOpen, onClose, username }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return; // Non fare nulla se il modal è chiuso
    if (!username) return;

    const fetchEmail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${backend}/user`, { username }); // Meglio inviare un oggetto
        setEmail(response.data.email || response.data); // Assumi che email sia in response.data.email o response.data
      } catch (err) {
        setError("Errore nel caricamento dell'email");
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [isOpen, username]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-80 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-5xl">
            <FaUser />
          </div>
          <h2 className="text-xl font-semibold">{username}</h2>

          {loading && <p>Caricamento...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <p className="text-gray-600">{email || "Email non disponibile"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
