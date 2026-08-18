import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaTimes, FaClipboardList, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';

export default function RejectedProjects() {
  const { currentUser, subscribeToDesignRequests } = useAuth();
  const navigate = useNavigate();
  const [designRequests, setDesignRequests] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToDesignRequests((requests) => {
      setDesignRequests(
        requests.filter((r) => r.email === currentUser.email && r.status === 'Rejected')
      );
    });
    return unsub;
  }, [currentUser, subscribeToDesignRequests]);

  const rejected = [...designRequests].reverse();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Rejected Requests"
        subtitle="Design requests that were declined by the admin"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaClipboardList size={14} />
          {rejected.length} {rejected.length === 1 ? 'request' : 'requests'}
        </div>
      </PanelHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-5 sm:p-6 rounded-2xl "
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {rejected.length === 0 ? (
            <div className="text-center py-16">
              <FaTimesCircle className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No rejected requests yet.
              </p>
              <button
                onClick={() => navigate('/request-design')}
                className="mt-5 px-5 py-2.5 text-sm font-semibold rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer pressable"
                style={{ background: 'var(--color-accent)' }}
              >
                <FaPaperPlane className="mr-2 rotate-45 inline" />
                Request a Design
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {rejected.map((req) => (
                <motion.div
                  key={req.id}
                  className="relative p-5 rounded-xl transition-all duration-300 hover-lift"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid hsl(0 84% 60% / 0.25)',
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span
                    className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full"
                    style={{ background: '#ef4444' }}
                  />
                  <div className="flex items-start justify-between mb-3 pl-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{req.service}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Requested on{' '}
                        {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span
                      className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium flex-shrink-0"
                      style={{ background: '#ef44441a', color: '#ef4444', border: '1px solid #ef444433' }}
                    >
                      <FaTimes className="text-xs" />
                      Rejected
                    </span>
                  </div>

                  <div
                    className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-3 pl-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="truncate"><strong>Timeline:</strong> {req.timeline || 'N/A'}</span>
                    <span className="truncate"><strong>Budget:</strong> {req.budget || 'N/A'}</span>
                    <span className="truncate"><strong>Phone:</strong> {req.phone || 'N/A'}</span>
                  </div>

                  <p className="text-xs mb-3 pl-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {req.description}
                  </p>

                  <div
                    className="p-3 rounded-lg text-xs mb-3 pl-2"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
                  >
                    <p className="font-medium mb-1" style={{ color: '#ef4444' }}>Rejection Reason:</p>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {req.rejectReason || 'Not provided'}
                    </p>
                    {req.rejectedAt && (
                      <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                        Rejected on {new Date(req.rejectedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <button
                      onClick={() => navigate('/request-design')}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer pressable"
                      style={{
                        background: 'var(--color-accent-light)',
                        color: 'var(--color-accent)',
                        border: '1px solid hsl(262 60% 80%)',
                      }}
                    >
                      <FaPaperPlane className="rotate-45" />
                      Resubmit Request
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
