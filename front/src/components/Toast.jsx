import React, { useEffect } from 'react';
import { IoCheckmarkCircle, IoWarning, IoCloseCircle, IoClose } from 'react-icons/io5';

const Toast = ({ 
  message, 
  type = 'success', 
  isVisible, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <IoCloseCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <IoWarning className="w-6 h-6 text-yellow-600" />;
      default:
        return <IoCheckmarkCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const getToastClasses = () => {
    const baseClasses = "toast animate-fade-in";
    switch (type) {
      case 'success':
        return `${baseClasses} toast-success`;
      case 'error':
        return `${baseClasses} toast-error`;
      case 'warning':
        return `${baseClasses} toast-warning`;
      default:
        return `${baseClasses} toast-success`;
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
