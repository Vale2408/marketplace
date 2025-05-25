import React, { useEffect, useRef, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Toast = ({ message, duration = 3000, onClose = () => {} }) => {
  const [visible, setVisible] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    setVisible(true);

    if (barRef.current) {
      barRef.current.style.transition = 'none';
      barRef.current.style.width = '100%';
      barRef.current.style.transformOrigin = 'right';

      barRef.current.offsetWidth; // trigger reflow

      barRef.current.style.transition = `width ${duration}ms linear`;
      barRef.current.style.width = '0%';
    }

    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(hideTimeout);
  }, [duration]);

  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => {
        onClose();
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [visible, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-5 right-5 z-50 w-72 bg-green-100 text-green-800 px-4 py-3 rounded shadow-lg relative overflow-hidden
        transition-all duration-300 ease-in-out transform
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      <div className="flex items-center space-x-2">
        <FaCheckCircle className="text-green-600" />
        <span className="text-sm">{message}</span>
      </div>

      <div className="absolute top-0 right-0 h-1 w-full bg-green-100">
        <div
          ref={barRef}
          className="h-full bg-green-600"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default Toast;
