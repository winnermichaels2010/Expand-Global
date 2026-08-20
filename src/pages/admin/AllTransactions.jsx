import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaCheckCircle, FaClock, FaCreditCard, FaFilter } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import PanelHeader from '../../components/PanelHeader';
import ProfileAvatar from '../../components/ProfileAvatar';
import { useProfilePicsByEmail } from '../../hooks/useProfilePics';

const FILTER_OPTIONS = ['All', 'Half', 'Remaining'];

export default function AllTransactions() {
  const { currentUser, ADMIN_EMAIL } = useAuth();
  const profilePicsByEmail = useProfilePicsByEmail();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  async function fetchPayments() {
    const { data, error } = await supabase
      .from('payments')
      .select('*, design_requests(id, service, email, name, standard_price, user_id)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch payments:', error);
      return [];
    }
    return data || [];
  }

  useEffect(() => {
    if (!isAdmin) return;
    fetchPayments().then((data) => {
      setPayments(data);
      setLoading(false);
    });
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const topic = `payments-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(topic)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, async () => {
        const data = await fetchPayments();
        setPayments(data);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [isAdmin]);

  const filtered = payments.filter((p) => {
    if (filter === 'All') return true;
    return p.payment_type === filter.toLowerCase();
  });

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount_kobo || 0), 0);
  const halfPayments = payments.filter((p) => p.payment_type === 'half').length;
  const remainingPayments = payments.filter((p) => p.payment_type === 'remaining').length;

  function formatNaira(kobo) {
    return `₦${(kobo / 100).toLocaleString()}`;
  }

  function getClientInfo(payment) {
    const dr = payment.design_requests;
    if (!dr) return { name: 'Unknown', email: '' };
    return {
      name: dr.name || 'Unknown',
      email: dr.email || '',
    };
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <PanelHeader title="All Transactions" subtitle="View all payments made by clients">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaMoneyBillWave size={14} />
          {payments.length} {payments.length === 1 ? 'payment' : 'payments'}
        </div>
      </PanelHeader>

      <div className="px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8 overflow-hidden">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { label: 'Total Revenue', value: formatNaira(totalAmount), icon: FaMoneyBillWave, color: '#059669' },
            { label: 'Half Payments', value: halfPayments, icon: FaCreditCard, color: '#f59e0b' },
            { label: 'Remaining Payments', value: remainingPayments, icon: FaCheckCircle, color: '#6366f1' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="p-4 rounded-xl"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}1a`, color: stat.color }}
                >
                  <stat.icon size={14} />
                </div>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </p>
              </div>
              <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FaFilter size={12} style={{ color: 'var(--text-secondary)' }} />
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all duration-200 cursor-pointer pressable"
              style={{
                background: filter === opt ? 'var(--color-accent)' : 'var(--bg-elevated)',
                color: filter === opt ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${filter === opt ? 'var(--color-accent)' : 'var(--border-default)'}`,
              }}
            >
              {opt}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="p-4 sm:p-6 rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            All Transactions ({filtered.length})
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl animate-pulse"
                  style={{ background: 'var(--bg-primary)' }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No transactions found.
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((payment) => {
                const client = getClientInfo(payment);
                const dr = payment.design_requests;
                const email = client.email?.toLowerCase();
                const isVerified = payment.verified;

                return (
                  <motion.div
                    key={payment.id}
                    className="p-3 sm:p-4 rounded-xl"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ProfileAvatar
                          src={profilePicsByEmail[email]}
                          alt={client.name}
                          size={32}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{client.name}</p>
                          <p className="text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>
                            {client.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={
                            payment.payment_type === 'half'
                              ? { background: '#f59e0b1a', color: '#f59e0b', border: '1px solid #f59e0b33' }
                              : { background: '#6366f11a', color: '#6366f1', border: '1px solid #6366f133' }
                          }
                        >
                          <FaCreditCard className="text-[8px]" />
                          {payment.payment_type === 'half' ? 'Half' : 'Remaining'}
                        </span>
                        <span
                          className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={
                            isVerified
                              ? { background: '#10b9811a', color: '#10b981', border: '1px solid #10b98133' }
                              : { background: '#f59e0b1a', color: '#f59e0b', border: '1px solid #f59e0b33' }
                          }
                        >
                          {isVerified ? <FaCheckCircle className="text-[8px]" /> : <FaClock className="text-[8px]" />}
                          {isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div
                      className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="truncate"><strong>Service:</strong> {dr?.service || 'N/A'}</span>
                      <span className="truncate"><strong>Amount:</strong> {formatNaira(payment.amount_kobo)}</span>
                      <span className="truncate"><strong>Price:</strong> ₦{(dr?.standard_price || 0).toLocaleString()}</span>
                      <span className="truncate"><strong>Ref:</strong> {payment.paystack_reference}</span>
                    </div>

                    <div
                      className="flex items-center justify-between mt-2 pt-2"
                      style={{ borderTop: '1px solid var(--border-default)' }}
                    >
                      <div className="flex items-center gap-1.5">
                        <FaClock className="text-[9px]" style={{ color: 'var(--text-tertiary)' }} />
                        <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(payment.created_at).toLocaleDateString()} &middot;{' '}
                          {new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {payment.verified_at && (
                        <p className="text-[10px]" style={{ color: '#10b981' }}>
                          Verified {new Date(payment.verified_at).toLocaleDateString()}
                        </p>
                      )}
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
