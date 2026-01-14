'use client';

import { useReminders } from '../context/RemindersContext';
import ReminderItem from './ReminderItem';

interface RemindersListProps {
  filter?: 'all' | 'completed' | 'active';
}

export default function RemindersList({ filter = 'all' }: RemindersListProps) {
  const { getSortedReminders, toggleReminder, deleteReminder } = useReminders();

  const filteredReminders = getSortedReminders(filter);

  if (filteredReminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-gray-500 text-center">
          {filter === 'completed'
            ? 'Нет выполненных напоминаний'
            : filter === 'active'
            ? 'Нет активных напоминаний'
            : 'Нет напоминаний. Добавьте новое!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-24">
      {filteredReminders.map((reminder) => (
        <ReminderItem
          key={reminder.id}
          reminder={reminder}
          onToggle={() => toggleReminder(reminder.id)}
          onDelete={() => deleteReminder(reminder.id)}
        />
      ))}
    </div>
  );
}
