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
        className="relative p-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
        aria-label="Notifications"
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
            style={{ background: '#ef4444', boxShadow: '0 2px 6px hsl(0 80% 50% / 0.3)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl glass shadow-xl overflow-hidden z-50"
            style={{ border: '1px solid var(--border-default)' }}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 className="text-sm font-semibold">Notifications</h3>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
                    style={{ color: 'var(--text-tertiary)' }}
                    title="Delete all"
                  >
                    <FaTrashAlt className="text-xs" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <FaBell className="mx-auto text-2xl mb-2" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3 px-4 py-3 transition-colors duration-200"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: !notif.read ? 'var(--color-accent-light)' : 'transparent',
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--color-accent)' }} />
                        )}
                        <p className={`text-xs ${!notif.read ? 'font-medium' : ''} truncate`}>
                          {notif.message}
                        </p>
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                        {notif.createdAt
                          ? new Date(notif.createdAt).toLocaleString()
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
                          style={{ color: 'var(--text-tertiary)' }}
                          title="Mark as read"
                        >
                          <FaCheck className="text-[10px]" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
                        style={{ color: 'var(--text-tertiary)' }}
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
