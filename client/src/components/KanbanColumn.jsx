import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanCardItem from './KanbanCardItem';
import { Plus, Eraser } from 'lucide-react';
import { addCard, clearColumn } from '../api/kanban';
import TaskModal from './TaskModal';

export default function KanbanColumn({ column, boardId, reloadBoard }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    setNodeRef, attributes, listeners, transform, transition, isDragging,
  } = useSortable({
    id: column._id,
    data: { type: 'Column', column },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddCard = async (cardData) => {
    try {
      await addCard(boardId, column._id, cardData);
      reloadBoard();
    } catch (err) {
      console.error("Failed to add card", err);
    }
  };

  const handleClearColumn = async () => {
    if (window.confirm(`Are you sure you want to clear all tasks from "${column.title}"?`)) {
      try {
        await clearColumn(boardId, column._id);
        reloadBoard();
      } catch (err) {
        console.error("Failed to clear column", err);
      }
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="glass-panel kanban-column">
      <div className="column-header" {...attributes} {...listeners}>
        <div className="column-title">
          <div className="column-color-indicator" style={{ background: `var(--accent-${column.color.split('-')[0]})` }} />
          {column.title}
        </div>
        <div className="column-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="column-card-count">{column.cards.length}</div>
          {column.cards.length > 0 && (
            <button 
              className="action-btn" 
              onClick={(e) => { e.stopPropagation(); handleClearColumn(); }}
              title="Clear Deck"
            >
              <Eraser size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="column-body">
        <SortableContext items={column.cards.map(c => c._id)} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <KanbanCardItem 
              key={card._id} card={card} columnId={column._id} boardId={boardId} reloadBoard={reloadBoard}
            />
          ))}
        </SortableContext>

        <button className="add-card-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Task
        </button>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddCard} 
        columnTitle={column.title} 
      />
    </div>
  );
}
