import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaCommentDots,
  FaPalette,
  FaInfoCircle,
  FaCheckDouble,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const typeMeta = {
  message: { icon: FaCommentDots, color: '#2563eb' },
  design_request: { icon: FaPalette, color: 'var(--color-accent)' },
  payment: { icon: FaMoneyBillWave, color: '#10b981' },
  info: { icon: FaInfoCircle, color: 'var(--color-accent-muted)' },
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// eslint-disable-next-line react/prop-types
export default function NotificationBell({ asideOpen = false }) {
  const {
    currentUser,
    ADMIN_EMAIL,
    subscribeToNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('unread');
  const rootRef = useRef(null);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = subscribeToNotifications(currentUser.uid, setNotifications);
    return unsub;
  }, [currentUser, subscribeToNotifications]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const items = filter === 'unread' ? sorted.filter((n) => !n.read) : sorted;

  function resolveDestination(n) {
    if (n.link) return n.link;
    const isAdmin = currentUser?.email === ADMIN_EMAIL;
    if (n.type === 'message') return isAdmin ? '/admin' : '/dashboard';
    if (n.type === 'design_request') return isAdmin ? '/admin/projects/pending' : '/dashboard';
    if (n.type === 'payment') return isAdmin ? '/admin/transactions' : '/all-transactions';
    return isAdmin ? '/admin' : '/dashboard';
  }

  async function handleItemClick(n) {
    if (!n.read) await markNotificationAsRead(n.id);
    setOpen(false);
    navigate(resolveDestination(n));
  }

  async function handleMarkAll() {
    if (!currentUser?.uid) return;
    await markAllNotificationsAsRead(currentUser.uid);
  }

  return (
    <div
      ref={rootRef}
      className={`fixed top-3 right-28 lg:right-[268px] z-[70] ${
        asideOpen ? 'max-lg:hidden' : ''
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex items-center justify-center w-11 h-11 rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          background: 'hsl(0 0% 100% / 0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid hsl(0 0% 100% / 0.25)',
          boxShadow: '0 4px 15px hsl(262 83% 55% / 0.3)',
        }}
        aria-label="Notifications"
        title="Notifications"
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <>
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '2px solid hsl(262 83% 55% / 0.6)', animation: 'pulse-ring 1.8s ease-out infinite' }}
            />
            <span
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: '#ef4444', border: '2px solid hsl(262 83% 55%)' }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed top-[64px] right-3 md:right-28 lg:right-[268px] w-[min(92vw,380px)] overflow-hidden rounded-2xl"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 20px 60px -15px hsl(262 83% 55% / 0.2), 0 8px 24px -8px rgba(0,0,0,0.25)',
          }}
        >
          <div
            className="flex items-center justify-between gap-2 px-4 py-3"
            style={{
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FaBell style={{ color: 'var(--color-accent)' }} />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-semibold flex-shrink-0"
                  style={{ background: '#ef4444' }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setFilter(filter === 'unread' ? 'all' : 'unread')}
                className="text-[10px] font-semibold px-2 py-1 rounded-lg cursor-pointer transition-colors duration-150"
                style={{
                  background: filter === 'unread' ? 'var(--color-accent-light)' : 'transparent',
                  color: filter === 'unread' ? 'var(--color-accent)' : 'var(--text-secondary)',
                }}
              >
                {filter === 'unread' ? 'Unread' : 'All'}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg cursor-pointer transition-colors duration-150"
                  style={{ color: 'var(--color-accent)' }}
                  title="Mark all as read"
                >
                  <FaCheckDouble className="text-[10px]" /> Mark all
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[55vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: 'var(--color-accent-light)' }}
                >
                  <FaBell size={20} style={{ color: 'var(--color-accent-muted)' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {filter === 'unread' ? "You're all caught up" : 'No notifications yet'}
                </p>
              </div>
            ) : (
              items.map((n) => {
                const meta = typeMeta[n.type] || typeMeta.info;
                const Icon = meta.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className="w-full text-left flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150"
                    style={{
                      background: n.read ? 'var(--bg-elevated)' : 'var(--color-accent-light)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = n.read
                        ? 'var(--bg-elevated)'
                        : 'var(--color-accent-light)';
                    }}
                  >
                    <div
                      className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${meta.color}1a` }}
                    >
                      <Icon size={14} style={{ color: meta.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-xs leading-snug line-clamp-2"
                        style={{
                          color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                          fontWeight: n.read ? 400 : 600,
                        }}
                      >
                        {n.message}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: '#ef4444' }}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
