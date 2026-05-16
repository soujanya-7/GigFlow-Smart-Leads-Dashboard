import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronRight,
  UserCog,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/leads', icon: <Users className="w-5 h-5" />, label: 'Leads' },
  { to: '/users', icon: <UserCog className="w-5 h-5" />, label: 'Users', adminOnly: true },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  return (
    <aside
      className="fixed left-0 top-0 h-screen glass border-r border-white/20 dark:border-gray-800 flex flex-col z-30"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-black font-display text-gray-900 dark:text-gray-100 tracking-tight">GigFlow</h1>
            <p className="text-[11px] font-medium text-gray-400 tracking-wider uppercase">Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            id={`nav-${item.label.toLowerCase()}`}
            className={({ isActive }) =>
              `sidebar-link group ${isActive ? 'active shadow-sm' : ''}`
            }
          >
            {item.icon}
            <span className="flex-1 text-[15px]">{item.label}</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="px-4 py-5 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800 mb-3 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
              {user?.name}
            </p>
            <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          id="logout-btn"
          className="sidebar-link w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[15px]">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
