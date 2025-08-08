import React, { createContext } from 'react';
import { useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const showSuccess = (message, options) => {
    toast.success(message, options);
  };

  const showError = (message, options) => {
    toast.error(message, options);
  };

  const showInfo = (message, options) => {
    toast.info(message, options);
  };

  const showWarning = (message, options) => {
    toast.warn(message, options);
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};