import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import TaskModal from './TaskModal';
import { updateCard } from '../api/kanban';

export default function CalendarView({ board, reloadBoard }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  // Flatten cards from all columns
  const events = [];
  board.columns.forEach((col) => {
    col.cards.forEach((card) => {
      let start = card.dueDate;
      let allDay = false;
      
      if (!start) {
        start = card.createdAt;
        allDay = true;
      }

      events.push({
        id: card._id,
        title: card.title,
        start: start,
        allDay: allDay,
        backgroundColor: card.color || 'var(--accent-indigo)',
        borderColor: 'transparent',
        extendedProps: {
          card: card,
          columnId: col._id
        }
      });
    });
  });

  const handleEventClick = (clickInfo) => {
    const { card, columnId } = clickInfo.event.extendedProps;
    setSelectedCard(card);
    setSelectedColumnId(columnId);
    setIsEditModalOpen(true);
  };

  const handleEventDrop = async (dropInfo) => {
    const { event } = dropInfo;
    const { card, columnId } = event.extendedProps;
    try {
      const updatedData = { dueDate: event.start.toISOString() };
      await updateCard(board._id, columnId, card._id, updatedData);
      reloadBoard();
    } catch (e) {
      console.error("Failed to update card due date", e);
      dropInfo.revert();
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateCard(board._id, selectedColumnId, selectedCard._id, updatedData);
      reloadBoard();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update card", err);
    }
  };

  return (
    <div className="calendar-view-container glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        eventClick={handleEventClick}
        editable={true}
        eventDrop={handleEventDrop}
        height="100%"
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={true}
        allDayText="No Time / Created"
        nowIndicator={true}
      />
      {isEditModalOpen && selectedCard && (
        <TaskModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={handleUpdate} 
          columnTitle="Edit Task"
          existingCard={selectedCard}
        />
      )}
    </div>
  );
}
