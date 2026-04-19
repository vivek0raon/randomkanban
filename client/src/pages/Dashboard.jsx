import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchBoards, createBoard, deleteBoard } from '../api/kanban';
import KanbanBoard from '../components/KanbanBoard';
import BoardSelectorModal from '../components/BoardSelectorModal';
import CreateBoardModal from '../components/CreateBoardModal';
import { Plus, LogOut, Layout, Folder, Send, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationToast from '../components/NotificationToast';

export default function Dashboard() {
  const { user, handleLogout } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
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

  const handleCreateBoard = async (title, category) => {
    try {
      const newBoard = await createBoard({ title, category });
      setBoards([...boards, newBoard]);
      setActiveBoardId(newBoard._id);
      setIsCreatingBoard(false);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    handleLogout();
    navigate('/');
  };

  const handleDeleteBoard = async (boardId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await deleteBoard(boardId);
        const newBoards = boards.filter(b => b._id !== boardId);
        setBoards(newBoards);
        if (activeBoardId === boardId) {
          setActiveBoardId(newBoards.length > 0 ? newBoards[0]._id : null);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteWorkspace = async (category, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the workspace "${category}" and all its boards?`)) {
      try {
        const boardsInCat = boards.filter(b => b.category === category);
        for (const board of boardsInCat) {
          await deleteBoard(board._id);
        }
        const newBoards = boards.filter(b => b.category !== category);
        setBoards(newBoards);
        if (boardsInCat.some(b => b._id === activeBoardId)) {
          setActiveBoardId(newBoards.length > 0 ? newBoards[0]._id : null);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const groupedBoards = boards.reduce((acc, board) => {
    acc[board.category] = acc[board.category] || [];
    acc[board.category].push(board);
    return acc;
  }, {});

  const activeBoard = boards.find(b => b._id === activeBoardId);

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

        <div className="sidebar-content" style={{ padding: '1.5rem', paddingBottom: '2.5rem', flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span>Current Board</span>
          </div>

          <button 
             onClick={() => setIsBoardModalOpen(true)}
             style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'white', cursor: 'pointer', marginBottom: '2.5rem', transition: 'background 0.2s' }}
             onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
             onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
               <Layout size={16} style={{ flexShrink: 0, color: 'var(--accent-cyan)' }} />
               <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
                 {activeBoard ? activeBoard.title : 'Select Board...'}
               </span>
             </div>
             <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span>New Board</span>
            <button onClick={() => setIsCreatingBoard(true)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }} title="Create new board"><Plus size={16} /></button>
          </div>

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

      <BoardSelectorModal 
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        boards={boards}
        activeBoardId={activeBoardId}
        onSelectBoard={setActiveBoardId}
        onDeleteBoard={(id, e) => { e.stopPropagation(); handleDeleteBoard(id, e); }}
        onDeleteWorkspace={(cat, e) => { e.stopPropagation(); handleDeleteWorkspace(cat, e); }}
      />
      
      <CreateBoardModal 
        isOpen={isCreatingBoard}
        onClose={() => setIsCreatingBoard(false)}
        onCreate={handleCreateBoard}
        groupedBoards={groupedBoards}
      />
    </div>
  );
}
