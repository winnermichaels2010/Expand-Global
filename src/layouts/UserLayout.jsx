import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';
import MyRequestsAside from '../components/MyRequestsAside';
import DashboardFooter from '../components/DashboardFooter';
import NotificationBell from '../components/NotificationBell';


// eslint-disable-next-line react/prop-types
export default function UserLayout({ children }) {
  const { currentUser, ADMIN_EMAIL } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [asideInitial, setAsideInitial] = useState(null);
  const touchStart = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else if (currentUser.email === ADMIN_EMAIL) {
      navigate('/admin');
    }
  }, [currentUser, navigate, ADMIN_EMAIL]);

  useEffect(() => {
    setIsRequestsOpen(false);
  }, [location.pathname]);

  const searchParams = new URLSearchParams(location.search);
  const threadParam = searchParams.get('thread');

  useEffect(() => {
    if (!threadParam) return;
    setAsideInitial({
      requestId: threadParam,
      nonce: `${location.search}-${Date.now()}`,
    });
    setIsRequestsOpen(true);
  }, [location.search, threadParam]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

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
      if (dx < 0) setIsRequestsOpen(true);
      else setIsRequestsOpen(false);
    }
    touchStart.current = null;
  };

  return (
    <div className="min-h-screen flex">
      <UserSidebar
        requestsOpen={isRequestsOpen}
        onToggleRequests={() => setIsRequestsOpen((v) => !v)}
      />
      <MyRequestsAside
        open={isRequestsOpen}
        onClose={() => setIsRequestsOpen(false)}
        initial={asideInitial}
      />
      <NotificationBell asideOpen={isRequestsOpen} />
      <div
        className="flex-1 pt-14 md:pt-0 md:ml-64 lg:mr-64 flex flex-col overflow-x-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <main className="flex-1 w-full">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
