import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Palette,
  Hammer,
  Clock,
  BadgeCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ProfileAvatar from '../ProfileAvatar';
import { useProfilePicsByEmail } from '../../hooks/useProfilePics';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Design Requests', path: '/admin/design-requests', icon: Palette },
  { name: 'Rejected Requests', path: '/admin/design-requests/rejected', icon: XCircle },
  { name: 'Active Projects', path: '/admin/projects/active', icon: Hammer },
  { name: 'Pending Requests', path: '/admin/projects/pending', icon: Clock },
  { name: 'Finished Projects', path: '/admin/projects/finished', icon: BadgeCheck },
];

// eslint-disable-next-line react/prop-types
const Sidebar = ({ collapsed = false, onToggleCollapse, clientsOpen = false, onToggleClients }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const profilePicsByEmail = useProfilePicsByEmail();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (item) => {
    const { path } = item;
    if (path === '/admin') return location.pathname === '/admin';
    const hasLongerMatch = navItems.some(
      (other) => other.path.length > path.length && location.pathname.startsWith(other.path)
    );
    return location.pathname.startsWith(path) && !hasLongerMatch;
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  const displayName = currentUser?.displayName || currentUser?.email || 'Admin';
  const profilePic = profilePicsByEmail[currentUser?.email?.toLowerCase()];

  return (
    <>
      {/* Mobile Brand Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pr-28 h-14"
        style={{ background: 'linear-gradient(90deg, hsl(262 83% 55%) 0%, hsl(263 70% 42%) 100%)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: 'hsl(0 0% 100% / 0.15)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
          >
            <img src="/expand-global-logo.jpg" alt="Expand Global" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
            Expand Global
          </span>
        </div>
        <span
          className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/70"
        >
          Admin
        </span>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-3 right-16 z-[60] p-2.5 rounded-xl bg-white text-[var(--color-accent)] shadow-lg transition-colors duration-200 cursor-pointer hover:bg-white/90 ${
          clientsOpen ? 'hidden' : ''
        }`}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Clients Arrow */}
      <button
        onClick={onToggleClients}
        className={`lg:hidden fixed top-3 right-4 z-[60] p-2.5 rounded-xl bg-white text-[var(--color-accent)] shadow-lg transition-colors duration-200 cursor-pointer hover:bg-white/90 ${
          clientsOpen ? 'hidden' : ''
        }`}
        aria-label={clientsOpen ? 'Close clients' : 'Open clients'}
        title={clientsOpen ? 'Close clients' : 'Clients'}
      >
        {clientsOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${
          collapsed ? 'md:w-20' : 'md:w-64'
        } w-64 shadow-2xl`}
        style={{
          background: 'linear-gradient(180deg, hsl(262 83% 55%) 0%, hsl(263 70% 42%) 45%, hsl(262 80% 20%) 100%)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.12)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ background: 'hsl(0 0% 100% / 0.15)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
            >
              <img src="/expand-global-logo.jpg" alt="Expand Global" className="w-full h-full object-cover" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1
                  className="text-white font-bold tracking-tight truncate"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Expand Global
                </h1>
                <p
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                  style={{ color: 'hsl(0 0% 100% / 0.6)' }}
                >
                  Admin Panel
                </p>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {/* Desktop Collapse Button */}
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft
                size={18}
                className={`transition-transform duration-300 ${
                  collapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p
              className="px-3 pb-2 text-[10px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'hsl(0 0% 100% / 0.45)' }}
            >
              Menu
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-xl transition-all duration-200 ${
                  collapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'
                } ${
                  active
                    ? 'bg-white/15 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white" />
                )}
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
          <div className="p-4 space-y-3" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.12)' }}>
            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors duration-200 cursor-pointer ${
                collapsed ? 'justify-center' : ''
              }`}
              style={{
                background: 'hsl(0 0% 100% / 0.1)',
                border: '1px solid hsl(0 0% 100% / 0.18)',
                color: '#ffffff',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(0 0% 100% / 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'hsl(0 0% 100% / 0.1)'; }}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {!collapsed && (darkMode ? 'Dark Mode' : 'Light Mode')}
            </button>
            <div
              className={`flex items-center gap-3 rounded-xl p-3 ${
                collapsed ? 'justify-center' : ''
              }`}
              style={{ background: 'hsl(0 0% 100% / 0.08)' }}
            >
              <ProfileAvatar
                src={profilePic}
                alt={displayName}
                size={36}
                style={{ border: '1px solid hsl(0 0% 100% / 0.3)' }}
              />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {displayName}
                  </p>
                </div>
              )}
            </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors duration-200 cursor-pointer"
            style={{ background: '#dc2626' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#b91c1c'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#dc2626'; }}
          >
            <LogOut size={18} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
