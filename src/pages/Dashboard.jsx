import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
  FaCamera,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCommentDots,
  FaPaperPlane,
  FaDownload,
  FaChartPie,
  FaCoins,
  FaFire,
  FaCalendarAlt,
  FaPalette,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PanelHeader from '../components/PanelHeader';
import MessageThread from '../components/MessageThread';

const statusMeta = {
  Pending: { color: '#f59e0b', icon: FaClock },
  'In Progress': { color: '#3b82f6', icon: FaClock },
  Accepted: { color: '#8b5cf6', icon: FaCheckCircle },
  Completed: { color: '#10b981', icon: FaCheckCircle },
  Rejected: { color: '#ef4444', icon: FaTimesCircle },
};

const filters = ['All', 'Pending', 'Accepted'];

const statusOrder = ['Pending', 'In Progress', 'Accepted', 'Completed', 'Rejected'];

export default function Dashboard() {
  const { currentUser, updateProfilePicture, getUserProfile, subscribeToDesignRequests } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const threadParam = searchParams.get('thread');
  const [profile, setProfile] = useState(null);
  const [designRequests, setDesignRequests] = useState([]);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [openThreadId, setOpenThreadId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const scrolledRef = useRef(null);

  useEffect(() => {
    if (!threadParam) return;
    setOpenThreadId(threadParam);
    if (scrolledRef.current === threadParam || designRequests.length === 0) return;
    scrolledRef.current = threadParam;
    const t = setTimeout(() => {
      document
        .getElementById(`request-${threadParam}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
    return () => clearTimeout(t);
  }, [threadParam, designRequests]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else if (currentUser.email === 'adminemail@gmail.com') {
      navigate('/admin');
    } else {
      getUserProfile(currentUser.uid).then(setProfile);
      const unsub = subscribeToDesignRequests((requests) => {
        setDesignRequests(
          requests.filter(
            (r) =>
              r.email === currentUser.email &&
              r.status !== 'Rejected' &&
              r.status !== 'Completed'
          )
        );
      });
      return unsub;
    }
  }, [currentUser, navigate, getUserProfile, subscribeToDesignRequests]);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await updateProfilePicture(currentUser.uid, file);
    setUploading(false);
    setShowPhotoPopup(false);
    getUserProfile(currentUser.uid).then(setProfile);
  }

  if (!currentUser) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text-secondary)' }}>Redirecting...</p>
      </div>
    );
  }

  const fullName = profile
    ? [profile.surname, profile.firstName, profile.lastName].filter(Boolean).join(' ')
    : currentUser.displayName || currentUser.email?.split('@')[0] || 'User';

  const filteredRequests = activeFilter === 'All'
    ? [...designRequests].reverse()
    : designRequests.filter((r) => r.status === activeFilter).reverse();

  const counts = {
    All: designRequests.length,
    Pending: designRequests.filter((r) => r.status === 'Pending').length,
    Accepted: designRequests.filter((r) => r.status === 'Accepted').length,
  };

  // ---- Analytics ----
  const statusCounts = statusOrder
    .map((s) => ({ status: s, count: designRequests.filter((r) => r.status === s).length }))
    .filter((s) => s.count > 0);

  let acc = 0;
  const donutStops = designRequests.length
    ? statusCounts.map(({ status, count }) => {
        const from = (acc / designRequests.length) * 100;
        acc += count;
        const to = (acc / designRequests.length) * 100;
        return `${statusMeta[status].color} ${from}% ${to}%`;
      })
    : [];
  const donutGradient =
    designRequests.length === 0
      ? 'conic-gradient(hsl(247 12% 85%) 0% 100%)'
      : `conic-gradient(${donutStops.join(', ')})`;

  const serviceCounts = designRequests.reduce((map, r) => {
    map[r.service] = (map[r.service] || 0) + 1;
    return map;
  }, {});
  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const maxServiceCount = Math.max(1, ...topServices.map(([, c]) => c));

  const paidRequests = designRequests.filter(
    (r) => (r.status === 'Accepted' || r.status === 'Completed') && (r.premiumPrice || r.standardPrice)
  );
  const estValue = paidRequests.reduce(
    (sum, r) => sum + (r.premiumPrice || r.standardPrice || 0),
    0
  );
  const mostRequested = topServices[0]?.[0] || '—';

  const memberSince = profile?.createdAt || currentUser.metadata?.creationTime;

  const statCards = [
    {
      label: 'Total Requests',
      value: counts.All,
      icon: FaChartPie,
      chipBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      filter: 'All',
      caption: 'All time',
    },
    {
      label: 'Pending',
      value: counts.Pending,
      icon: FaClock,
      chipBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      filter: 'Pending',
      caption: 'Awaiting review',
    },
    {
      label: 'Accepted',
      value: counts.Accepted,
      icon: FaCheckCircle,
      chipBg: 'linear-gradient(135deg, #10b981, #059669)',
      filter: 'Accepted',
      caption: 'In progress',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Dashboard"
        subtitle={`Welcome back, ${fullName}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPhotoPopup(true)}
            className="relative cursor-pointer group"
            aria-label="Change profile picture"
          >
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white/40 group-hover:ring-white/70 transition-all duration-200"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-white/40 group-hover:ring-white/70 transition-all duration-200"
                style={{ background: 'hsl(0 0% 100% / 0.15)' }}
              >
                <FaCamera className="text-white" />
              </div>
            )}
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-white text-[var(--color-accent)] shadow"
            >
              <FaCamera size={10} />
            </span>
          </button>
          <button
            onClick={() => navigate('/request-design')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full text-[var(--color-accent)] bg-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer pressable"
          >
            <FaPaperPlane className="rotate-45" />
            New Request
          </button>
        </div>
      </PanelHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate="visible"
        >
          {statCards.map((card) => {
            const isActive = activeFilter === card.filter;
            return (
              <motion.button
                key={card.label}
                variants={cardVariants}
                onClick={() => setActiveFilter(card.filter)}
                className="relative text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
                style={{
                  background: 'var(--bg-elevated)',
                  border: isActive ? '1.5px solid hsl(262 83% 55%)' : '1px solid var(--border-default)',
                  boxShadow: isActive ? '0 8px 24px hsl(262 83% 55% / 0.14)' : 'var(--shadow-sm)',
                }}
              >
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-[0.06] transition-transform duration-500 group-hover:scale-125"
                  style={{ background: card.chipBg }}
                />
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ background: card.chipBg }}
                  >
                    <card.icon />
                  </div>
                  {isActive && (
                    <span
                      className="w-2 h-2 rounded-full mt-1"
                      style={{ background: 'var(--color-accent)' }}
                    />
                  )}
                </div>
                <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  {card.value}
                </p>
                <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{card.label}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{card.caption}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Analytics */}
        {designRequests.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <motion.div
              className="p-6 rounded-2xl glass-strong"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-base font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                Request Overview
              </h2>
              <div className="flex flex-col items-center gap-5">
                <div className="relative w-36 h-36 rounded-full" style={{ background: donutGradient }}>
                  <div
                    className="absolute inset-3 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--bg-elevated)' }}
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                        {designRequests.length}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
                        Total
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  {statusCounts.map(({ status, count }) => {
                    const meta = statusMeta[status];
                    return (
                      <div key={status} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: meta.color }} />
                          {status}
                        </span>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl glass-strong"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  Most Requested Services
                </h2>
                <FaFire style={{ color: 'var(--color-accent)' }} />
              </div>
              {topServices.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  No data yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {topServices.map(([service, count], i) => (
                    <div key={service}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium truncate pr-3" style={{ color: 'var(--text-primary)' }}>
                          {i + 1}. {service}
                        </span>
                        <span className="font-semibold flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                          {count}
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full overflow-hidden"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, #a78bfa, #6d28d9)',
                            width: `${(count / maxServiceCount) * 100}%`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / maxServiceCount) * 100}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl glass-strong"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-base font-semibold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                Project Overview
              </h2>
              <div className="space-y-4">
                <div
                  className="p-4 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, hsl(262 83% 96%), hsl(262 60% 92%))', border: '1px solid hsl(262 60% 85%)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                      style={{ background: 'var(--color-accent)' }}
                    >
                      <FaCoins />
                    </div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Est. Project Value
                    </p>
                  </div>
                  <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
                    ₦{estValue.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-accent-light)' }}
                  >
                    <FaPalette style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Most requested</p>
                    <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{mostRequested}</p>
                  </div>
                </div>
                {memberSince && (
                  <div className="flex items-center gap-3 text-sm">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--color-accent-light)' }}
                    >
                      <FaCalendarAlt style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Member since</p>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {new Date(memberSince).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Requests */}
        <motion.div
          className="p-6 rounded-2xl glass-strong"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              {activeFilter === 'All' ? 'All Requests' : `${activeFilter} Requests`}
              <span className="ml-2 text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>
                ({filteredRequests.length})
              </span>
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    background: activeFilter === f ? 'var(--color-accent)' : 'var(--bg-secondary)',
                    color: activeFilter === f ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid ' + (activeFilter === f ? 'transparent' : 'var(--border-subtle)'),
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FaClock className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {activeFilter === 'All' ? 'No design requests yet.' : `No ${activeFilter.toLowerCase()} requests.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const meta = statusMeta[req.status] || statusMeta.Pending;
                const StatusIcon = meta.icon;
                return (
                  <motion.div
                    key={req.id}
                    id={`request-${req.id}`}
                    className="relative p-5 rounded-xl transition-all duration-300 hover-lift scroll-mt-24"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                    }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <span
                      className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full"
                      style={{ background: meta.color }}
                    />
                    <div className="flex items-start justify-between mb-3 pl-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{req.service}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium flex-shrink-0"
                        style={{
                          background: `${meta.color}1a`,
                          color: meta.color,
                          border: `1px solid ${meta.color}33`,
                        }}
                      >
                        <StatusIcon className="text-xs" />
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs mb-3 pl-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{req.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3 pl-2">
                      {req.phone && (
                        <span className="inline-flex items-center px-2.5 py-1 text-[11px] rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                          📞 {req.phone}
                        </span>
                      )}
                      {req.timeline && (
                        <span className="inline-flex items-center px-2.5 py-1 text-[11px] rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                          ⏱ {req.timeline}
                        </span>
                      )}
                    </div>

                    {req.status === 'Accepted' && (
                      <div className="space-y-2 mb-3 pl-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div
                            className="p-2.5 rounded-lg break-words"
                            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            <span className="font-medium" style={{ color: '#10b981' }}>
                              Standard: ₦{req.standardPrice?.toLocaleString()}
                            </span>
                          </div>
                          <div
                            className="p-2.5 rounded-lg break-words"
                            style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
                          >
                            <span className="font-medium" style={{ color: 'var(--color-accent)' }}>
                              Premium: ₦{req.premiumPrice?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {req.adminComment && (
                          <div
                            className="p-3 rounded-lg text-xs"
                            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}
                          >
                            <p className="font-medium mb-1" style={{ color: '#10b981' }}>Admin Reply:</p>
                            <p style={{ color: 'var(--text-secondary)' }}>{req.adminComment}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {req.status === 'Completed' && req.submittedFileUrl && (
                      <div className="space-y-2 mb-3 pl-2">
                        <div
                          className="p-3 rounded-lg text-xs"
                          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}
                        >
                          <p className="font-medium mb-1" style={{ color: '#10b981' }}>Finished Design</p>
                          {req.submittedMessage && (
                            <p style={{ color: 'var(--text-secondary)' }}>{req.submittedMessage}</p>
                          )}
                          {req.submittedAt && (
                            <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                              Submitted on {new Date(req.submittedAt).toLocaleDateString()}
                            </p>
                          )}
                          <a
                            href={req.submittedFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 text-[11px] font-medium rounded-lg text-white"
                            style={{ background: 'var(--color-accent)' }}
                          >
                            <FaDownload /> View / Download Design
                          </a>
                        </div>
                      </div>
                    )}

                    {req.status === 'Rejected' && req.rejectReason && (
                      <div
                        className="p-3 rounded-lg text-xs mb-3 pl-2"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}
                      >
                        <p className="font-medium mb-1" style={{ color: '#ef4444' }}>Rejection Reason:</p>
                        <p style={{ color: 'var(--text-secondary)' }}>{req.rejectReason}</p>
                      </div>
                    )}

                    {req.status === 'Pending' ? (
                      <p className="text-xs pl-2" style={{ color: 'var(--text-tertiary)' }}>
                        Chat becomes available once the admin accepts this project.
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 pl-2">
                        <button
                          onClick={() => setOpenThreadId(openThreadId === req.id ? null : req.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer pressable"
                          style={{
                            background: openThreadId === req.id ? 'var(--color-accent)' : 'var(--color-accent-light)',
                            color: openThreadId === req.id ? '#fff' : 'var(--color-accent)',
                            border: '1px solid ' + (openThreadId === req.id ? 'transparent' : 'hsl(262 60% 80%)'),
                          }}
                        >
                          <FaCommentDots />
                          {openThreadId === req.id ? 'Hide Messages' : 'Message Admin'}
                        </button>
                      </div>
                    )}

                    {openThreadId === req.id && (
                      <div className="pl-2">
                        <MessageThread designRequestId={req.id} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showPhotoPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPhotoPopup(false)}
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
              <button
                onClick={() => setShowPhotoPopup(false)}
                className="absolute top-3 right-3 p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <FaTimes />
              </button>
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl ${profile?.profilePicture ? 'cursor-zoom-in' : ''}`}
                style={{ background: 'var(--color-accent)' }}
                onClick={() => { if (profile?.profilePicture) setShowPhotoPreview(true); }}
                title={profile?.profilePicture ? 'View full picture' : undefined}
                role="button"
                aria-label={profile?.profilePicture ? 'View full profile picture' : undefined}
              >
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <FaCamera className="text-4xl text-white" />
                )}
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
              >
                Profile Picture
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Upload a new photo or change your current one.
              </p>
              <label
                className="pressable inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl transition-all duration-200 cursor-pointer shadow-lg"
                style={{ background: 'var(--color-accent)' }}
              >
                <FaCamera />
                {uploading ? 'Uploading...' : 'Choose Photo'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPhotoPreview && profile?.profilePicture && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoPreview(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.img
              src={profile.profilePicture}
              alt="Profile preview"
              className="relative max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <button
              onClick={() => setShowPhotoPreview(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
