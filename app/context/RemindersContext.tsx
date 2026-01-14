'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Reminder } from '../types';

interface RemindersContextType {
  reminders: Reminder[];
  addReminder: (text: string, date?: string, time?: string) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  getSortedReminders: (filter?: 'all' | 'completed' | 'active') => Reminder[];
}

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

const STORAGE_KEY = 'telegram_reminders';

export function RemindersProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Миграция старых напоминаний (с dateTime на date + time)
  const migrateReminder = (reminder: any): Reminder => {
    // Если уже новая структура
    if (reminder.date !== undefined) {
      return {
        ...reminder,
        date: reminder.date || undefined,
        time: reminder.time || undefined,
      } as Reminder;
    }
    
    // Миграция со старой структуры (dateTime)
    if (reminder.dateTime) {
      const dateTime = new Date(reminder.dateTime);
      const date = dateTime.toISOString().split('T')[0]; // YYYY-MM-DD
      const time = dateTime.toTimeString().slice(0, 5); // HH:MM
      
      return {
        ...reminder,
        date,
        time,
      } as Reminder;
    }
    
    // Если нет даты вообще, оставляем без даты
    return {
      ...reminder,
      date: undefined,
      time: undefined,
    } as Reminder;
  };

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Миграция данных, если нужно
        const migrated = Array.isArray(parsed)
          ? parsed.map(migrateReminder)
          : [];
        setReminders(migrated);
      } catch (e) {
        console.error('Ошибка загрузки напоминаний:', e);
      }
    }
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (text: string, date?: string, time?: string) => {
    const newReminder: Reminder = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      date: date || undefined,
      time: time || undefined,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => {
      const updated = [newReminder, ...prev];
      // Сортировка по дате и времени
      return sortRemindersByDate(updated);
    });
  };

  // Функция сортировки напоминаний по ближайшему сроку
  const sortRemindersByDate = (reminders: Reminder[]): Reminder[] => {
    return [...reminders].sort((a, b) => {
      // Сначала невыполненные, потом выполненные
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Сортировка по дате (ближайшие сначала)
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      
      const dateA = new Date(a.date + 'T' + (a.time || '00:00')).getTime();
      const dateB = new Date(b.date + 'T' + (b.time || '00:00')).getTime();
      return dateA - dateB;
    });
  };

  const getSortedReminders = (filter?: 'all' | 'completed' | 'active'): Reminder[] => {
    let filtered = reminders;
    
    if (filter === 'completed') {
      filtered = reminders.filter((r) => r.completed);
    } else if (filter === 'active') {
      filtered = reminders.filter((r) => !r.completed);
    }
    
    return sortRemindersByDate(filtered);
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
  };

  return (
    <RemindersContext.Provider
      value={{ reminders, addReminder, toggleReminder, deleteReminder, getSortedReminders }}
    >
      {children}
    </RemindersContext.Provider>
  );
}

export function useReminders() {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders должен использоваться внутри RemindersProvider');
  }
  return context;
}
