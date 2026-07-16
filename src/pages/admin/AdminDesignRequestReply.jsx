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
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Design request not found.</p>
      </div>
    );
  }

  const standard = parseFloat(standardPrice);
  const premium = parseFloat(premiumPrice);
  const isValid = !isNaN(standard) && standard > 0 && !isNaN(premium) && premium > 0;

  return (
    <div className="min-h-screen">
      <div style={{ background: 'var(--color-accent)' }}>
        <div className="px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate('/admin/design-requests')}
              className="flex items-center gap-2 mb-4 cursor-pointer transition-colors duration-200"
              style={{ color: 'var(--color-accent-light)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-accent-light)'; }}
            >
              <FaArrowLeft /> Back to Design Requests
            </button>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Reply to Request
            </h1>
            <p style={{ color: 'var(--color-accent-light)' }}>
              Review project details and set pricing
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8 max-w-3xl mx-auto">
        <motion.div
          className="p-6 rounded-2xl glass-strong"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Project Details
          </h2>
          <div
            className="p-4 rounded-xl mb-6 space-y-3"
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
                  {request.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span><strong>Service:</strong> {request.service}</span>
              <span><strong>Phone:</strong> {request.phone || 'Not specified'}</span>
              <span><strong>Timeline:</strong> {request.timeline || 'Not specified'}</span>
              <span><strong>Budget:</strong> {request.budget || 'Not specified'}</span>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <strong>Description:</strong>
              </p>
              <p className="text-sm mt-1">{request.description}</p>
            </div>
          </div>

          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Set Project Pricing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Standard Price (₦)
              </label>
              <input
                type="number"
                value={standardPrice}
                onChange={(e) => setStandardPrice(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-4 py-2.5 text-sm rounded-xl input-base"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                min="0"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Premium Price (₦)
              </label>
              <input
                type="number"
                value={premiumPrice}
                onChange={(e) => setPremiumPrice(e.target.value)}
                placeholder="e.g. 100000"
                className="w-full px-4 py-2.5 text-sm rounded-xl input-base"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                min="0"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Comment <span style={{ color: 'var(--text-tertiary)' }}>(optional)</span>
            </label>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Add a comment or clarification about the project..."
              className="w-full px-4 py-2.5 text-sm rounded-xl resize-none input-base"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
              rows={4}
            />
          </div>

          <div
            className="flex items-center justify-between pt-4"
            style={{ borderTop: '1px solid var(--border-default)' }}
          >
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isValid && (
                <span className="font-medium" style={{ color: '#059669' }}>
                  Prices set: ₦{standard.toLocaleString()} / ₦{premium.toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/design-requests')}
                className="px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer pressable"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={!isValid || submitting}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer pressable"
                style={{ background: '#059669' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.background = '#047857';
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) e.currentTarget.style.background = '#059669';
                }}
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
