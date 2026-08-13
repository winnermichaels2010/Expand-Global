import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '@/components/ui/sidebar';

// eslint-disable-next-line react/prop-types
export default function AdminLayout({ children }) {
  const { currentUser, ADMIN_EMAIL } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else if (currentUser.email !== ADMIN_EMAIL) {
      navigate('/');
    }
  }, [currentUser, navigate, ADMIN_EMAIL]);

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-secondary)' }}>
      <Sidebar collapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <div
        className={`pt-16 md:pt-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
