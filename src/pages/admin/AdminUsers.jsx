import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import PanelHeader from '../../components/PanelHeader';

export default function AdminUsers() {
  const { currentUser, getRegisteredUsers, ADMIN_EMAIL } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const users = await getRegisteredUsers();
    setRegisteredUsers(users);
    setLoading(false);
  }, [getRegisteredUsers]);

  useEffect(() => {
    if (currentUser?.email === ADMIN_EMAIL) {
      fetchUsers();
    }
  }, [currentUser, ADMIN_EMAIL, fetchUsers]);

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PanelHeader
        title="Users"
        subtitle="Manage registered users"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaUsers size={14} />
          {registeredUsers.length} total
        </div>
      </PanelHeader>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>User Management ({registeredUsers.length} total)</h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>Loading users...</p>
            ) : registeredUsers.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>No registered users yet.</p>
            ) : (
              [...registeredUsers].reverse().map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover-lift"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}
                >
                  <div className="flex items-center gap-3">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="" className="w-10 h-10 rounded-full object-cover" style={{ border: '2px solid var(--border-default)' }} />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: 'var(--color-accent)' }}
                      >
                        {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {[user.surname, user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: user.active === false ? 'hsl(0 80% 92%)' : 'hsl(152 60% 90%)',
                        color: user.active === false ? 'hsl(0 70% 45%)' : 'hsl(152 65% 35%)',
                      }}
                    >
                      {user.active === false ? 'Inactive' : 'Active'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
