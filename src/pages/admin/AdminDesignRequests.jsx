import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaReply, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AdminDesignRequests() {
  const { currentUser, getDesignRequests, rejectDesignRequest, ADMIN_EMAIL } = useAuth();
  const [designRequests, setDesignRequests] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [confirmRejectReason, setConfirmRejectReason] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.email === ADMIN_EMAIL) {
      getDesignRequests().then(setDesignRequests);
    }
  }, [currentUser, getDesignRequests, ADMIN_EMAIL]);

  async function handleConfirmReject() {
    if (!confirmRejectId || !confirmRejectReason.trim()) return;
    await rejectDesignRequest(confirmRejectId, confirmRejectReason.trim());
    setDesignRequests((prev) =>
      prev.map((r) =>
        r.id === confirmRejectId
          ? { ...r, status: 'Rejected', rejectReason: confirmRejectReason.trim(), rejectedAt: new Date().toISOString() }
          : r
      )
    );
    setConfirmRejectId(null);
    setConfirmRejectReason('');
  }

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      'In Progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      Completed: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      Rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return styles[status] || styles.Pending;
  };

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
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Design Requests</h1>
            <p className="text-purple-200/80">Review and manage design requests</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-6">All Design Requests ({designRequests.length})</h2>
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
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusBadge(request.status)}`}>
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

                  {request.status === 'Rejected' && request.rejectReason && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                      <strong>Reject Reason:</strong> {request.rejectReason}
                    </p>
                  )}

                  {request.status === 'Accepted' && (
                    <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 space-y-1">
                      <p><strong>Standard Price:</strong> ₦{request.standardPrice?.toLocaleString()}</p>
                      <p><strong>Premium Price:</strong> ₦{request.premiumPrice?.toLocaleString()}</p>
                      {request.adminComment && <p><strong>Admin Comment:</strong> {request.adminComment}</p>}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      {request.status !== 'Rejected' && request.status !== 'Accepted' && (
                        <>
                          <button
                            onClick={() => navigate(`/admin/design-requests/reply/${request.id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200 cursor-pointer"
                          >
                            <FaReply /> Reply
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(rejectingId === request.id ? null : request.id);
                              setRejectReason('');
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 cursor-pointer"
                          >
                            <FaTimes /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {rejectingId === request.id && (
                    <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                      <label className="block text-xs font-medium text-red-700 dark:text-red-300 mb-2">
                        Reason for rejection
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter the reason for rejecting this request..."
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setRejectingId(null)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-200 dark:bg-gray-700 text-[var(--text-secondary)] hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
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
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                        >
                          Reject Project
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmRejectId(null)} />
            <motion.div
              className="relative bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-color)] p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Confirm Rejection</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Please confirm, you are about to reject request
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmRejectId(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-200 dark:bg-gray-700 text-[var(--text-secondary)] hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all duration-200 cursor-pointer"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
