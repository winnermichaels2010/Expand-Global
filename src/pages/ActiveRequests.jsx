import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpinner, FaCreditCard, FaClock, FaCommentDots } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';
import MessageThread from '../components/MessageThread';

export default function ActiveRequests() {
  const { currentUser, subscribeToDesignRequests } = useAuth();
  const navigate = useNavigate();
  const [designRequests, setDesignRequests] = useState([]);
  const [openThreadId, setOpenThreadId] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToDesignRequests((requests) => {
      setDesignRequests(
        requests.filter(
          (r) =>
            r.email === currentUser.email &&
            r.status === 'Accepted' &&
            r.standardPrice
        )
      );
    });
    return unsub;
  }, [currentUser, subscribeToDesignRequests]);

  const active = [...designRequests].reverse();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Active Requests"
        subtitle="Design requests accepted by admin — complete payment to proceed"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaSpinner size={14} />
          {active.length} {active.length === 1 ? 'active' : 'active'}
        </div>
      </PanelHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-5 sm:p-6 rounded-2xl glass-strong"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {active.length === 0 ? (
            <div className="text-center py-16">
              <FaSpinner className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No active requests yet. When the admin accepts your design request, it will appear here.
              </p>
              <button
                onClick={() => navigate('/request-design')}
                className="mt-5 px-5 py-2.5 text-sm font-semibold rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer pressable"
                style={{ background: 'var(--color-accent)' }}
              >
                Request a Design
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {active.map((req) => {
                const price = Number(req.standardPrice) || 0;
                const halfPrice = price / 2;

                return (
                  <motion.div
                    key={req.id}
                    className="relative p-5 rounded-xl transition-all duration-300 hover-lift"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span
                      className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full"
                      style={{ background: '#f59e0b' }}
                    />
                    <div className="flex items-start justify-between mb-3 pl-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{req.service}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          Accepted on{' '}
                          {req.repliedAt
                            ? new Date(req.repliedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
                            : new Date(req.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium flex-shrink-0"
                        style={{ background: '#f59e0b1a', color: '#f59e0b', border: '1px solid #f59e0b33' }}
                      >
                        <FaClock className="text-xs" />
                        Active
                      </span>
                    </div>

                    {req.adminComment && (
                      <p className="text-xs mb-3 pl-2" style={{ color: 'var(--text-secondary)' }}>
                        <strong>Admin note:</strong> {req.adminComment}
                      </p>
                    )}

                    <div
                      className="rounded-xl p-4 mb-3 pl-2"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                          Project Price
                        </span>
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          ₦{price.toLocaleString()}
                        </span>
                      </div>
                      {!req.halfPaid && (
                        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          <span>First payment (50%)</span>
                          <span className="font-medium">₦{halfPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pl-2">
                      {!req.halfPaid ? (
                        <button
                          onClick={() => navigate(`/payment/${req.id}`)}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl text-white transition-all duration-200 cursor-pointer pressable"
                          style={{ background: '#059669' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; }}
                        >
                          <FaCreditCard />
                          Pay ₦{halfPrice.toLocaleString()} Now
                        </button>
                      ) : (
                        <span
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl"
                          style={{ background: '#10b9811a', color: '#10b981', border: '1px solid #10b98133' }}
                        >
                          <FaCreditCard />
                          First Payment Completed
                        </span>
                      )}
                      <button
                        onClick={() => setOpenThreadId(openThreadId === req.id ? null : req.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer pressable"
                        style={{
                          background: openThreadId === req.id ? 'var(--color-accent)' : 'var(--color-accent-light)',
                          color: openThreadId === req.id ? '#fff' : 'var(--color-accent)',
                          border: '1px solid ' + (openThreadId === req.id ? 'transparent' : 'hsl(262 60% 80%)'),
                        }}
                      >
                        <FaCommentDots />
                        {openThreadId === req.id ? 'Hide' : 'Message'}
                      </button>
                    </div>

                    {openThreadId === req.id && (
                      <div className="pl-2 mt-3">
                        <MessageThread designRequestId={req.id} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
