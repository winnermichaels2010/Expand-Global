import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCreditCard, FaLock, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';
import { loadPaystackScript } from '../lib/paystack';

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, getDesignRequests, initializePayment, verifyPayment } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const requestRef = useRef(null);

  useEffect(() => {
    requestRef.current = request;
  }, [request]);

  const handleSuccessRedirect = useCallback(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate('/active-requests'), 3000);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  useEffect(() => {
    const cleanup = handleSuccessRedirect();
    return cleanup;
  }, [handleSuccessRedirect]);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const requests = await getDesignRequests();
        const req = requests.find((r) => r.id === id);
        if (!req || req.email !== currentUser?.email) {
          setRequest(null);
        } else {
          setRequest(req);
        }
      } catch (err) {
        console.error('Failed to fetch request:', err);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) fetchRequest();
  }, [id, currentUser, getDesignRequests]);

  async function handlePayment() {
    if (!request || processing || success) return;
    setError('');

    if (!PAYSTACK_KEY) {
      setError('Payment is not configured. Please contact the admin.');
      return;
    }

    const price = Number(request.standardPrice);
    if (!price || !Number.isFinite(price) || price <= 0) {
      setError('Project price is not set or invalid. Please contact the admin.');
      return;
    }

    setProcessing(true);

    try {
      const initData = await initializePayment(request.id, 'half');
      if (!initData) {
        setError('Failed to initialize payment. Please try again.');
        setProcessing(false);
        return;
      }
      if (initData.already_paid) {
        setSuccess(true);
        setProcessing(false);
        return;
      }

      if (!initData.reference) {
        setError('Payment initialization returned incomplete data. Please try again.');
        setProcessing(false);
        return;
      }

      const PaystackPop = await loadPaystackScript();
      if (!PaystackPop) {
        setError('Failed to load payment gateway. Please refresh and try again.');
        setProcessing(false);
        return;
      }

      const handler = PaystackPop.setup({
        key: PAYSTACK_KEY,
        email: currentUser.email,
        amount: initData.amount_kobo,
        currency: 'NGN',
        ref: initData.reference,
        metadata: {
          custom_fields: [
            {
              display_name: 'Project',
              variable_name: 'project',
              value: request.service,
            },
            {
              display_name: 'Request ID',
              variable_name: 'request_id',
              value: request.id,
            },
          ],
        },
        onClose: function () {
          setProcessing(false);
        },
        callback: function (response) {
          if (response.status === 'success') {
            verifyPayment(response.reference)
              .then(function (verifyResult) {
                if (verifyResult && verifyResult.success) {
                  setSuccess(true);
                } else {
                  setError(
                    'Payment received but verification failed. Reference: ' +
                      response.reference +
                      '. Contact support.'
                  );
                  setProcessing(false);
                }
              })
              .catch(function () {
                setError(
                  'Payment received but verification failed. Reference: ' +
                    response.reference +
                    '. Contact support.'
                );
                setProcessing(false);
              });
          } else {
            setError('Payment was not completed. Please try again.');
            setProcessing(false);
          }
        },
      });
      handler.openIframe();
    } catch (err) {
      console.error('Payment error:', err);
      const msg = err?.message || 'Unknown error';
      if (msg.includes('already')) {
        setSuccess(true);
      } else if (msg.includes('not configured') || msg.includes('PAYSTACK')) {
        setError('Payment system is not configured. Please contact the admin.');
      } else if (msg.includes('not authenticated') || msg.includes('Unauthorized')) {
        setError('Your session expired. Please log in again.');
      } else if (msg.includes('not eligible') || msg.includes('not been set')) {
        setError(msg + '. Please contact the admin.');
      } else {
        setError('Could not start payment: ' + msg);
      }
      setProcessing(false);
    }
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
        <p style={{ color: 'var(--text-secondary)' }}>Request not found.</p>
      </div>
    );
  }

  if (request.halfPaid) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <PanelHeader
          title="Payment Complete"
          subtitle="Your first payment has been received"
          onBack={() => navigate('/active-requests')}
          backLabel="Back to Active Requests"
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
          <motion.div
            className="p-8 rounded-2xl  text-center"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: '#10b9811a' }}
            >
              <FaCheckCircle className="text-3xl" style={{ color: '#10b981' }} />
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Payment Already Completed
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              You have already made the first payment for this project. The admin is now working on your design.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Redirecting to Active Requests in 3 seconds...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const price = Number(request.standardPrice) || 0;
  const halfPrice = price / 2;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Complete Payment"
        subtitle="Pay 50% now to start your design project"
        onBack={() => navigate('/active-requests')}
        backLabel="Back to Active Requests"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-6 rounded-2xl "
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            Project Details
          </h2>

          <div
            className="p-4 rounded-xl mb-6 space-y-2"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}
          >
            <div className="grid grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span><strong>Service:</strong> {request.service}</span>
              <span><strong>Phone:</strong> {request.phone || 'Not specified'}</span>
              <span><strong>Timeline:</strong> {request.timeline || 'Not specified'}</span>
              <span><strong>Budget:</strong> {request.budget || 'Not specified'}</span>
            </div>
            {request.description && (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <strong>Description:</strong> {request.description}
              </p>
            )}
          </div>

          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            Payment Breakdown
          </h2>

          <div className="space-y-3 mb-6">
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Total Project Price</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Full amount for the design</p>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {'\u20A6'}{price.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-px h-4" style={{ background: 'var(--border-default)' }} />
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: '#0596691a', border: '1px solid #05966933' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#059669' }}>Pay Now (50%)</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  First installment to begin the project
                </p>
              </div>
              <span className="text-lg font-bold" style={{ color: '#059669' }}>
                {'\u20A6'}{halfPrice.toLocaleString()}
              </span>
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Remaining (50%)</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  Pay after the admin submits the finished design
                </p>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>
                {'\u20A6'}{halfPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div
            className="p-4 rounded-xl mb-6 text-xs"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
          >
            <p className="mb-1"><strong>How it works:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Pay 50% of the project price now to confirm your order.</li>
              <li>The admin will work on your design and submit the finished result.</li>
              <li>The remaining 50% is payable when you download the final design.</li>
            </ol>
          </div>

          {error && (
            <div
              className="p-3 rounded-xl mb-4 text-sm text-center"
              style={{ background: '#dc26261a', color: '#dc2626', border: '1px solid #dc262633' }}
            >
              {error}
            </div>
          )}

          {success ? (
            <div
              className="p-6 rounded-xl text-center"
              style={{ background: '#10b9811a', border: '1px solid #10b98133' }}
            >
              <FaCheckCircle className="text-3xl mx-auto mb-3" style={{ color: '#10b981' }} />
              <p className="text-sm font-medium mb-1" style={{ color: '#10b981' }}>Payment Successful!</p>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                Your first payment has been recorded. The admin will now work on your design.
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Redirecting to Active Requests in 3 seconds...
              </p>
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer pressable"
              style={{ background: '#059669' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#047857'; }}
              onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#059669'; }}
            >
              {processing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay {'\u20A6'}{halfPrice.toLocaleString()} Now
                </>
              )}
            </button>
          )}

          <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            <FaLock size={10} />
            <span>Secured by Paystack</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
