import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchTrash, restoreTrash } from '../api/kanban';

export const UndoContext = createContext();

export function UndoProvider({ children }) {
  const [toastItem, setToastItem] = useState(null);
  const [triggerReload, setTriggerReload] = useState(0);

  // Expose a method to show the toast when a user deletes something
  const notifyDeleted = (type, title) => {
    setToastItem({ type, title });
    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      setToastItem(null);
    }, 8000);
  };

  const undoLastAction = useCallback(async () => {
    try {
      // Find the most recent trash item
      const trashItems = await fetchTrash();
      if (trashItems && trashItems.length > 0) {
        const latestItem = trashItems[0];
        await restoreTrash(latestItem._id);
        
        // Hide the toast if it matches or just hide anyway
        setToastItem(null);
        
        // Trigger a reload to update UI
        setTriggerReload(prev => prev + 1);
        return true;
      }
    } catch (err) {
      console.error("Failed to undo:", err);
    }
    return false;
  }, []);

  // Global Ctrl+Z listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      
      // Check for Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoLastAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoLastAction]);

  return (
    <UndoContext.Provider value={{ notifyDeleted, undoLastAction, triggerReload, toastItem, setToastItem }}>
      {children}
    </UndoContext.Provider>
  );
}
