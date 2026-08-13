import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPalette, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import PanelHeader from '../../components/PanelHeader';

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

  const statusCounts = {
    Pending: designRequests.filter((r) => r.status === 'Pending').length,
    'In Progress': designRequests.filter((r) => r.status === 'In Progress').length,
    Accepted: designRequests.filter((r) => r.status === 'Accepted').length,
    Completed: designRequests.filter((r) => r.status === 'Completed').length,
    Rejected: designRequests.filter((r) => r.status === 'Rejected').length,
  };
  const statusColors = {
    Pending: '#f59e0b',
    'In Progress': '#2563eb',
    Accepted: '#8b5cf6',
    Completed: '#059669',
    Rejected: '#dc2626',
  };
  const statusEntries = Object.entries(statusCounts).filter(([, count]) => count > 0);
  const maxCount = Math.max(1, ...statusEntries.map(([, count]) => count));

  let acc = 0;
  const donutStops = designRequests.length
    ? statusEntries.map(([status, count]) => {
        const from = (acc / designRequests.length) * 100;
        acc += count;
        const to = (acc / designRequests.length) * 100;
        return `${statusColors[status]} ${from}% ${to}%`;
      })
    : [];
  const donutGradient =
    designRequests.length === 0
      ? 'conic-gradient(hsl(247 12% 85%) 0% 100%)'
      : `conic-gradient(${donutStops.join(', ')})`;

  const userActivePct = registeredUsers.length ? (activeUsers.length / registeredUsers.length) * 100 : 0;

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
      <PanelHeader
        title="Dashboard"
        subtitle={`Welcome back, ${currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin'}`}
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Admin
        </div>
      </PanelHeader>

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

      <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 p-6 rounded-2xl glass-strong"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Requests by Status
            </h2>
            {designRequests.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: 'var(--text-secondary)' }}>
                No design requests yet.
              </p>
            ) : (
              <>
                <div className="flex items-end gap-3 h-44">
                  {statusEntries.map(([status, count]) => (
                    <div key={status} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                        {count}
                      </span>
                      <div
                        className="w-full max-w-12 rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${Math.max(Math.round((count / maxCount) * 136), 6)}px`,
                          background: statusColors[status],
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  {statusEntries.map(([status]) => (
                    <div key={status} className="flex-1 text-center">
                      <span className="label-caps">{status}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            className="p-6 rounded-2xl glass-strong"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="text-lg font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Distribution
            </h2>
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-40 h-40 rounded-full" style={{ background: donutGradient }}>
                <div
                  className="absolute inset-3 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--bg-elevated)' }}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold">{designRequests.length}</p>
                    <p className="label-caps">Total</p>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-2">
                {statusEntries.length === 0 ? (
                  <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                    No data yet.
                  </p>
                ) : (
                  statusEntries.map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: statusColors[status] }} />
                        {status}
                      </span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="w-full pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                <p className="label-caps mb-3">Users</p>
                <div className="flex h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div style={{ width: `${userActivePct}%`, background: '#10b981' }} />
                  <div style={{ width: `${100 - userActivePct}%`, background: '#dc2626' }} />
                </div>
                <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>{activeUsers.length} active</span>
                  <span>{registeredUsers.length - activeUsers.length} inactive</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-8">
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
