import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit2, Calendar } from 'lucide-react';
import { deleteCard, updateCard } from '../api/kanban';
import TaskModal from './TaskModal';

export default function KanbanCardItem({ card, columnId, boardId, reloadBoard }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card._id,
    data: {
      type: 'Card',
      card,
      columnId,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteCard(boardId, columnId, card._id);
      reloadBoard();
    } catch (err) {
      console.error("Failed to delete card", err);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateCard(boardId, columnId, card._id, updatedData);
      reloadBoard();
    } catch (err) {
      console.error("Failed to update card", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        className="glass-card kanban-card"
        {...attributes}
        {...listeners}
      >
        <div className="card-actions">
          <button className="action-btn" onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}><Edit2 size={14} /></button>
          <button className="action-btn" onClick={handleDelete}><Trash2 size={14} /></button>
        </div>
        
        <div className="card-title">{card.title}</div>
        {card.description && <div className="card-desc">{card.description}</div>}
        
        <div className="card-footer">
          <span className={`priority-badge priority-${card.priority}`}>
            {card.priority}
          </span>
          {card.dueDate ? (
            <div className="card-date">
              <Calendar size={12} />
              {formatDate(card.dueDate)}
            </div>
          ) : (
            <div className="card-date" style={{opacity: 0.5}}>No Date</div>
          )}
        </div>
      </div>

      <TaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={handleUpdate} 
        columnTitle="Task Editor"
        existingCard={card}
      />
    </>
  );
}
