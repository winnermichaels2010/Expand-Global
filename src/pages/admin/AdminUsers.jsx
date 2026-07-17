import { useEffect, useState, useCallback } from 'react';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { currentUser, getRegisteredUsers, toggleUserStatus, ADMIN_EMAIL } = useAuth();
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

  async function handleToggleUser(userId) {
    await toggleUserStatus(userId);
    fetchUsers();
  }

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div style={{ background: 'var(--color-accent)' }} className="px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Users</h1>
          <p className="text-white/70">Manage registered users</p>
        </motion.div>
      </div>

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
                    <motion.button
                      onClick={() => handleToggleUser(user.userId)}
                      className="p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                      style={{ color: user.active === false ? '#ef4444' : '#10b981' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={user.active === false ? 'Activate' : 'Deactivate'}
                    >
                      {user.active === false
                        ? <FaToggleOff className="text-lg" />
                        : <FaToggleOn className="text-lg" />
                      }
                    </motion.button>
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
