import React from 'react';
import useToastStore from '../store/useToastStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between p-4 min-w-[300px] bg-white rounded-lg shadow-xl border-l-4 ${
              toast.type === 'success' ? 'border-green-500' :
              toast.type === 'error' ? 'border-red-500' :
              'border-blue-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              {toast.type === 'success' && <CheckCircle className="text-green-500" size={24} />}
              {toast.type === 'error' && <AlertCircle className="text-red-500" size={24} />}
              {toast.type === 'info' && <Info className="text-blue-500" size={24} />}
              <span className="text-gray-800 font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors ml-4"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
