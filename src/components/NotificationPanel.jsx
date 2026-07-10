import { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaTrash, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
export default function NotificationPanel({ userId }) {
  const {
    subscribeToNotifications,
    markNotificationAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToNotifications(userId, setNotifications);
    return unsub;
  }, [userId, subscribeToNotifications]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkAsRead(id) {
    await markNotificationAsRead(id);
  }

  async function handleDelete(id) {
    await deleteNotification(id);
  }

  async function handleDeleteAll() {
    await deleteAllNotifications(userId);
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 cursor-pointer border border-[var(--border-color)]"
        aria-label="Notifications"
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-red-500/30">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl glass shadow-xl border border-[var(--glass-border)] overflow-hidden z-50"
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 cursor-pointer"
                    title="Delete all"
                  >
                    <FaTrashAlt className="text-xs" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200 cursor-pointer"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <FaBell className="mx-auto text-2xl text-[var(--text-tertiary)] mb-2" />
                  <p className="text-sm text-[var(--text-secondary)]">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-[var(--border-color)] last:border-b-0 transition-colors duration-200 ${
                      !notif.read
                        ? 'bg-purple-50/50 dark:bg-purple-900/10'
                        : 'hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
                        )}
                        <p className={`text-xs ${!notif.read ? 'font-medium' : ''} truncate`}>
                          {notif.message}
                        </p>
                      </div>
                      <p className="text-[10px] text-[var(--text-tertiary)]">
                        {notif.createdAt
                          ? new Date(notif.createdAt).toLocaleString()
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200 cursor-pointer"
                          title="Mark as read"
                        >
                          <FaCheck className="text-[10px]" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
