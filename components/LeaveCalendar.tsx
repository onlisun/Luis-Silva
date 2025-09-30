import React, { useState, useMemo } from 'react';
import { LeaveEntry } from '../types';
import { LEAVE_CONFIG } from '../constants';

interface LeaveCalendarProps {
  entries: LeaveEntry[];
  onDayClick?: (date: string) => void;
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ entries, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const entriesByDate = useMemo(() => {
    const map = new Map<string, LeaveEntry[]>();
    entries.forEach(entry => {
      const date = entry.date;
      if (!map.has(date)) {
        map.set(date, []);
      }
      map.get(date)!.push(entry);
    });
    return map;
  }, [entries]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };
  
  const renderCalendarDays = () => {
    const days = [];
    const dayOfWeekOfFirst = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
    for (let i = 0; i < dayOfWeekOfFirst; i++) {
      days.push(<div key={`empty-start-${i}`} className="border-r border-b border-gray-200 dark:border-gray-700"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEntries = entriesByDate.get(dateStr) || [];
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      
      days.push(
        <div 
          key={dateStr}
          className={`relative p-2 border-r border-b border-gray-200 dark:border-gray-700 min-h-[100px] transition-colors ${onDayClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
          onClick={() => onDayClick?.(dateStr)}
        >
          <span className={`text-sm ${isToday ? 'bg-indigo-600 text-white rounded-full flex items-center justify-center w-6 h-6' : 'dark:text-gray-200'}`}>
            {day}
          </span>
          {dayEntries.length > 0 && (
            <div className="mt-1 flex flex-col space-y-1">
              {dayEntries.map(entry => (
                <div key={entry.id} className="flex items-center space-x-1 text-xs px-1 rounded-md" title={`${entry.type}: ${entry.note} (${entry.hours}h)`}>
                    <span className={`w-2 h-2 rounded-full ${LEAVE_CONFIG[entry.type].color}`}></span>
                    <span className="truncate text-gray-700 dark:text-gray-300">{entry.note || entry.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return days;
  };
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="px-3 py-1 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800">&lt; Prev</button>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => changeMonth(1)} className="px-3 py-1 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:ring-offset-gray-800">Next &gt;</button>
      </div>
      <div className="grid grid-cols-7">
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold text-xs text-gray-500 dark:text-gray-400 p-2 border-b border-gray-200 dark:border-gray-700">{day}</div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default LeaveCalendar;
