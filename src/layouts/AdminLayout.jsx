import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '@/components/ui/sidebar';
import ClientsAside from '../components/ClientsAside';

// eslint-disable-next-line react/prop-types
export default function AdminLayout({ children }) {
  const { currentUser, ADMIN_EMAIL } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isClientsOpen, setIsClientsOpen] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else if (currentUser.email !== ADMIN_EMAIL) {
      navigate('/');
    }
  }, [currentUser, navigate, ADMIN_EMAIL]);

  useEffect(() => {
    setIsClientsOpen(false);
  }, [location.pathname]);

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  const handleToggleClients = () => setIsClientsOpen((v) => !v);

  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
    };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.t;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && dt < 600) {
      if (dx < 0) setIsClientsOpen(true);
      else setIsClientsOpen(false);
    }
    touchStart.current = null;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Sidebar
        collapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        clientsOpen={isClientsOpen}
        onToggleClients={handleToggleClients}
      />
      <ClientsAside
        open={isClientsOpen}
        onClose={() => setIsClientsOpen(false)}
      />
      <div
        className={`pt-14 md:pt-0 transition-all duration-300 ease-in-out lg:mr-64 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
