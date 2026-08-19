import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';

export default function HalfPaidRequests() {
  const { currentUser, subscribeToDesignRequests } = useAuth();
  const navigate = useNavigate();
  const [designRequests, setDesignRequests] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToDesignRequests((requests) => {
      setDesignRequests(
        requests.filter(
          (r) =>
            r.email === currentUser.email &&
            r.halfPaid === true &&
            r.status !== 'Completed' &&
            r.status !== 'Rejected'
        )
      );
    });
    return unsub;
  }, [currentUser, subscribeToDesignRequests]);

  const halfPaid = [...designRequests].reverse();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Half Paid Requests"
        subtitle="Projects where you have completed the first 50% payment"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaMoneyBillWave size={14} />
          {halfPaid.length} {halfPaid.length === 1 ? 'request' : 'requests'}
        </div>
      </PanelHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-5 sm:p-6 rounded-2xl"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {halfPaid.length === 0 ? (
            <div className="text-center py-16">
              <FaMoneyBillWave className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No half paid requests yet. When you complete the first payment on an active request, it will appear here.
              </p>
              <button
                onClick={() => navigate('/active-requests')}
                className="mt-5 px-5 py-2.5 text-sm font-semibold rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer pressable"
                style={{ background: 'var(--color-accent)' }}
              >
                View Active Requests
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {halfPaid.map((req) => {
                const price = Number(req.standardPrice) || 0;
                const halfPrice = price / 2;
                const isInProgress = req.status === 'In Progress';

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
                      style={{ background: '#10b981' }}
                    />
                    <div className="flex items-start justify-between mb-3 pl-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{req.service}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          Payment made on{' '}
                          {req.repliedAt
                            ? new Date(req.repliedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
                            : new Date(req.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium flex-shrink-0"
                        style={
                          isInProgress
                            ? { background: '#2563eb1a', color: '#2563eb', border: '1px solid #2563eb33' }
                            : { background: '#10b9811a', color: '#10b981', border: '1px solid #10b98133' }
                        }
                      >
                        {isInProgress ? <FaClock className="text-xs" /> : <FaCheckCircle className="text-xs" />}
                        {isInProgress ? 'In Progress' : 'Awaiting Work'}
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
                          Total Project Price
                        </span>
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          ₦{price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs" style={{ color: '#10b981' }}>
                        <span>First Payment (50%) — Paid</span>
                        <span className="font-medium">₦{halfPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        <span>Remaining (50%) — Due on completion</span>
                        <span className="font-medium">₦{halfPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2">
                      <span
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl"
                        style={{ background: '#10b9811a', color: '#10b981', border: '1px solid #10b98133' }}
                      >
                        <FaCreditCard />
                        First Payment Completed
                      </span>
                    </div>
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
