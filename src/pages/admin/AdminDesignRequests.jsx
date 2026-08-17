import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaExclamationTriangle, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import PanelHeader from '../../components/PanelHeader';
import ProfileAvatar from '../../components/ProfileAvatar';
import { useProfilePicsByEmail } from '../../hooks/useProfilePics';

export default function AdminDesignRequests() {
  const { currentUser, getDesignRequests, rejectDesignRequest, ADMIN_EMAIL } = useAuth();
  const [designRequests, setDesignRequests] = useState([]);
  const profilePicsByEmail = useProfilePicsByEmail();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [confirmRejectReason, setConfirmRejectReason] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const navigate = useNavigate();

  function showToast(type, message) {
    setToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    if (currentUser?.email === ADMIN_EMAIL) {
      getDesignRequests().then(setDesignRequests);
    }
  }, [currentUser, getDesignRequests, ADMIN_EMAIL]);

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

  const getStatusBadge = (status) => {
    const styles = {
      Pending: { background: 'hsl(247 12% 50% / 0.12)', color: 'var(--color-accent)' },
      'In Progress': { background: 'hsl(217 91% 60% / 0.12)', color: '#2563eb' },
      Completed: { background: 'hsl(160 84% 39% / 0.12)', color: '#059669' },
      Rejected: { background: 'hsl(0 84% 60% / 0.12)', color: '#dc2626' },
    };
    return styles[status] || styles.Pending;
  };

  const activeRequests = designRequests.filter((r) => r.status !== 'Rejected');

  return (
    <div className="min-h-screen overflow-x-hidden">
      <PanelHeader
        title="Design Requests"
        subtitle="Review and manage design requests"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaClipboardList size={14} />
          {activeRequests.length} total
        </div>
      </PanelHeader>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8 overflow-hidden">
        <motion.div
          className="p-4 sm:p-6 rounded-2xl glass-strong overflow-hidden"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Design Requests ({activeRequests.length})
          </h2>
              <div className="space-y-3">
                {activeRequests.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                    No design requests yet.
                  </p>
                ) : (
                  [...activeRequests].reverse().map((request) => (
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
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={getStatusBadge(request.status)}
                        >
                          {request.status}
                        </span>
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

                      {request.status === 'Rejected' && request.rejectReason && (
                        <p className="text-[10px] mt-1 line-clamp-2" style={{ color: '#dc2626' }}>
                          <strong>Reject Reason:</strong> {request.rejectReason}
                        </p>
                      )}

                      {request.status === 'Accepted' && (
                        <div className="mt-1.5 text-[10px] space-y-0.5" style={{ color: '#059669' }}>
                          <p><strong>Price:</strong> ₦{request.standardPrice?.toLocaleString()}</p>
                          {request.adminComment && <p className="line-clamp-1"><strong>Comment:</strong> {request.adminComment}</p>}
                        </div>
                      )}

                      <div
                        className="flex items-center justify-between mt-2 pt-2"
                        style={{ borderTop: '1px solid var(--border-default)' }}
                      >
                        <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-1.5">
                          {request.status !== 'Rejected' && request.status !== 'Accepted' && (
                            <>
                              <button
                                onClick={() => navigate(`/admin/design-requests/reply/${request.id}`)}
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
                            </>
                          )}
                        </div>
                      </div>

                      {rejectingId === request.id && (
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
        {confirmRejectId && (          <motion.div
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
                Please confirm, you are about to reject request
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
