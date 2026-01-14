'use client';

import { useEffect } from 'react';
import { useReminders } from '../context/RemindersContext';
import { useTelegram } from '../hooks/useTelegram';

export default function Profile() {
  const { reminders } = useReminders();
  const { user, colorScheme, isAvailable, MainButton, showAlert } = useTelegram();

  // Настройка MainButton для профиля
  useEffect(() => {
    if (MainButton) {
      MainButton.setText('Выход');
      MainButton.setParams({
        color: '#ff3b30', // Красный цвет для кнопки выхода
        text_color: '#ffffff',
        is_active: true,
        is_visible: true,
      });
      
      const handleClick = () => {
        showAlert('Выход выполнен (симуляция)', () => {
          // Здесь можно добавить логику выхода
          console.log('Выход из приложения');
        });
      };
      
      MainButton.onClick(handleClick);
      
      return () => {
        MainButton.offClick(handleClick);
        MainButton.hide();
      };
    }
  }, [MainButton, showAlert]);

  const completedCount = reminders.filter((r) => r.completed).length;
  const activeCount = reminders.filter((r) => !r.completed).length;
  const totalCount = reminders.length;

  return (
    <div className="px-4 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Профиль</h2>
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt="Аватар"
                    className="w-20 h-20 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-blue-600">
                      {user.first_name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.first_name} {user.last_name || ''}
                  </p>
                  {user.username && (
                    <p className="text-sm text-gray-500 mt-1">@{user.username}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
                </div>
              </div>
              {user.language_code && (
                <p className="text-sm text-gray-600">
                  Язык: {user.language_code.toUpperCase()}
                </p>
              )}
              {isAvailable && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Тема: <span className="font-medium capitalize">{colorScheme === 'light' ? 'Светлая' : 'Тёмная'}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">
                {isAvailable 
                  ? 'Данные пользователя недоступны. Откройте приложение через Telegram.'
                  : 'Приложение работает в режиме браузера. Для полного функционала откройте через Telegram.'}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Всего напоминаний</span>
              <span className="text-lg font-semibold text-gray-900">{totalCount}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Активных</span>
              <span className="text-lg font-semibold text-blue-600">{activeCount}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Выполнено</span>
              <span className="text-lg font-semibold text-green-600">
                {completedCount}
              </span>
            </div>
            {totalCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Прогресс</span>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
