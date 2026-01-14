'use client';

import { useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';

/**
 * Компонент для применения цветов Telegram к приложению
 * Использует CSS переменные для динамического изменения цветов
 */
export default function TelegramTheme() {
  const { themeParams, colorScheme, isAvailable } = useTelegram();

  useEffect(() => {
    const root = document.documentElement;
    
    if (isAvailable && themeParams) {
      // Применяем цвета Telegram через CSS переменные
      if (themeParams.bg_color) {
        root.style.setProperty('--tg-bg-color', themeParams.bg_color);
      }
      if (themeParams.text_color) {
        root.style.setProperty('--tg-text-color', themeParams.text_color);
      }
      if (themeParams.hint_color) {
        root.style.setProperty('--tg-hint-color', themeParams.hint_color);
      }
      if (themeParams.link_color) {
        root.style.setProperty('--tg-link-color', themeParams.link_color);
      }
      if (themeParams.button_color) {
        root.style.setProperty('--tg-button-color', themeParams.button_color);
      }
      if (themeParams.button_text_color) {
        root.style.setProperty('--tg-button-text-color', themeParams.button_text_color);
      }
      if (themeParams.secondary_bg_color) {
        root.style.setProperty('--tg-secondary-bg-color', themeParams.secondary_bg_color);
      }
    }
    
    // Применяем тему (light/dark)
    if (colorScheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [themeParams, colorScheme, isAvailable]);

  return null;
}
