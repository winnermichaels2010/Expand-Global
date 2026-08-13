import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon, FaUser, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import PanelHeader from '../../components/PanelHeader';

export default function AdminSettings() {
  const { currentUser, ADMIN_EMAIL } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PanelHeader title="Settings" subtitle="Manage admin preferences">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaCog size={14} />
          Preferences
        </div>
      </PanelHeader>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-5 pb-8">
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--color-accent)' }}>
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{currentUser?.displayName || 'Admin'}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{currentUser?.email}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Appearance</h2>
          <div
            className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}
          >
            <div className="flex items-center gap-3">
              {darkMode ? <FaMoon style={{ color: 'var(--color-accent)' }} /> : <FaSun style={{ color: 'var(--color-accent)' }} />}
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{darkMode ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer"
              style={{ background: darkMode ? 'var(--color-accent)' : 'var(--border-strong)' }}
              aria-label="Toggle theme"
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                style={{ transform: darkMode ? 'translateX(24px)' : 'translateX(4px)' }}
              />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
