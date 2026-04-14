import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanCardItem from './KanbanCardItem';
import { Plus } from 'lucide-react';
import { addCard } from '../api/kanban';
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

  return (
    <div ref={setNodeRef} style={style} className="glass-panel kanban-column">
      <div className="column-header" {...attributes} {...listeners}>
        <div className="column-title">
          <div className="column-color-indicator" style={{ background: `var(--accent-${column.color.split('-')[0]})` }} />
          {column.title}
        </div>
        <div className="column-card-count">{column.cards.length}</div>
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
