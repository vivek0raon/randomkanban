import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function TaskModal({ isOpen, onClose, onSave, columnTitle, existingCard = null }) {
  const [title, setTitle] = useState(existingCard?.title || '');
  const [description, setDescription] = useState(existingCard?.description || '');
  const [priority, setPriority] = useState(existingCard?.priority || 'medium');
  const [dueDate, setDueDate] = useState(existingCard?.dueDate ? new Date(existingCard.dueDate) : null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null
    });
    onClose();
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)',
    color: 'white', borderRadius: '8px', outline: 'none', marginBottom: '1.25rem', fontFamily: 'inherit'
  };

  const modalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>
        
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{existingCard ? 'Edit Task' : `Add Task to ${columnTitle}`}</h2>
        
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Task Title *</label>
          <input required autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="E.g. Database migration..." />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Add more details..." />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={{...inputStyle, width: '100%', appearance: 'auto', backgroundColor: 'rgba(25, 28, 41, 0.9)'}}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'flex', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', alignItems: 'center', gap: '0.25rem' }}><CalendarIcon size={14}/> Due Date & Time</label>
              <DatePicker 
                selected={dueDate} 
                onChange={(date) => setDueDate(date)} 
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select deadline..."
                className="custom-date-picker"
                wrapperClassName="date-picker-wrapper"
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>Cancel</button>
            <button type="submit" className="button-primary" style={{ padding: '0.75rem 2rem' }}>{existingCard ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>

      <style>{`
        .date-picker-wrapper { width: 100%; }
        .custom-date-picker {
          width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--panel-border);
          color: white; border-radius: 8px; outline: none; font-family: inherit;
        }
        .react-datepicker {
          background-color: var(--card-bg) !important;
          border: 1px solid var(--panel-border) !important;
          color: white !important;
          font-family: inherit !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(12px) !important;
        }
        .react-datepicker__header {
          background-color: rgba(255,255,255,0.05) !important;
          border-bottom: 1px solid var(--panel-border) !important;
        }
        .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
          color: white !important;
        }
        .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
          color: var(--text-muted) !important;
        }
        .react-datepicker__day:hover, .react-datepicker__month-text:hover, .react-datepicker__quarter-text:hover, .react-datepicker__year-text:hover {
          background-color: var(--card-hover) !important;
          color: white !important;
        }
        .react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__quarter-text--selected, .react-datepicker__year-text--selected {
          background: linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan)) !important;
          color: white !important;
        }
        .react-datepicker__time-container {
          border-left: 1px solid var(--panel-border) !important;
        }
        .react-datepicker__time-container .react-datepicker__time {
          background-color: transparent !important;
        }
        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
          color: var(--text-muted) !important;
        }
        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
          background-color: var(--card-hover) !important;
          color: white !important;
        }
        .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
          background-color: var(--accent-indigo) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
