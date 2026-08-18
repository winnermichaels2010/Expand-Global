import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCreditCard, FaLock, FaCheckCircle, FaSpinner, FaDownload } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';

const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Paystack script timed out. Check your connection or disable ad blockers.'));
    }, 10000);

    if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
      clearTimeout(timeout);
      resolve(window.PaystackPop);
      return;
    }

    const existing = document.getElementById('paystack-script');
    if (existing) {
      if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
        clearTimeout(timeout);
        resolve(window.PaystackPop);
        return;
      }
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => {
      clearTimeout(timeout);
      if (window.PaystackPop && typeof window.PaystackPop.setup === 'function') {
        resolve(window.PaystackPop);
      } else {
        reject(new Error('Paystack failed to initialize. Disable ad blockers and try again.'));
      }
    };
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to load Paystack script. Check your connection.'));
    };
    document.head.appendChild(script);
  });
}

export default function RemainingPayment() {
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
      const initData = await initializePayment(request.id, 'remaining');
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

      if (!initData.access_code || !initData.reference) {
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
        access_code: initData.access_code,
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
      } else {
        setError('Could not start payment: ' + msg + '. Please try again.');
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

  if (request.fullyPaid) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <PanelHeader
          title="Payment Complete"
          subtitle="Your project is fully paid"
          onBack={() => navigate('/completed-projects')}
          backLabel="Back to Completed Projects"
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
              Fully Paid
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              This project is fully paid. You can download your finished design.
            </p>
            <button
              onClick={() => navigate('/completed-projects')}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl text-white cursor-pointer pressable mx-auto"
              style={{ background: 'var(--color-accent)' }}
            >
              <FaDownload /> View & Download Design
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!request.halfPaid) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <PanelHeader
          title="Payment Not Available"
          subtitle="First payment has not been completed"
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
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              You need to complete the first 50% payment before paying the remaining balance.
            </p>
            <button
              onClick={() => navigate(`/payment/${request.id}`)}
              className="px-6 py-2.5 text-sm font-medium rounded-xl text-white cursor-pointer pressable"
              style={{ background: '#059669' }}
            >
              Pay First Installment
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const price = Number(request.standardPrice) || 0;
  const remaining = price / 2;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Pay Remaining Balance"
        subtitle="Pay the remaining 50% to download your finished design"
        onBack={() => navigate('/completed-projects')}
        backLabel="Back to Completed Projects"
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
              <span><strong>Timeline:</strong> {request.timeline || 'Not specified'}</span>
            </div>
          </div>

          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            Payment Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-default)' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Total Project Price</p>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {'\u20A6'}{price.toLocaleString()}
              </span>
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: '#10b9811a', border: '1px solid #10b98133' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#10b981' }}>First Payment (Paid)</p>
              </div>
              <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                {'\u20A6'}{remaining.toLocaleString()}
              </span>
            </div>

            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: '#f59e0b1a', border: '1px solid #f59e0b33' }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>Remaining Balance</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  Pay to download the finished design
                </p>
              </div>
              <span className="text-lg font-bold" style={{ color: '#f59e0b' }}>
                {'\u20A6'}{remaining.toLocaleString()}
              </span>
            </div>
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
                Your project is now fully paid. You can download your finished design.
              </p>
              <button
                onClick={() => navigate('/completed-projects')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl text-white cursor-pointer pressable mx-auto"
                style={{ background: '#10b981' }}
              >
                <FaDownload /> Download Design
              </button>
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer pressable"
              style={{ background: '#f59e0b' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#d97706'; }}
              onMouseLeave={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#f59e0b'; }}
            >
              {processing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay {'\u20A6'}{remaining.toLocaleString()} Remaining
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
