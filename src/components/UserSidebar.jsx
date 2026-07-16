import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaPalette, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt },
  { name: 'Request Design', path: '/request-design', icon: FaPalette },
  { name: 'Settings', path: '/settings', icon: FaCog },
];

export default function UserSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path;
  };

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg pressable"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
        }}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />
        )}
      </AnimatePresence>

      <aside
        className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0"
        style={{
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-default)',
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-5 group"
          style={{ borderBottom: '1px solid var(--border-default)' }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'var(--color-accent)' }}
          >
            EG
          </div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            My Account
          </span>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ name, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: active ? 'var(--color-accent)' : 'var(--text-secondary)',
                  background: active ? 'var(--color-accent-light)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon className="text-base" />
                {name}
              </Link>
            );
          })}
        </nav>

        <div
          className="px-3 py-3"
          style={{ borderTop: '1px solid var(--border-default)' }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer pressable"
            style={{ background: '#dc2626' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#b91c1c'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#dc2626'; }}
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
