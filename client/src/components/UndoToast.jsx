import React, { useContext } from 'react';
import { UndoContext } from '../context/UndoContext';
import { RotateCcw, X } from 'lucide-react';

export default function UndoToast() {
  const { toastItem, setToastItem, undoLastAction } = useContext(UndoContext);

  if (!toastItem) return null;

  return (
    <div className="undo-toast">
      <span className="undo-toast-text">
        {toastItem.type === 'card' ? 'Task' : 'Board'} <strong>{toastItem.title}</strong> deleted
      </span>
      
      <div className="undo-divider"></div>
      
      <button className="undo-btn" onClick={() => undoLastAction()}>
        <RotateCcw size={16} /> Undo
      </button>

      <button className="undo-close-btn" onClick={() => setToastItem(null)}>
        <X size={16} />
      </button>

      <style>{`
        .undo-toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--panel-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--panel-border);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
          animation: slideUp 0.3s ease-out;
          width: max-content;
          max-width: 90vw;
        }
        
        .undo-toast-text {
          color: white;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 400px;
        }

        .undo-toast-text strong {
          color: var(--accent-indigo);
        }

        .undo-divider {
          width: 1px;
          height: 20px;
          background: var(--panel-border);
          flex-shrink: 0;
        }

        .undo-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: none;
          color: var(--accent-emerald);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .undo-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0;
          display: flex;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .undo-toast {
            bottom: 80px; /* Position above mobile sidebar dock */
            padding: 0.75rem 1rem;
            gap: 0.5rem;
            width: 90vw;
            border-radius: 12px;
          }
          .undo-toast-text {
            white-space: normal;
            font-size: 0.85rem;
            max-width: unset;
            flex: 1;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .undo-btn {
            font-size: 0.85rem;
          }
          .undo-divider {
            height: 30px;
          }
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
