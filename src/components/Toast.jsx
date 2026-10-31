import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  return (
    <div className={`toast-notification ${toast.type || 'info'} animate-slide-in`}>
      <div className="toast-icon">
        {isSuccess && '✅'}
        {isError && '⚠️'}
        {isWarning && '🔒'}
        {toast.type === 'info' && '💡'}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Đóng thông báo">
        ✕
      </button>
    </div>
  );
}
