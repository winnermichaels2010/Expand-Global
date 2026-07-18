import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPalette, FaUsers, FaCheck, FaClock, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { currentUser, getDesignRequests, getRegisteredUsers, ADMIN_EMAIL } = useAuth();
  const navigate = useNavigate();
  const [designRequests, setDesignRequests] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    getDesignRequests().then(setDesignRequests);
    getRegisteredUsers().then(setRegisteredUsers);
  }, [getDesignRequests, getRegisteredUsers]);

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  const activeUsers = registeredUsers.filter((u) => u.active !== false);
  const pendingRequests = designRequests.filter((r) => r.status === 'Pending');
  const finishedRequests = designRequests.filter((r) => r.status === 'Accepted');

  const statCards = [
    {
      label: 'Total Design Requests',
      value: designRequests.length,
      icon: FaPalette,
      iconBg: 'var(--color-accent)',
    },
    {
      label: 'Pending Requests',
      value: pendingRequests.length,
      icon: FaClock,
      iconBg: '#f59e0b',
    },
    {
      label: 'Finished Projects',
      value: finishedRequests.length,
      icon: FaCheckCircle,
      iconBg: '#10b981',
    },
    {
      label: 'Active Users',
      value: activeUsers.length,
      icon: FaUsers,
      iconBg: '#2563eb',
    },
  ];

  const recentRequests = designRequests.slice(-5).reverse();
  const displayRequests = activeTab === 'recent' ? recentRequests : finishedRequests;

  const tabs = [
    { id: 'recent', label: 'Recent Requests' },
    { id: 'finished', label: 'Finished Projects' },
  ];

  return (
    <div className="min-h-screen">
      <div style={{ background: 'var(--color-accent)' }}>
        <div className="px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Dashboard
            </h1>
            <p style={{ color: 'var(--color-accent-light)' }}>
              Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate="visible"
        >
          {statCards.map((card) => (
            <motion.div
              key={card.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="p-5 rounded-2xl glass-strong hover-lift"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: card.iconBg }}
              >
                <card.icon className="text-white text-lg" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="label-caps mt-1">{card.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              className="p-6 rounded-2xl glass-strong"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer relative"
                    style={{
                      color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--text-secondary)',
                    }}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ background: 'var(--color-accent)' }}
                        layoutId="activeTab"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {displayRequests.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                    {activeTab === 'recent' ? 'No design requests yet.' : 'No finished projects yet.'}
                  </p>
                ) : (
                  displayRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-xl hover-lift"
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-default)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: 'var(--color-accent)' }}
                        >
                          {request.name?.split(' ').map(n => n[0]).join('') || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{request.name || 'Unknown'}</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {request.service}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background:
                              request.status === 'Completed' ? 'hsl(160 84% 39% / 0.12)' :
                              request.status === 'In Progress' ? 'hsl(217 91% 60% / 0.12)' :
                              request.status === 'Accepted' ? 'hsl(160 84% 39% / 0.12)' :
                              request.status === 'Rejected' ? 'hsl(0 84% 60% / 0.12)' :
                              'hsl(247 12% 50% / 0.12)',
                            color:
                              request.status === 'Completed' ? '#059669' :
                              request.status === 'In Progress' ? '#2563eb' :
                              request.status === 'Accepted' ? '#059669' :
                              request.status === 'Rejected' ? '#dc2626' :
                              'var(--color-accent)',
                          }}
                        >
                          {request.status}
                        </span>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              className="p-6 rounded-2xl glass-strong"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2
                className="text-lg font-semibold mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Quick Links
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/design-requests')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover-lift pressable text-left cursor-pointer"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-accent-muted)' }}
                  >
                    <FaPalette style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Design Requests</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {designRequests.length} total
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover-lift pressable text-left cursor-pointer"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'hsl(217 91% 60% / 0.12)' }}
                  >
                    <FaUsers style={{ color: '#2563eb' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Manage Users</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {activeUsers.length} active
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
