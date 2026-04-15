import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { Loader2 } from 'lucide-react';
import { updateBoard } from '../api/kanban';

export default function KanbanBoard({ boardId, loadAllBoards, boards }) {
  const [board, setBoard] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (boardId) {
      const currentBoard = boards?.find(b => b._id === boardId);
      if (currentBoard) {
        setBoard(currentBoard);
        setIsLoading(false);
      }
    }
  }, [boardId, boards]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const activeData = active.data.current;
    if (activeData?.type === 'Column') setActiveColumn(activeData.column);
    if (activeData?.type === 'Card') setActiveCard(activeData.card);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Card';
    const isOverACard = over.data.current?.type === 'Card';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveACard) return;

    setBoard((prevBoard) => {
      const newBoard = { ...prevBoard, columns: [...prevBoard.columns] };
      const activeColIndex = newBoard.columns.findIndex(col => col.cards.some(c => c._id === activeId) || col._id === active.data.current.columnId);
      if (activeColIndex === -1) return prevBoard;

      if (isOverACard) {
        const overColIndex = newBoard.columns.findIndex(col => col.cards.some(c => c._id === overId));
        if (activeColIndex !== overColIndex) {
          const activeCardObj = newBoard.columns[activeColIndex].cards.find(c => c._id === activeId);
          newBoard.columns[activeColIndex].cards = newBoard.columns[activeColIndex].cards.filter(c => c._id !== activeId);
          const overCardIndex = newBoard.columns[overColIndex].cards.findIndex(c => c._id === overId);
          newBoard.columns[overColIndex].cards.splice(overCardIndex, 0, activeCardObj);
        } else {
          const activeCardIndex = newBoard.columns[activeColIndex].cards.findIndex(c => c._id === activeId);
          const overCardIndex = newBoard.columns[overColIndex].cards.findIndex(c => c._id === overId);
          newBoard.columns[activeColIndex].cards = arrayMove(newBoard.columns[activeColIndex].cards, activeCardIndex, overCardIndex);
        }
      }

      if (isOverAColumn) {
        const overColIndex = newBoard.columns.findIndex(col => col._id === overId);
        if (activeColIndex !== overColIndex) {
          const activeCardObj = newBoard.columns[activeColIndex].cards.find(c => c._id === activeId);
          newBoard.columns[activeColIndex].cards = newBoard.columns[activeColIndex].cards.filter(c => c._id !== activeId);
          newBoard.columns[overColIndex].cards.push(activeCardObj);
        }
      }
      return newBoard;
    });
  };

  const handleDragEnd = async (event) => {
    setActiveCard(null);
    setActiveColumn(null);
    const { over } = event;
    if (!over) return;
    try {
      await updateBoard(board._id, board);
      // Wait to invoke a full reload if the drag is over, or we just rely on local state to be snappy
    } catch (e) {
      console.error("Failed saving board order", e);
    }
  };

  if (isLoading || !board) {
    return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={48} color="var(--accent-indigo)" /></div>;
  }

  return (
    <div className="kanban-container">
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{board.title}</h2>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          <SortableContext items={board.columns.map(c => c._id)} strategy={horizontalListSortingStrategy}>
            {board.columns.map((col) => (
              <KanbanColumn key={col._id} column={col} boardId={board._id} reloadBoard={loadAllBoards} />
            ))}
          </SortableContext>
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="glass-card kanban-card" style={{ transform: 'rotate(5deg)' }}>
              <div className="card-title">{activeCard.title}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
