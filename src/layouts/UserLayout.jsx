import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';

// eslint-disable-next-line react/prop-types
export default function UserLayout({ children }) {
  const { currentUser, ADMIN_EMAIL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else if (currentUser.email === ADMIN_EMAIL) {
      navigate('/admin');
    }
  }, [currentUser, navigate, ADMIN_EMAIL]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <UserSidebar />
      <div className="flex-1 md:ml-64">
        {children}
      </div>
    </div>
  );
}
