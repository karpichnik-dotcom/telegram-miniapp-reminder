'use client';

import { Reminder } from '../types';
import { useTelegram } from '../hooks/useTelegram';

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: () => void;
  onDelete: () => void;
}

export default function ReminderItem({ reminder, onToggle, onDelete }: ReminderItemProps) {
  const { showAlert } = useTelegram();

  const handleDelete = () => {
    if (showAlert) {
      showAlert('Напоминание удалено', () => {
        onDelete();
      });
    } else {
      onDelete();
    }
  };
  // Проверка, просрочено ли напоминание
  const isOverdue = (): boolean => {
    if (reminder.completed || !reminder.date) return false;
    
    const now = new Date();
    const reminderDate = new Date(reminder.date + 'T' + (reminder.time || '00:00'));
    return reminderDate < now;
  };

  // Форматирование даты и времени для отображения
  const formatDate = (): string => {
    if (!reminder.date) {
      return 'Без даты';
    }

    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    // Парсим дату YYYY-MM-DD
    const [year, month, day] = reminder.date.split('-').map(Number);
    const monthName = months[month - 1];

    if (reminder.date && reminder.time) {
      // Форматируем время в 24-часовом формате HH:MM
      const [hours, minutes] = reminder.time.split(':');
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      return `${day} ${monthName} ${year}, ${timeStr}`;
    }

    if (reminder.date) {
      return `${day} ${monthName} ${year}`;
    }

    return 'Без даты';
  };

  const overdue = isOverdue();

  return (
    <div
      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
        reminder.completed
          ? 'border-gray-200 bg-gray-50/50'
          : overdue
          ? 'border-red-300 bg-red-50/50 shadow-sm'
          : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
      }`}
    >
      <input
        type="checkbox"
        checked={reminder.completed}
        onChange={onToggle}
        className={`mt-1 w-6 h-6 rounded-full border-2 focus:ring-2 focus:ring-offset-2 cursor-pointer ${
          overdue && !reminder.completed
            ? 'border-red-400 text-red-500 focus:ring-red-500'
            : 'border-gray-300 text-blue-500 focus:ring-blue-500'
        }`}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-base leading-relaxed ${
            reminder.completed
              ? 'text-gray-400 line-through'
              : overdue
              ? 'text-red-700 font-medium'
              : 'text-gray-900'
          }`}
        >
          {reminder.text}
        </p>
        <p
          className={`text-sm mt-2 ${
            reminder.completed
              ? 'text-gray-400'
              : overdue
              ? 'text-red-600 font-medium'
              : 'text-gray-500'
          }`}
        >
          {formatDate()}
        </p>
      </div>
      <button
        onClick={handleDelete}
        className="ml-2 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        aria-label="Удалить"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
