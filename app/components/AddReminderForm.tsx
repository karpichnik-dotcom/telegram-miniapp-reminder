'use client';

import { useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';

interface AddReminderFormProps {
  onAdd: (text: string, date?: string, time?: string) => void;
}

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export default function AddReminderForm({ onAdd }: AddReminderFormProps) {
  const [text, setText] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [showDateTime, setShowDateTime] = useState(false);
  const { MainButton, showAlert } = useTelegram();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (text.trim()) {
      // Собираем дату в формат YYYY-MM-DD
      let dateString: string | undefined = undefined;
      if (day && month && year) {
        dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
      
      // Собираем время в формат HH:MM
      let timeString: string | undefined = undefined;
      if (hours && minutes) {
        timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      
      onAdd(text.trim(), dateString, timeString);
      showAlert('Напоминание добавлено!', () => {});
      
      setText('');
      setDay('');
      setMonth('');
      setYear('');
      setHours('');
      setMinutes('');
      setShowDateTime(false);
    }
  };

  // Настройка MainButton для формы добавления
  useEffect(() => {
    if (MainButton) {
      const isFormValid = text.trim().length > 0;
      
      if (isFormValid) {
        MainButton.setText('Сохранить');
        MainButton.setParams({
          color: '#0088cc', // Telegram синий цвет
          text_color: '#ffffff',
          is_active: true,
          is_visible: true,
        });
        
        const handleClick = () => {
          handleSubmit();
        };
        
        MainButton.onClick(handleClick);
        
        return () => {
          MainButton.offClick(handleClick);
        };
      } else {
        MainButton.hide();
      }
    }
  }, [MainButton, text, showAlert]);

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-4 bg-white">
      <div className="space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите напоминание..."
          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none text-base transition-all"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDateTime(!showDateTime)}
            className={`px-4 py-2.5 text-sm rounded-xl border transition-colors ${
              showDateTime
                ? 'bg-blue-50 border-blue-300 text-blue-600'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {showDateTime ? 'Скрыть дату/время' : 'Указать дату/время'}
          </button>
        </div>
        {showDateTime && (
          <div className="space-y-3" lang="ru">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none text-base transition-all"
                >
                  <option value="">День</option>
                  {Array.from({length: 31}, (_, i) => (
                    <option key={i+1} value={String(i+1)}>
                      {String(i+1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none text-base transition-all"
                >
                  <option value="">Месяц</option>
                  {months.map((m, i) => (
                    <option key={i} value={String(i+1)}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none text-base transition-all"
                >
                  <option value="">Год</option>
                  {Array.from({length: 4}, (_, i) => (
                    <option key={i} value={String(2024 + i)}>
                      {2024 + i}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Время
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none text-base transition-all"
                >
                  <option value="">Часы</option>
                  {Array.from({length: 24}, (_, i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none text-base transition-all"
                >
                  <option value="">Минуты</option>
                  {Array.from({length: 60}, (_, i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-full py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Добавить напоминание
        </button>
      </div>
    </form>
  );
}
