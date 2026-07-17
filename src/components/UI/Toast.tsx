import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertOctagon, AlertTriangle, Info } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

// Global listener references for lightweight global notification dispatch
let toastListeners: Array<(toasts: ToastItem[]) => void> = [];
let activeToasts: ToastItem[] = [];

export const showToast = (message: string, type: ToastItem['type'] = 'info') => {
  const newToast: ToastItem = {
    id: Math.random().toString(36).substring(2, 9),
    message,
    type
  };
  activeToasts = [...activeToasts, newToast];
  toastListeners.forEach(listener => listener(activeToasts));
  
  setTimeout(() => {
    activeToasts = activeToasts.filter(t => t.id !== newToast.id);
    toastListeners.forEach(listener => listener(activeToasts));
  }, 4000);
};

export const ToastProvider: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (updated: ToastItem[]) => setToasts(updated);
    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter(l => l !== handler);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
              toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
              toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]' :
              toast.type === 'warning' ? 'bg-amber-950/90 border-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
              'bg-slate-950/90 border-primary/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
            }`}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && <CheckCircle2 size={20} className="text-emerald-400" />}
              {toast.type === 'error' && <AlertOctagon size={20} className="text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle size={20} className="text-amber-400" />}
              {toast.type === 'info' && <Info size={20} className="text-primary-light" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-tight">{toast.message}</div>
            <button
              onClick={() => {
                activeToasts = activeToasts.filter(t => t.id !== toast.id);
                toastListeners.forEach(listener => listener(activeToasts));
              }}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
