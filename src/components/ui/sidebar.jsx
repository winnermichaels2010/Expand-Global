import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Palette,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationPanel from '../NotificationPanel';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Design Requests', path: '/admin/design-requests', icon: Palette },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const Sidebar = ({ collapsed = false, onToggleCollapse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
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
  const email = currentUser?.email || '';
  const initials = (displayName.split(' ').map((w) => w.charAt(0)).join('').slice(0, 2) || 'A').toUpperCase();

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white text-[var(--color-accent)] shadow-lg transition-colors duration-200 cursor-pointer hover:bg-white/90"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
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

          {/* Desktop Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:block p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
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
            const active = isActive(item.path);

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
        <div
          className="p-4 space-y-3"
          style={{ borderTop: '1px solid hsl(0 0% 100% / 0.12)' }}
        >
          <div className="flex items-center justify-center">
            {currentUser?.uid && <NotificationPanel variant="dark" userId={currentUser.uid} />}
          </div>
          <div
            className={`flex items-center gap-3 rounded-xl p-3 ${
              collapsed ? 'justify-center' : ''
            }`}
            style={{ background: 'hsl(0 0% 100% / 0.08)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'hsl(0 0% 100% / 0.2)', border: '1px solid hsl(0 0% 100% / 0.3)' }}
            >
              <span className="text-white font-semibold text-sm">{initials}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {displayName}
                </p>
                <p className="text-[11px] truncate" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
                  {email}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors duration-200 cursor-pointer"
            style={{
              background: 'hsl(0 0% 100% / 0.1)',
              border: '1px solid hsl(0 0% 100% / 0.18)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'hsl(358 70% 50%)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'hsl(0 0% 100% / 0.1)';
              e.currentTarget.style.border = '1px solid hsl(0 0% 100% / 0.18)';
            }}
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
