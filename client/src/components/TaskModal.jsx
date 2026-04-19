import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar as CalendarIcon } from 'lucide-react';

import dayjs from 'dayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: 'rgba(30, 33, 48, 0.98)', 
    },
    primary: {
      main: '#818cf8', 
    }
  },
  typography: {
    fontFamily: 'inherit'
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        root: {
          zIndex: '10001 !important',
        },
        paper: {
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          backgroundImage: 'none'
        }
      }
    }
  }
});

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
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20}/></button>
        
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{existingCard ? 'Edit Task' : `Add Task to ${columnTitle}`}</h2>
        
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Task Title *</label>
          <input required autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="E.g. Database migration..." />
          
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Add more details..." />
          
          <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={{...inputStyle, marginBottom: 0, height: '48px', boxSizing: 'border-box', width: '100%', appearance: 'auto', backgroundColor: 'rgba(25, 28, 41, 0.9)'}}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div style={{ width: '100%', overflow: 'hidden' }}>
              <label style={{ display: 'flex', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', alignItems: 'center', gap: '0.25rem' }}><CalendarIcon size={14}/> Due Date & Time</label>
              <ThemeProvider theme={darkTheme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    value={dueDate ? dayjs(dueDate) : null}
                    onChange={(newValue) => setDueDate(newValue ? newValue.toDate() : null)}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    slotProps={{
                      textField: { 
                        placeholder: "Select deadline...",
                        sx: {
                          width: '100%',
                          '& .MuiInputBase-root': {
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--panel-border)',
                            color: 'white',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                            fontSize: '0.9rem',
                            height: '48px',
                            boxSizing: 'border-box',
                            padding: 0
                          },
                          '& .MuiInputBase-input': {
                            padding: '0 0.75rem',
                            height: '100%',
                            boxSizing: 'border-box'
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                          },
                          '& .MuiSvgIcon-root': {
                            color: 'white',
                            marginRight: '0.5rem'
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--panel-border)', color: 'white', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>Cancel</button>
            <button type="submit" className="button-primary" style={{ padding: '0.75rem 2rem' }}>{existingCard ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>

      <style>{`
        /* Mobile: stack time below calendar */
        @media (max-width: 768px) {
          .modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
