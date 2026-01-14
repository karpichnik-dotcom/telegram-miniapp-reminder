'use client';

import { useState } from 'react';
import { useReminders } from '../context/RemindersContext';
import ReminderItem from './ReminderItem';

export default function Search() {
  const { reminders, toggleReminder, deleteReminder, getSortedReminders } = useReminders();
  const [searchQuery, setSearchQuery] = useState('');

  const allReminders = getSortedReminders('all');
  const filteredReminders = allReminders.filter((reminder) =>
    reminder.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 pb-24">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск напоминаний..."
            className="w-full px-4 py-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none text-base transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {searchQuery ? (
        filteredReminders.length > 0 ? (
          <div className="space-y-4">
            {filteredReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggle={() => toggleReminder(reminder.id)}
                onDelete={() => deleteReminder(reminder.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 text-center">
              Ничего не найдено по запросу "{searchQuery}"
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-gray-500 text-center">
            Введите текст для поиска напоминаний
          </p>
        </div>
      )}
    </div>
  );
}
