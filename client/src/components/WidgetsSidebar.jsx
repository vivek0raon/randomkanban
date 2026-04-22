import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const WidgetsSidebar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    const strHours = hours < 10 ? '0' + hours : hours;
    return { h: strHours, m: strMinutes, ampm };
  };

  const { h, m, ampm } = formatTime(time);
  
  const today = dayjs();
  const daysInMonth = today.daysInMonth();
  const firstDayOfMonth = today.startOf('month').day();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="widgets-sidebar">
      {/* Flip Clock */}
      <div className="glass-panel widget-clock">
        <div className="clock-container">
          <div className="flip-card">
            <div className="flip-bg"></div>
            <span className="time-val">{h}</span>
            <span className="time-label">HOURS</span>
          </div>
          <span className="clock-colon">:</span>
          <div className="flip-card">
            <div className="flip-bg"></div>
            <span className="time-val">{m}</span>
            <span className="time-label">MINUTES</span>
          </div>
          <div className="ampm-indicator">{ampm}</div>
        </div>
      </div>

      {/* Aesthetic Calendar */}
      <div className="glass-panel widget-calendar">
        <div className="calendar-header">
          <span className="cal-month">{today.format('MMMM')} <span style={{color: 'var(--accent-indigo)'}}>{today.format('YYYY')}</span></span>
        </div>
        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="cal-day-name">{d}</div>
          ))}
          {calendarDays.map((day, idx) => (
            <div 
              key={idx} 
              className={`cal-day ${day === today.date() ? 'cal-day-today' : ''} ${!day ? 'cal-day-empty' : ''}`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetsSidebar;
