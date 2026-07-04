import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaPalette, FaUsers, FaCheck, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ADMIN_EMAIL = 'adminemail@gmail.com';

export default function AdminDashboard() {
  const { currentUser, logout, getDesignRequests, getRegisteredUsers, toggleUserStatus } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [designRequests, setDesignRequests] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [view, setView] = useState(searchParams.get('view') || 'dashboard');

  useEffect(() => {
    if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
      navigate('/');
    } else {
      getDesignRequests().then(setDesignRequests);
      getRegisteredUsers().then(setRegisteredUsers);
    }
  }, [currentUser, navigate, getDesignRequests, getRegisteredUsers]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  async function handleToggleUser(userId) {
    await toggleUserStatus(userId);
    getRegisteredUsers().then(setRegisteredUsers);
  }

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  const activeUsers = registeredUsers.filter((u) => u.active !== false);
  const inactiveUsers = registeredUsers.filter((u) => u.active === false);

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 dark:from-purple-950 dark:via-indigo-950 dark:to-purple-900">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-purple-200/80">
                Welcome back, {currentUser.displayName || currentUser.email?.split('@')[0] || 'Admin'}
              </p>
            </div>
            <motion.button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaSignOutAlt />
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="p-5 rounded-2xl glass-strong shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setView('designs')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mb-3 shadow-md">
              <FaPalette className="text-white text-lg" />
            </div>
            <p className="text-2xl font-bold">{designRequests.length}</p>
            <p className="text-xs text-[var(--text-secondary)]">Design Requests</p>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="p-5 rounded-2xl glass-strong shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => setView('users')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center mb-3 shadow-md">
              <FaUsers className="text-white text-lg" />
            </div>
            <p className="text-2xl font-bold">{activeUsers.length}</p>
            <p className="text-xs text-[var(--text-secondary)]">Active Users</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                className="p-6 rounded-2xl glass-strong shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Recent Design Requests</h2>
                  <button onClick={() => setView('designs')} className="text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {designRequests.length === 0 ? (
                    <p className="text-sm text-[var(--text-secondary)] text-center py-8">No design requests yet.</p>
                  ) : (
                    designRequests.slice(-5).reverse().map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm">
                            {request.name?.split(' ').map(n => n[0]).join('') || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{request.name || 'Unknown'}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{request.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            request.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                            request.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                            'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          }`}>
                            {request.status}
                          </span>
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{new Date(request.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div
                className="p-6 rounded-2xl glass-strong shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setView('designs')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-200 text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center">
                      <FaPalette className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Design Requests</p>
                      <p className="text-xs text-[var(--text-secondary)]">{designRequests.length} total</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setView('users')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-200 text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <FaUsers className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Manage Users</p>
                      <p className="text-xs text-[var(--text-secondary)]">{activeUsers.length} active, {inactiveUsers.length} inactive</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {view === 'designs' && (
          <motion.div
            className="p-6 rounded-2xl glass-strong shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">All Design Requests</h2>
              <button onClick={() => setView('dashboard')} className="text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                Back to Dashboard
              </button>
            </div>
            <div className="space-y-4">
              {designRequests.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)] text-center py-8">No design requests yet.</p>
              ) : (
                [...designRequests].reverse().map((request) => (
                  <div key={request.id} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm">
                          {request.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{request.name || 'Unknown'}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{request.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        request.status === 'Completed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                        request.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[var(--text-secondary)] mb-2">
                      <span><strong>Service:</strong> {request.service}</span>
                      <span><strong>Budget:</strong> {request.budget || 'Not specified'}</span>
                      <span><strong>Timeline:</strong> {request.timeline || 'Not specified'}</span>
                      <span><strong>Phone:</strong> {request.phone || 'Not specified'}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                      <strong>Description:</strong> {request.description}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {view === 'users' && (
          <motion.div
            className="p-6 rounded-2xl glass-strong shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">User Management ({registeredUsers.length} total)</h2>
              <button onClick={() => setView('dashboard')} className="text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">
                Back to Dashboard
              </button>
            </div>
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
        )}
      </div>
    </div>
  );
}
