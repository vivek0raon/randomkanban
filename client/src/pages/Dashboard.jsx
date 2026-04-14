import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchBoards, createBoard } from '../api/kanban';
import KanbanBoard from '../components/KanbanBoard';
import { Plus, LogOut, Layout, Folder, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationToast from '../components/NotificationToast';

export default function Dashboard() {
  const { user, handleLogout } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardCategory, setNewBoardCategory] = useState('Personal');
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await fetchBoards();
      setBoards(data);
      if (data.length > 0 && !activeBoardId) {
        setActiveBoardId(data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    try {
      const newBoard = await createBoard({ title: newBoardName, category: newBoardCategory });
      setBoards([...boards, newBoard]);
      setActiveBoardId(newBoard._id);
      setIsCreatingBoard(false);
      setNewBoardName('');
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    handleLogout();
    navigate('/');
  };

  const groupedBoards = boards.reduce((acc, board) => {
    acc[board.category] = acc[board.category] || [];
    acc[board.category].push(board);
    return acc;
  }, {});

  return (
    <div className="dashboard-wrapper" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className="glass-panel sidebar" style={{ width: '260px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--panel-border)', zIndex: 10 }}>
        <div className="sidebar-header" style={{ padding: '1.5rem', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
          }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontWeight: 600 }}>{user?.username}</span>
        </div>

        <div className="sidebar-content" style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span>Your Workspaces</span>
            <button onClick={() => setIsCreatingBoard(!isCreatingBoard)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><Plus size={16} /></button>
          </div>

          {isCreatingBoard && (
            <form onSubmit={handleCreateBoard} style={{ marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Board name..." 
                value={newBoardName} 
                onChange={e => setNewBoardName(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', color: 'white', padding: '0.5rem', borderRadius: '4px', outline: 'none', marginBottom: '0.5rem', fontSize: '0.85rem' }} 
                autoFocus
              />
              <select 
                value={newBoardCategory} 
                onChange={e => setNewBoardCategory(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', color: 'white', padding: '0.5rem', borderRadius: '4px', outline: 'none', marginBottom: '0.5rem', fontSize: '0.85rem' }} 
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Archived">Archived</option>
              </select>
              <button type="submit" className="button-primary" style={{ padding: '0.3rem', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>Create</button>
            </form>
          )}

          {Object.entries(groupedBoards).map(([category, catBoards]) => (
            <div className="category-block" key={category} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <Folder size={14} /> {category}
              </div>
              <ul style={{ listStyle: 'none' }}>
                {catBoards.map(board => (
                  <li key={board._id} style={{ marginBottom: '0.2rem' }}>
                    <button 
                      onClick={() => setActiveBoardId(board._id)}
                      style={{
                        width: '100%', textAlign: 'left', background: activeBoardId === board._id ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: 'none', color: activeBoardId === board._id ? 'white' : 'var(--text-muted)',
                        padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                      }}
                    >
                      <Layout size={14} /> {board.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sidebar-logout" style={{ padding: '1rem', borderTop: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a
            href={`https://t.me/erenyeagerobot?start=${user?._id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#2481cc', border: 'none', color: 'white', padding: '0.6rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1c6ba8'}
            onMouseLeave={e => e.currentTarget.style.background = '#2481cc'}
          >
            <Send size={16} /> Connect Telegram
          </a>

          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--text-muted)', padding: '0.6rem', cursor: 'pointer', borderRadius: '6px' }} onMouseEnter={e => Object.assign(e.currentTarget.style, {background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)'})} onMouseLeave={e => Object.assign(e.currentTarget.style, {background: 'transparent', color: 'var(--text-muted)'})}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Board Area */}
      <main className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeBoardId ? (
          <KanbanBoard boardId={activeBoardId} key={activeBoardId} loadAllBoards={loadBoards} boards={boards} />
        ) : (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select or create a board to get started.
          </div>
        )}
      </main>

      <NotificationToast boards={boards} />
    </div>
  );
}
