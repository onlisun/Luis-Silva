
import React, { useState, useEffect } from 'react';
import { LeaveEntry, LeaveType } from '../types';
import { LEAVE_CONFIG } from '../constants';

interface LeaveFormProps {
  onSubmit: (entry: Omit<LeaveEntry, 'id'> | LeaveEntry) => void;
  editingEntry: LeaveEntry | null;
  onCancelEdit: () => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ onSubmit, editingEntry, onCancelEdit }) => {
  const [date, setDate] = useState('');
  const [hours, setHours] = useState<number | string>(8);
  const [type, setType] = useState<LeaveType>(LeaveType.THU);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setHours(editingEntry.hours);
      setType(editingEntry.type);
      setNote(editingEntry.note);
      setError('');
    } else {
      resetForm();
    }
  }, [editingEntry]);
  
  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setHours(8);
    setType(LeaveType.THU);
    setNote('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || hours <= 0) {
      setError('Please fill in a valid date and hours.');
      return;
    }
    setError('');

    if (editingEntry) {
      onSubmit({ ...editingEntry, date, hours: Number(hours), type, note });
    } else {
      onSubmit({ date, hours: Number(hours), type, note });
    }
    if (!editingEntry) {
      resetForm();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        {editingEntry ? 'Edit Entry' : 'Add New Entry'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
        <div className="lg:col-span-1">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700"
            required
          />
        </div>
        <div className="lg:col-span-1">
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hours</label>
          <input
            type="number"
            id="hours"
            value={hours}
            onChange={(e) => setHours(e.target.value === '' ? '' : Number(e.target.value))}
            min="0"
            step="0.5"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700"
            required
          />
        </div>
        <div className="lg:col-span-1">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700"
          >
            {Object.values(LeaveType).map(lt => (
              <option key={lt} value={lt}>{LEAVE_CONFIG[lt].label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note</label>
          <input
            type="text"
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Son is sick"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div className="md:col-span-2 lg:col-span-5 flex items-center justify-between">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-4 ml-auto">
            {editingEntry && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {editingEntry ? 'Update Entry' : 'Add Entry'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
