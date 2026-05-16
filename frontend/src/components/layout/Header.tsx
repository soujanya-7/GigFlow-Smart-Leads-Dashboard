import React from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Role badge */}
        <span className={`badge text-xs ${
          user?.role === 'admin'
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {user?.role}
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          id="theme-toggle-btn"
          className="btn-icon btn-ghost text-gray-500"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
