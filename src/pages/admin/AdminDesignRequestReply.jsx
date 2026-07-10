import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../context/AuthContext';

export default function AdminDesignRequestReply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateDesignRequest, ADMIN_EMAIL } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [standardPrice, setStandardPrice] = useState('');
  const [premiumPrice, setPremiumPrice] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const docSnap = await getDoc(doc(db, 'designRequests', id));
        if (docSnap.exists()) {
          setRequest({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Failed to fetch design request:', err);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser?.email === ADMIN_EMAIL) {
      fetchRequest();
    }
  }, [id, currentUser, ADMIN_EMAIL]);

  async function handleAccept() {
    const standard = parseFloat(standardPrice);
    const premium = parseFloat(premiumPrice);
    if (isNaN(standard) || isNaN(premium)) return;
    setSubmitting(true);
    await updateDesignRequest(id, {
      status: 'Accepted',
      standardPrice: standard,
      premiumPrice: premium,
      adminComment: adminComment.trim(),
      repliedAt: new Date().toISOString(),
    });
    setSubmitting(false);
    navigate('/admin/design-requests');
  }

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Design request not found.</p>
      </div>
    );
  }

  const standard = parseFloat(standardPrice);
  const premium = parseFloat(premiumPrice);
  const isValid = !isNaN(standard) && standard > 0 && !isNaN(premium) && premium > 0;

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
            <button
              onClick={() => navigate('/admin/design-requests')}
              className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors duration-200 mb-4 cursor-pointer"
            >
              <FaArrowLeft /> Back to Design Requests
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Reply to Request</h1>
            <p className="text-purple-200/80">Review project details and set pricing</p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8 max-w-3xl mx-auto">
        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold mb-4">Project Details</h2>
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm">
                {request.name?.split(' ').map(n => n[0]).join('') || '?'}
              </div>
              <div>
                <p className="text-sm font-medium">{request.name || 'Unknown'}</p>
                <p className="text-xs text-[var(--text-secondary)]">{request.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
              <span><strong>Service:</strong> {request.service}</span>
              <span><strong>Phone:</strong> {request.phone || 'Not specified'}</span>
              <span><strong>Timeline:</strong> {request.timeline || 'Not specified'}</span>
              <span><strong>Budget:</strong> {request.budget || 'Not specified'}</span>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]"><strong>Description:</strong></p>
              <p className="text-sm mt-1">{request.description}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4">Set Project Pricing</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Standard Price (₦)
              </label>
              <input
                type="number"
                value={standardPrice}
                onChange={(e) => setStandardPrice(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Premium Price (₦)
              </label>
              <input
                type="number"
                value={premiumPrice}
                onChange={(e) => setPremiumPrice(e.target.value)}
                placeholder="e.g. 100000"
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="0"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Comment <span className="text-[var(--text-tertiary)]">(optional)</span>
            </label>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Add a comment or clarification about the project..."
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <div className="text-sm text-[var(--text-secondary)]">
              {isValid && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Prices set: ₦{standard.toLocaleString()} / ₦{premium.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/design-requests')}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gray-200 dark:bg-gray-700 text-[var(--text-secondary)] hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={!isValid || submitting}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                <FaCheckCircle />
                {submitting ? 'Submitting...' : 'Accept & Submit'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
