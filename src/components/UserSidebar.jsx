import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaPalette, FaClipboardCheck, FaTimesCircle, FaSignOutAlt, FaSun, FaMoon, FaChevronLeft, FaChevronRight, FaImages, FaSpinner, FaMoneyBillWave, FaQuestionCircle } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProfileAvatar from './ProfileAvatar';
import { useProfilePicsByEmail } from '../hooks/useProfilePics';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt },
  { name: 'Request Design', path: '/request-design', icon: FaPalette },
  { name: 'Active Requests', path: '/active-requests', icon: FaSpinner },
  { name: 'Completed Design', path: '/completed-projects', icon: FaClipboardCheck },
  { name: 'Rejected Requests', path: '/rejected-projects', icon: FaTimesCircle },
  { name: 'Gallery', path: '/gallery', icon: FaImages },
  { name: 'FAQ', path: '/faq', icon: FaQuestionCircle },
  { name: 'All Transactions', path: '/all-transactions', icon: FaMoneyBillWave },
];

// eslint-disable-next-line react/prop-types
export default function UserSidebar({ requestsOpen = false, onToggleRequests }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const profilePicsByEmail = useProfilePicsByEmail();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    setIsDesktop(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const isActive = (path) => location.pathname === path;

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const email = currentUser?.email || '';
  const profilePic = profilePicsByEmail[currentUser?.email?.toLowerCase()];

  return (
    <>
      {/* Mobile Brand Bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pr-28 h-14"
        style={{
          background: 'linear-gradient(135deg, hsl(262 83% 55% / 0.95) 0%, hsl(263 70% 42% / 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid hsl(0 0% 100% / 0.1)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: 'hsl(0 0% 100% / 0.18)', border: '1px solid hsl(0 0% 100% / 0.2)' }}
          >
            <img src="/expand-global-logo.jpg" alt="Expand Global" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
            Expand Global
          </span>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-3 right-4 z-[60] md:hidden p-2.5 rounded-xl text-white cursor-pointer ${
          requestsOpen ? 'hidden' : ''
        }`}
        style={{
          background: 'hsl(0 0% 100% / 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid hsl(0 0% 100% / 0.25)',
          boxShadow: '0 4px 15px hsl(262 83% 55% / 0.3)',
        }}
        aria-label="Toggle sidebar"
      >
        <span className="relative block w-5 h-5">
          <span
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
            }}
          >
            <HiMenu size={20} />
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)',
            }}
          >
            <HiX size={20} />
          </span>
        </span>
      </button>

      <button
        onClick={onToggleRequests}
        className={`fixed top-3 right-16 z-[60] lg:hidden p-2.5 rounded-xl text-white transition-all duration-200 cursor-pointer ${
          requestsOpen ? 'hidden' : ''
        }`}
        style={{
          background: 'hsl(0 0% 100% / 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid hsl(0 0% 100% / 0.25)',
          boxShadow: '0 4px 15px hsl(262 83% 55% / 0.3)',
        }}
        aria-label={requestsOpen ? 'Close my requests' : 'Open my requests'}
        title={requestsOpen ? 'Close my requests' : 'My Requests'}
      >
        {requestsOpen ? <FaChevronLeft size={18} /> : <FaChevronRight size={18} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, hsl(262 83% 55%) 0%, hsl(263 70% 42%) 45%, hsl(262 80% 20%) 100%)',
          transform: isDesktop ? 'translateX(0)' : (isOpen ? 'translateX(0)' : 'translateX(-100%)'),
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isDesktop ? 1 : (isOpen ? 1 : 0),
          transitionProperty: 'transform, opacity',
          transitionDuration: '0.35s',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-5"
          style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.12)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ background: 'hsl(0 0% 100% / 0.15)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
            >
              <img src="/expand-global-logo.jpg" alt="Expand Global" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p
                className="text-white font-bold tracking-tight truncate"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Expand Global
              </p>
              <p
                className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                style={{ color: 'hsl(0 0% 100% / 0.6)' }}
              >
                My Account
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p
            className="px-3 pb-2 text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: 'hsl(0 0% 100% / 0.45)' }}
          >
            Menu
          </p>
          {navLinks.map(({ name, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className="group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  color: active ? '#ffffff' : 'hsl(0 0% 100% / 0.7)',
                  background: active ? 'hsl(0 0% 100% / 0.15)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'hsl(0 0% 100% / 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'hsl(0 0% 100% / 0.7)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white" />
                )}
                <Icon className="text-base flex-shrink-0" />
                <span className="text-sm font-medium truncate">{name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-4 py-4 space-y-3"
          style={{ borderTop: '1px solid hsl(0 0% 100% / 0.12)' }}
        >
          <div
            className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: 'hsl(0 0% 100% / 0.08)' }}
          >
            <ProfileAvatar
              src={profilePic}
              alt={displayName}
              size={36}
              style={{ border: '1px solid hsl(0 0% 100% / 0.3)' }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-[11px] truncate" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
                {email}
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-300 cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, hsl(45 100% 60%) 0%, hsl(25 95% 53%) 50%, hsl(350 80% 55%) 100%)',
              border: '1px solid hsl(0 0% 100% / 0.25)',
              color: '#ffffff',
              boxShadow: '0 4px 20px hsl(45 100% 60% / 0.3), 0 2px 8px hsl(25 95% 53% / 0.2)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 30px hsl(45 100% 60% / 0.5), 0 4px 12px hsl(25 95% 53% / 0.3)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px hsl(45 100% 60% / 0.3), 0 2px 8px hsl(25 95% 53% / 0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FaSun className="drop-shadow-sm" /> : <FaMoon className="drop-shadow-sm" />}
            {darkMode ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors duration-200 cursor-pointer"
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
