import { createContext, useCallback, useContext, useState } from 'react';
import ToastContainer from '../components/ui/Toast';

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, { type = 'success', duration = 4000 } = {}) => {
      const id = (idCounter += 1);
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismissToast(id), duration);
      }
      return id;
    },
    [dismissToast],
  );

  const value = {
    showToast,
    showSuccess: useCallback((message, opts) => showToast(message, { ...opts, type: 'success' }), [showToast]),
    showError: useCallback((message, opts) => showToast(message, { ...opts, type: 'error' }), [showToast]),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
