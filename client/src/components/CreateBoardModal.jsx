import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, FolderPlus } from 'lucide-react';

export default function CreateBoardModal({ isOpen, onClose, onCreate, groupedBoards }) {
  const [boardName, setBoardName] = useState('');
  const [category, setCategory] = useState('Personal');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;
    onCreate(boardName, category);
    setBoardName('');
    setCategory('Personal');
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)',
    color: 'white', borderRadius: '8px', outline: 'none', marginBottom: '1.25rem', fontFamily: 'inherit', boxSizing: 'border-box'
  };

  const modalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FolderPlus size={20} className="text-accent-indigo" />
          Create New Board
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Board Name *</label>
          <input required autoFocus type="text" value={boardName} onChange={e => setBoardName(e.target.value)} style={inputStyle} placeholder="E.g. Q4 Marketing..." />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Workspace Category</label>
          <input 
            list="create-workspace-options"
            placeholder="Select or type workspace..."
            value={category} 
            onChange={e => setCategory(e.target.value)}
            style={inputStyle}
          />
          <datalist id="create-workspace-options">
            <option value="Personal" />
            <option value="Work" />
            <option value="Archived" />
            {Object.keys(groupedBoards).filter(c => !['Personal', 'Work', 'Archived'].includes(c)).map(c => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>Cancel</button>
            <button type="submit" className="button-primary" style={{ padding: '0.75rem 2rem' }}>Create Board</button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
