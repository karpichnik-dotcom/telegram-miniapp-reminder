'use client';

interface BottomNavigationProps {
  activeTab: 'all' | 'completed' | 'search' | 'profile';
  onTabChange: (tab: 'all' | 'completed' | 'search' | 'profile') => void;
}

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => onTabChange('all')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'all'
              ? 'text-blue-500'
              : 'text-gray-400'
          }`}
        >
          <svg
            className="w-6 h-6 mb-1"
            fill={activeTab === 'all' ? 'currentColor' : 'none'}
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
          <span className="text-xs font-medium">Все</span>
        </button>
        <button
          onClick={() => onTabChange('completed')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'completed'
              ? 'text-blue-500'
              : 'text-gray-400'
          }`}
        >
          <svg
            className="w-6 h-6 mb-1"
            fill={activeTab === 'completed' ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-medium">Выполненные</span>
        </button>
        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'search'
              ? 'text-blue-500'
              : 'text-gray-400'
          }`}
        >
          <svg
            className="w-6 h-6 mb-1"
            fill={activeTab === 'search' ? 'currentColor' : 'none'}
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
          <span className="text-xs font-medium">Поиск</span>
        </button>
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'profile'
              ? 'text-blue-500'
              : 'text-gray-400'
          }`}
        >
          <svg
            className="w-6 h-6 mb-1"
            fill={activeTab === 'profile' ? 'currentColor' : 'none'}
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
          <span className="text-xs font-medium">Профиль</span>
        </button>
      </div>
    </div>
  );
}
