import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Trash2, RotateCcw, X, Loader2, AlertCircle } from 'lucide-react';
import { fetchTrash, restoreTrash, deleteTrashItem, emptyTrash } from '../api/kanban';

export default function TrashModal({ isOpen, onClose, onRestored }) {
  const [trashItems, setTrashItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadTrash();
    }
  }, [isOpen]);

  const loadTrash = async () => {
    setIsLoading(true);
    try {
      const items = await fetchTrash();
      setTrashItems(items);
    } catch (err) {
      console.error("Failed to fetch trash", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreTrash(id);
      setTrashItems(trashItems.filter(item => item._id !== id));
      if (onRestored) onRestored();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to restore item");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrashItem(id);
      setTrashItems(trashItems.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const handleEmptyTrash = async () => {
    if (window.confirm("Are you sure you want to permanently delete all items in the bin?")) {
      try {
        await emptyTrash();
        setTrashItems([]);
      } catch (err) {
        console.error("Failed to empty trash", err);
      }
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', borderRadius: '16px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
        <div className="modal-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem' }}><Trash2 /> Recycle Bin</h2>
          <button className="action-btn" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}><X size={20} /></button>
        </div>

        <div className="modal-body custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader2 className="animate-spin" size={32} color="var(--accent-indigo)" />
            </div>
          ) : trashItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
              <Trash2 size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Your bin is empty.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {trashItems.map(item => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)', borderRadius: '8px' }}>
                  <div style={{ minWidth: 0, flex: 1, marginRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', background: item.itemType === 'board' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: item.itemType === 'board' ? 'var(--accent-indigo)' : 'var(--accent-emerald)', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600, flexShrink: 0 }}>
                        {item.itemType}
                      </span>
                      <strong style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.data.title}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Deleted on {new Date(item.deletedAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button 
                      onClick={() => handleRestore(item._id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      <RotateCcw size={14} /> Restore
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '6px', cursor: 'pointer' }}
                      title="Delete Permanently"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {trashItems.length > 0 && (
          <div className="modal-footer" style={{ padding: '1.5rem', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={14} /> Items are kept here until permanently deleted.
            </div>
            <button 
              onClick={handleEmptyTrash}
              style={{ padding: '0.6rem 1.2rem', background: 'var(--accent-rose)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              Empty Bin
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
