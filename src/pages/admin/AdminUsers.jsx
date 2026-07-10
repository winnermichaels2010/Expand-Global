import { useEffect, useState } from 'react';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { currentUser, getRegisteredUsers, toggleUserStatus, ADMIN_EMAIL } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    if (currentUser?.email === ADMIN_EMAIL) {
      getRegisteredUsers().then(setRegisteredUsers);
    }
  }, [currentUser, getRegisteredUsers, ADMIN_EMAIL]);

  async function handleToggleUser(userId) {
    await toggleUserStatus(userId);
    getRegisteredUsers().then(setRegisteredUsers);
  }

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 dark:from-purple-950 dark:via-indigo-950 dark:to-purple-900">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Users</h1>
            <p className="text-purple-200/80">Manage registered users</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-6">User Management ({registeredUsers.length} total)</h2>
          <div className="space-y-4">
            {registeredUsers.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] text-center py-8">No registered users yet.</p>
            ) : (
              [...registeredUsers].reverse().map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {[user.surname, user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.active === false
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {user.active === false ? 'Inactive' : 'Active'}
                    </span>
                    <motion.button
                      onClick={() => handleToggleUser(user.userId)}
                      className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors duration-200 cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={user.active === false ? 'Activate' : 'Deactivate'}
                    >
                      {user.active === false
                        ? <FaToggleOff className="text-red-500 text-lg" />
                        : <FaToggleOn className="text-emerald-500 text-lg" />
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
