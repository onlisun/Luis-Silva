import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LeaveType, LeaveEntry } from './types';
import { LEAVE_CONFIG, HOURS_PER_DAY } from './constants';
import SummaryCard from './components/SummaryCard';
import LeaveForm from './components/LeaveForm';
import LeaveHistory from './components/LeaveHistory';
import StatisticsDashboard from './components/StatisticsDashboard';
import LeaveCalendar from './components/LeaveCalendar';
import { SunIcon, MoonIcon, CalendarIcon, ListIcon } from './components/Icons';

const App: React.FC = () => {
  const [entries, setEntries] = useState<LeaveEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<LeaveEntry | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    const storedEntries = localStorage.getItem('leaveEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leaveEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const leaveTotals = useMemo(() => {
    const totals = {
      [LeaveType.ZOR]: { totalHours: 0 },
      [LeaveType.DOK]: { totalHours: 0 },
      [LeaveType.THU]: { totalHours: 0 },
    };

    for (const entry of entries) {
      if (totals[entry.type]) {
        totals[entry.type].totalHours += entry.hours;
      }
    }
    return totals;
  }, [entries]);

  const addEntry = useCallback((entry: Omit<LeaveEntry, 'id'>) => {
    const newEntry: LeaveEntry = { ...entry, id: Date.now().toString() };
    setEntries(prev => [...prev, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const updateEntry = useCallback((updatedEntry: LeaveEntry) => {
    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setEditingEntry(null);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
      if (editingEntry?.id === id) {
        setEditingEntry(null);
      }
    }
  }, [editingEntry]);

  const handleEdit = useCallback((entry: LeaveEntry) => {
    setEditingEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingEntry(null);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400">NoWorkabel</h1>
          <div className="flex items-center gap-4">
            <img src="https://validate-user.hroffice.nl/img/logos/ceva/logo.png" alt="Company Logo" className="h-10" />
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.values(LeaveType).map(type => (
            <SummaryCard
              key={type}
              type={type}
              config={LEAVE_CONFIG[type]}
              totalHoursUsed={leaveTotals[type].totalHours}
              hoursPerDay={HOURS_PER_DAY}
            />
          ))}
        </section>

        <section className="mb-8">
          <LeaveForm
            onSubmit={editingEntry ? updateEntry : addEntry}
            editingEntry={editingEntry}
            onCancelEdit={cancelEdit}
          />
        </section>

        <section>
          <StatisticsDashboard entries={entries} isDarkMode={isDarkMode} />
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">History</h2>
            <div className="flex items-center p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
              <button 
                onClick={() => setViewMode('list')} 
                className={`flex items-center justify-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}
                aria-pressed={viewMode === 'list'}
              >
                <ListIcon className="w-5 h-5" /><span className="hidden sm:inline ml-2">List</span>
              </button>
              <button 
                onClick={() => setViewMode('calendar')} 
                className={`flex items-center justify-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-900 shadow text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`}
                aria-pressed={viewMode === 'calendar'}
              >
                <CalendarIcon className="w-5 h-5" /><span className="hidden sm:inline ml-2">Calendar</span>
              </button>
            </div>
          </div>
          {viewMode === 'list' ? (
            <LeaveHistory
              entries={entries}
              onEdit={handleEdit}
              onDelete={deleteEntry}
            />
          ) : (
            <LeaveCalendar entries={entries} />
          )}
        </section>
      </div>
    </div>
  );
};

export default App;