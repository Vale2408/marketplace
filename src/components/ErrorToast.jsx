import { useEffect, useState, useRef } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

export default function ErrorToast({ message, duration = 3000, onClose }) {
    const [visible, setVisible] = useState(false);
    const barRef = useRef(null);

    useEffect(() => {
        setVisible(true);

        if (barRef.current) {
            // Reset styles per sicurezza
            barRef.current.style.transition = 'none';
            barRef.current.style.width = '100%';
            barRef.current.style.transformOrigin = 'right';

            // Forza reflow per attivare la transizione
            barRef.current.offsetWidth;

            // Avvia la transizione
            barRef.current.style.transition = `width ${duration}ms linear`;
            barRef.current.style.width = '0%';
        }

        const hideTimeout = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(hideTimeout);
    }, [duration]);

    // Quando la transizione di uscita finisce, chiama onClose
    useEffect(() => {
        if (!visible) {
            const timeout = setTimeout(() => {
                onClose?.();
            }, 300); // durata animazione uscita

            return () => clearTimeout(timeout);
        }
    }, [visible, onClose]);

    // Chiusura manuale
    const handleClose = () => setVisible(false);

    return (
        <div
            className={`fixed top-5 right-5 z-50 w-72 bg-red-300 text-red-700 px-4 py-3 rounded shadow-lg relative overflow-hidden
        transition-all duration-300 ease-in-out transform
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
            <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                    <FaTimesCircle className="text-red-700" />
                    <span className="text-sm">{message}</span>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Chiudi messaggio"
                  className="text-red-700 hover:text-red-900 focus:outline-none"
                >
                  &times;
                </button>
            </div>

            {/* Barra di durata */}
            <div className="absolute top-0 right-0 h-1 w-full bg-red-300">
                <div
                    ref={barRef}
                    className="h-full bg-red-700"
                    style={{ width: '100%' }}
                />
            </div>
        </div>
    );
}
