import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaSignOutAlt, FaSun, FaMoon, FaUser, FaCog, FaIdBadge } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PanelHeader from '../components/PanelHeader';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  if (!currentUser) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader title="Settings" subtitle="Manage your account and preferences">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaCog size={14} />
          Account
        </div>
      </PanelHeader>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-5 pb-8">
        <motion.div
          className="p-6 rounded-2xl glass-strong"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
            >
              <FaUser className="text-white text-xl" />
            </div>
            <div className="min-w-0">
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
              >
                {currentUser.displayName || 'User'}
              </h2>
              <p className="text-sm flex items-center gap-2 truncate" style={{ color: 'var(--text-secondary)' }}>
                <FaIdBadge className="flex-shrink-0" />
                {currentUser.email}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl glass-strong"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            Appearance
          </h2>
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-accent-light)' }}
              >
                {darkMode ? <FaMoon style={{ color: 'var(--color-accent)' }} /> : <FaSun style={{ color: 'var(--color-accent)' }} />}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{darkMode ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer"
              style={{ background: darkMode ? 'var(--color-accent)' : 'var(--text-tertiary)' }}
              aria-label="Toggle theme"
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                style={{ transform: darkMode ? 'translateX(24px)' : 'translateX(4px)' }}
              />
            </button>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl glass-strong"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            Account
          </h2>
          <motion.button
            onClick={handleLogout}
            className="pressable w-full flex items-center justify-center gap-2 px-5 py-3 text-white font-medium rounded-xl transition-all duration-200 cursor-pointer"
            style={{ background: '#dc2626' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSignOutAlt />
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
