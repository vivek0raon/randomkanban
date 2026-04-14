import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

export default function NotificationToast({ boards }) {
  const [notifications, setNotifications] = useState([]);
  const [dismissedParams, setDismissedParams] = useState(new Set());

  useEffect(() => {
    if (!boards || boards.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const newNotifs = [];

      boards.forEach(board => {
        board.columns.forEach(col => {
          col.cards.forEach(card => {
            if (card.dueDate) {
              const due = new Date(card.dueDate);
              const diffMs = due - now;
              const diffHours = diffMs / (1000 * 60 * 60);

              // If due in less than 24 hours and greater than 0
              if (diffHours > 0 && diffHours <= 24) {
                if (!dismissedParams.has(card._id)) {
                  newNotifs.push({
                    id: card._id,
                    title: card.title,
                    hoursLeft: Math.round(diffHours),
                    boardName: board.title
                  });
                }
              }
            }
          });
        });
      });

      // Deduplicate
      const uniqueNotifs = Array.from(new Map(newNotifs.map(item => [item.id, item])).values());
      setNotifications(uniqueNotifs);
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [boards, dismissedParams]);

  const handleDismiss = (id) => {
    setDismissedParams(prev => new Set(prev).add(id));
    setNotifications(prev => prev.filter(p => p.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: '85px', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 9999 }}>
      {notifications.map(n => (
        <div key={n.id} className="glass-panel" style={{ padding: '1rem', borderRadius: '12px', minWidth: '280px', display: 'flex', alignItems: 'flex-start', gap: '1rem', border: '1px solid var(--accent-amber)', animation: 'slideIn 0.3s ease-out', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.8)' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '50%', color: 'var(--accent-amber)' }}>
            <Bell size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between' }}>
              Due Soon 
              <button onClick={() => handleDismiss(n.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={14}/></button>
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'white' }}>{n.title}</strong> in {n.boardName}
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.25rem', display: 'block' }}>
              Exactly {n.hoursLeft} hours remaining!
            </span>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
