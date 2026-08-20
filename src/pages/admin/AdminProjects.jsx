import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaChevronRight, FaCheck, FaTimes, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import PanelHeader from '../../components/PanelHeader';
import StatusBadge from '../../components/StatusBadge';
import ProfileAvatar from '../../components/ProfileAvatar';
import { useProfilePicsByEmail } from '../../hooks/useProfilePics';

const variantConfig = {
  active: {
    title: 'Active Projects',
    subtitle: 'Projects accepted by the admin and still in progress',
    statuses: ['Accepted', 'In Progress'],
    empty: 'No active projects yet.',
    button: { label: 'Submit Project', path: (id) => `/admin/projects/submit/${id}` },
  },
  pending: {
    title: 'Pending Requests',
    subtitle: 'Projects awaiting admin review',
    statuses: ['Pending'],
    empty: 'No pending requests yet.',
  },
  finished: {
    title: 'Finished Projects',
    subtitle: 'Completed projects',
    statuses: ['Completed'],
    empty: 'No finished projects yet.',
    button: { label: 'View Project', path: (id) => `/admin/projects/view/${id}` },
  },
};

// eslint-disable-next-line react/prop-types
export default function AdminProjects({ variant = 'active' }) {
  const { currentUser, getDesignRequests, rejectDesignRequest, ADMIN_EMAIL } = useAuth();
  const navigate = useNavigate();
  const [designRequests, setDesignRequests] = useState([]);
  const profilePicsByEmail = useProfilePicsByEmail();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [confirmRejectReason, setConfirmRejectReason] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const config = variantConfig[variant] || variantConfig.active;
  const projects = designRequests.filter((r) => config.statuses.includes(r.status));

  useEffect(() => {
    if (currentUser?.email === ADMIN_EMAIL) {
      getDesignRequests().then(setDesignRequests);
    }
  }, [currentUser, getDesignRequests, ADMIN_EMAIL]);

  function showToast(type, message) {
    setToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  async function handleConfirmReject() {
    if (!confirmRejectId || !confirmRejectReason.trim()) return;
    const ok = await rejectDesignRequest(confirmRejectId, confirmRejectReason.trim());
    if (ok) {
      setDesignRequests((prev) =>
        prev.map((r) =>
          r.id === confirmRejectId
            ? { ...r, status: 'Rejected', rejectReason: confirmRejectReason.trim(), rejectedAt: new Date().toISOString() }
            : r
        )
      );
      showToast('success', 'Request rejected successfully.');
    } else {
      showToast('error', 'Failed to reject request. Please try again.');
    }
    setConfirmRejectId(null);
    setConfirmRejectReason('');
  }

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <PanelHeader title={config.title} subtitle={config.subtitle}>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaClipboardList size={14} />
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </div>
      </PanelHeader>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8 overflow-hidden">
        <motion.div
          className="p-4 sm:p-6 rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {config.title} ({projects.length})
          </h2>
          <div className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                {config.empty}
              </p>
            ) : (
              projects.map((request) => (
                <div
                  key={request.id}
                  className="p-3 sm:p-4 rounded-xl overflow-hidden"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <ProfileAvatar
                        src={profilePicsByEmail[request.email?.toLowerCase()]}
                        alt={request.name || 'Client'}
                        size={32}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{request.name || 'Unknown'}</p>
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                          {request.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={request.status} />
                      {variant === 'active' && (
                        <span
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={
                            request.halfPaid
                              ? { background: '#10b9811a', color: '#10b981', border: '1px solid #10b98133' }
                              : { background: '#f59e0b1a', color: '#f59e0b', border: '1px solid #f59e0b33' }
                          }
                        >
                          {request.halfPaid ? <FaCheckCircle className="text-[8px]" /> : <FaTimesCircle className="text-[8px]" />}
                          {request.halfPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] mb-1.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="truncate"><strong>Service:</strong> {request.service}</span>
                    <span className="truncate"><strong>Budget:</strong> {request.budget || 'N/A'}</span>
                    <span className="truncate"><strong>Timeline:</strong> {request.timeline || 'N/A'}</span>
                    <span className="truncate"><strong>Phone:</strong> {request.phone || 'N/A'}</span>
                  </div>
                  <p className="text-[10px] mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    <strong>Description:</strong> {request.description}
                  </p>

                  {(request.status === 'Accepted' || request.status === 'In Progress') && (
                    <div className="mt-1.5 text-[10px] space-y-0.5" style={{ color: '#059669' }}>
                      <p><strong>Price:</strong> ₦{request.standardPrice?.toLocaleString()}</p>
                      {request.adminComment && <p className="line-clamp-1"><strong>Comment:</strong> {request.adminComment}</p>}
                      {variant === 'active' && !request.halfPaid && (
                        <p style={{ color: '#f59e0b' }}>
                          <strong>Payment:</strong> Awaiting first payment (50% — ₦{((Number(request.standardPrice) || 0) / 2).toLocaleString()})
                        </p>
                      )}
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between mt-2 pt-2"
                    style={{ borderTop: '1px solid var(--border-default)' }}
                  >
                    <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    {variant === 'pending' ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/projects/reply/${request.id}`)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md text-white transition-all duration-200 cursor-pointer pressable"
                          style={{ background: '#059669' }}
                        >
                          <FaCheck /> Accept
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(rejectingId === request.id ? null : request.id);
                            setRejectReason('');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md text-white transition-all duration-200 cursor-pointer pressable"
                          style={{ background: '#dc2626' }}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => navigate(config.button.path(request.id))}
                        disabled={variant === 'active' && !request.halfPaid}
                        className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-md transition-all duration-200 cursor-pointer pressable disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={
                          variant === 'active'
                            ? request.halfPaid
                              ? { background: '#059669', color: '#ffffff' }
                              : { background: '#9ca3af', color: '#ffffff' }
                            : { background: 'var(--color-accent-light)', color: 'var(--color-accent)' }
                        }
                        title={variant === 'active' && !request.halfPaid ? 'Client has not made the first payment yet' : ''}
                      >
                        {config.button.label} <FaChevronRight className="text-[8px]" />
                      </button>
                    )}
                  </div>

                  {variant === 'pending' && rejectingId === request.id && (
                    <div
                      className="mt-2 p-2.5 rounded-lg"
                      style={{
                        background: 'hsl(0 84% 60% / 0.06)',
                        border: '1px solid hsl(0 84% 60% / 0.2)',
                      }}
                    >
                      <label
                        className="block text-[10px] font-medium mb-1.5"
                        style={{ color: '#dc2626' }}
                      >
                        Reason for rejection
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter reason..."
                        className="w-full px-2.5 py-1.5 text-[11px] rounded-lg resize-none"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                        rows={2}
                      />
                      <div className="flex justify-end gap-1.5 mt-1.5">
                        <button
                          onClick={() => setRejectingId(null)}
                          className="px-2.5 py-1 text-[10px] font-medium rounded-md transition-all duration-200 cursor-pointer pressable"
                          style={{
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            if (rejectReason.trim()) {
                              setConfirmRejectId(request.id);
                              setConfirmRejectReason(rejectReason);
                            }
                          }}
                          disabled={!rejectReason.trim()}
                          className="px-2.5 py-1 text-[10px] font-medium rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer pressable"
                          style={{ background: '#dc2626' }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {confirmRejectId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setConfirmRejectId(null)}
            />
            <motion.div
              className="relative rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'hsl(0 84% 60% / 0.12)' }}
              >
                <FaExclamationTriangle className="text-3xl" style={{ color: '#dc2626' }} />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Confirm Rejection
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Please confirm, you are about to reject this request
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmRejectId(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer pressable"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl text-white transition-all duration-200 cursor-pointer pressable"
                  style={{ background: '#dc2626' }}
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 right-6 z-[90] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium text-white"
            style={{ background: toast.type === 'success' ? '#059669' : '#dc2626' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
