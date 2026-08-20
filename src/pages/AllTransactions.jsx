import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaCheckCircle, FaClock, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import PanelHeader from '../components/PanelHeader';

export default function AllTransactions() {
  const { currentUser, ADMIN_EMAIL } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!currentUser) return;

    let cancelled = false;

    async function fetchPayments() {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*, design_requests(service, standard_price)')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (!cancelled) setPayments(data || []);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPayments();

    const topic = `payments-${currentUser.id}`;
    const channel = supabase
      .channel(topic)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments', filter: `user_id=eq.${currentUser.id}` },
        () => fetchPayments()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [currentUser, ADMIN_EMAIL]);

  const filtered = payments.filter((p) => {
    if (filter === 'half') return p.payment_type === 'half';
    if (filter === 'remaining') return p.payment_type === 'remaining';
    return true;
  });

  const totalPaid = payments
    .filter((p) => p.verified)
    .reduce((sum, p) => sum + (p.amount_kobo || 0), 0);
  const halfCount = payments.filter((p) => p.payment_type === 'half').length;
  const remainingCount = payments.filter((p) => p.payment_type === 'remaining').length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="All Transactions"
        subtitle="View your complete payment history"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaMoneyBillWave size={14} />
          {payments.length} {payments.length === 1 ? 'payment' : 'payments'}
        </div>
      </PanelHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Total Verified</p>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                ₦{(totalPaid / 100).toLocaleString()}
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>First Half Payments</p>
              <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>
                {halfCount}
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Remaining Payments</p>
              <p className="text-lg font-bold" style={{ color: '#059669' }}>
                {remainingCount}
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div
            className="flex items-center gap-2 p-1 rounded-xl w-fit"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          >
            {[
              { key: 'all', label: 'All' },
              { key: 'half', label: 'First Half' },
              { key: 'remaining', label: 'Remaining' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer"
                style={{
                  background: filter === key ? 'var(--color-accent)' : 'transparent',
                  color: filter === key ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Payments List */}
          <div
            className="p-5 sm:p-6 rounded-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
          >
            {loading ? (
              <div className="text-center py-16">
                <FaCreditCard className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading payments...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <FaMoneyBillWave className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {filter === 'all'
                    ? 'No payments yet. Your payment history will appear here.'
                    : `No ${filter === 'half' ? 'first half' : 'remaining'} payments found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((payment, i) => {
                  const serviceName = payment.design_requests?.service || 'Unknown Service';
                  const standardPrice = Number(payment.design_requests?.standard_price) || 0;
                  const amountNaira = (payment.amount_kobo || 0) / 100;
                  const isHalf = payment.payment_type === 'half';
                  const date = payment.created_at ? new Date(payment.created_at) : null;

                  return (
                    <motion.div
                      key={payment.id}
                      className="relative p-5 rounded-xl transition-all duration-300 hover-lift"
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-default)',
                      }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <span
                        className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full"
                        style={{ background: isHalf ? '#f59e0b' : '#059669' }}
                      />

                      <div className="pl-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {serviceName}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                              Ref: {payment.paystack_reference}
                            </p>
                          </div>
                          <span
                            className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium flex-shrink-0"
                            style={
                              payment.verified
                                ? { background: '#10b9811a', color: '#10b981', border: '1px solid #10b98133' }
                                : { background: '#f59e0b1a', color: '#f59e0b', border: '1px solid #f59e0b33' }
                            }
                          >
                            {payment.verified ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs" />}
                            {payment.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>

                        <div
                          className="rounded-xl p-3 mb-3"
                          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                              Project Price
                            </span>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                              ₦{standardPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                              {isHalf ? 'First Half (50%)' : 'Remaining (50%)'}
                            </span>
                            <span
                              className="text-sm font-bold"
                              style={{ color: isHalf ? '#f59e0b' : '#059669' }}
                            >
                              ₦{amountNaira.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: isHalf ? '#f59e0b1a' : '#0596691a',
                              color: isHalf ? '#f59e0b' : '#059669',
                              border: `1px solid ${isHalf ? '#f59e0b33' : '#05966933'}`,
                            }}
                          >
                            {isHalf ? 'First Half' : 'Remaining'}
                          </span>
                          {date && (
                            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                              {date.toLocaleDateString(undefined, {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              at{' '}
                              {date.toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
