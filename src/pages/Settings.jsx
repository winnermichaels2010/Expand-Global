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
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 dark:from-purple-950 dark:via-indigo-950 dark:to-purple-900">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-purple-200/80">Manage your account and preferences</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6 pb-8">
        {/* Profile */}
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{currentUser.displayName || 'User'}</h2>
              <p className="text-sm text-[var(--text-secondary)]">{currentUser.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              {darkMode ? <FaMoon className="text-purple-600" /> : <FaSun className="text-purple-600" />}
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-[var(--text-secondary)]">{darkMode ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                darkMode ? 'bg-purple-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle theme"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 cursor-pointer"
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
