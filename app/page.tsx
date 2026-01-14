'use client';

import { useState, useEffect } from 'react';
import { useReminders } from './context/RemindersContext';
import RemindersList from './components/RemindersList';
import AddReminderForm from './components/AddReminderForm';
import BottomNavigation from './components/BottomNavigation';
import Profile from './components/Profile';
import Search from './components/Search';
import TelegramInit from './components/TelegramInit';
import TelegramTheme from './components/TelegramTheme';
import { useTelegram } from './hooks/useTelegram';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'search' | 'profile'>('all');
  const { addReminder } = useReminders();
  const { MainButton } = useTelegram();

  // Управление MainButton в зависимости от активной вкладки
  useEffect(() => {
    if (MainButton) {
      // На вкладке профиля MainButton управляется компонентом Profile
      // На других вкладках MainButton управляется AddReminderForm
      if (activeTab === 'profile' || activeTab === 'search') {
        // MainButton будет управляться соответствующими компонентами
        // Здесь просто скрываем, если нужно
      }
    }
  }, [activeTab, MainButton]);

  return (
    <>
      {/* Инициализация Telegram WebApp SDK */}
      <TelegramInit />
      {/* Применение цветов Telegram */}
      <TelegramTheme />
      
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="px-4 py-5">
            <h1 className="text-2xl font-bold text-gray-900">Напоминания</h1>
          </div>
          {activeTab !== 'profile' && activeTab !== 'search' && (
            <AddReminderForm
              onAdd={(text, date, time) => addReminder(text, date, time)}
            />
          )}
        </div>

        <main className="pt-4">
          {activeTab === 'all' && <RemindersList filter="all" />}
          {activeTab === 'completed' && <RemindersList filter="completed" />}
          {activeTab === 'search' && <Search />}
          {activeTab === 'profile' && <Profile />}
        </main>

        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
}
