import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaSignOutAlt, FaSun, FaMoon, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
      <div className="relative overflow-hidden" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Settings
            </h1>
            <p className="text-white/70">Manage your account and preferences</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6 pb-8">
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'var(--color-accent)' }}
            >
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
              >
                {currentUser.displayName || 'User'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{currentUser.email}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
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
              {darkMode ? <FaMoon style={{ color: 'var(--color-accent)' }} /> : <FaSun style={{ color: 'var(--color-accent)' }} />}
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
          className="p-6 rounded-2xl glass-strong shadow-lg"
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
