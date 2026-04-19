import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, Search, Folder, Layout, Trash2 } from 'lucide-react';

export default function BoardSelectorModal({ 
  isOpen, 
  onClose, 
  boards, 
  activeBoardId, 
  onSelectBoard, 
  onDeleteBoard, 
  onDeleteWorkspace 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBoards = useMemo(() => {
    if (!searchQuery.trim()) return boards;
    const lowerQ = searchQuery.toLowerCase();
    return boards.filter(b => 
      b.title.toLowerCase().includes(lowerQ) || b.category.toLowerCase().includes(lowerQ)
    );
  }, [boards, searchQuery]);

  const groupedBoards = useMemo(() => {
    return filteredBoards.reduce((acc, board) => {
      acc[board.category] = acc[board.category] || [];
      acc[board.category].push(board);
      return acc;
    }, {});
  }, [filteredBoards]);

  if (!isOpen) return null;

  const modalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
      <div className="glass-panel" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '1.5rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Select Workspace / Board</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}>
            <X size={20}/>
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search boards or workspaces..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }}
            autoFocus
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
          {Object.keys(groupedBoards).length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
              No matches found.
            </div>
          ) : (
            Object.entries(groupedBoards).map(([category, catBoards]) => (
              <div className="category-block" key={category} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <Folder size={16} style={{ flexShrink: 0 }} /> 
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{category}</span>
                  </div>
                  <button onClick={(e) => onDeleteWorkspace(category, e)} style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.8 }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.8} title="Delete Workspace">
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {catBoards.map(board => (
                    <li key={board._id} style={{ marginBottom: '0.4rem' }}>
                      <div 
                        onClick={() => {
                          onSelectBoard(board._id);
                          onClose();
                        }}
                        style={{
                          width: '100%', textAlign: 'left', background: activeBoardId === board._id ? 'rgba(255,255,255,0.1)' : 'transparent',
                          border: activeBoardId === board._id ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid transparent',
                          color: activeBoardId === board._id ? 'white' : 'var(--text-main)',
                          padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          if (activeBoardId !== board._id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={e => {
                          if (activeBoardId !== board._id) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                          <Layout size={16} style={{ flexShrink: 0, color: activeBoardId === board._id ? 'var(--accent-cyan)' : 'var(--text-muted)' }} /> 
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: activeBoardId === board._id ? 600 : 400 }}>{board.title}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteBoard(board._id, e); }} 
                          style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', opacity: 0.6, padding: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.2s' }} 
                          onMouseEnter={e => e.currentTarget.style.opacity = 1} 
                          onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                          title="Delete Board"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
