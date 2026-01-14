'use client';

import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

interface TelegramMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
  setParams: (params: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }) => void;
}

interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  colorScheme?: 'light' | 'dark';
  themeParams?: TelegramThemeParams;
  MainButton?: TelegramMainButton;
  ready?: () => void;
  expand?: () => void;
  showAlert?: (message: string, callback?: () => void) => void;
  onEvent?: (eventType: string, eventHandler: () => void) => void;
  offEvent?: (eventType: string, eventHandler: () => void) => void;
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [themeParams, setThemeParams] = useState<TelegramThemeParams | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    // Безопасная проверка наличия Telegram WebApp SDK
    const win = window as typeof window & { Telegram?: { WebApp?: TelegramWebApp } };
    if (typeof window !== 'undefined' && win.Telegram?.WebApp) {
      try {
        const tg = win.Telegram.WebApp;
        setWebApp(tg);
        
        // Инициализация WebApp
        if (typeof tg.ready === 'function') {
          tg.ready();
        }
        
        // Расширяем приложение на весь экран
        if (typeof tg.expand === 'function') {
          tg.expand();
        }
        
        // Получаем данные пользователя
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user);
        }
        
        // Получаем тему (light/dark)
        if (tg.colorScheme) {
          setColorScheme(tg.colorScheme);
        }
        
        // Получаем параметры темы Telegram
        if (tg.themeParams) {
          setThemeParams(tg.themeParams);
        }
        
        // Слушаем изменения темы (с безопасной проверкой)
        const handleThemeChange = () => {
          try {
            const win = window as typeof window & { Telegram?: { WebApp?: { colorScheme?: 'light' | 'dark'; themeParams?: TelegramThemeParams } } };
            if (win.Telegram?.WebApp) {
              if (win.Telegram.WebApp.colorScheme) {
                setColorScheme(win.Telegram.WebApp.colorScheme);
              }
              if (win.Telegram.WebApp.themeParams) {
                setThemeParams(win.Telegram.WebApp.themeParams);
              }
            }
          } catch (error) {
            console.warn('Ошибка при обработке изменения темы:', error);
          }
        };
        
        // Подписываемся на событие изменения темы (если метод доступен)
        if (typeof tg.onEvent === 'function') {
          tg.onEvent('themeChanged', handleThemeChange);
        }
        
        setIsAvailable(true);
        setIsReady(true);
        
        // Очистка при размонтировании
        return () => {
          try {
            const win = window as typeof window & { Telegram?: { WebApp?: { offEvent?: (event: string, handler: () => void) => void } } };
            if (win.Telegram?.WebApp && typeof win.Telegram.WebApp.offEvent === 'function') {
              win.Telegram.WebApp.offEvent('themeChanged', handleThemeChange);
            }
          } catch (error) {
            // Игнорируем ошибки при очистке
          }
        };
      } catch (error) {
        // Безопасная обработка ошибок
        console.warn('Ошибка при инициализации Telegram WebApp:', error);
        setIsAvailable(false);
        setIsReady(true); // Помечаем как готово, даже если SDK недоступен
      }
    } else {
      // SDK недоступен (работаем в обычном браузере)
      setIsAvailable(false);
      setIsReady(true);
    }
  }, []);

  // Вспомогательные функции для работы с Telegram WebApp
  const showAlert = (message: string, callback?: () => void) => {
    if (webApp && typeof webApp.showAlert === 'function') {
      webApp.showAlert(message, callback);
    } else {
      // Fallback для браузера
      window.alert(message);
      if (callback) callback();
    }
  };

  const expand = () => {
    if (webApp && typeof webApp.expand === 'function') {
      webApp.expand();
    }
  };

  const MainButton = webApp?.MainButton || null;

  return { 
    user, 
    colorScheme, 
    themeParams,
    isReady, 
    isAvailable,
    webApp,
    showAlert,
    expand,
    MainButton
  };
}
