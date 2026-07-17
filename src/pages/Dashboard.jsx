import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaSignOutAlt, FaCamera, FaTimes, FaCheckCircle, FaTimesCircle, FaClock, FaCommentDots } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import MessageThread from '../components/MessageThread';

const statusIcons = {
  Pending: FaClock,
  Accepted: FaCheckCircle,
  Rejected: FaTimesCircle,
};

const statusColors = {
  Pending: 'hsl(247 12% 50%)',
  Accepted: '#10b981',
  Rejected: '#ef4444',
};

const filters = ['All', 'Pending', 'Accepted', 'Rejected'];

export default function Dashboard() {
  const { currentUser, logout, updateProfilePicture, getUserProfile, getDesignRequests } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [designRequests, setDesignRequests] = useState([]);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [openThreadId, setOpenThreadId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    } else if (currentUser.email === 'adminemail@gmail.com') {
      navigate('/admin');
    } else {
      getUserProfile(currentUser.uid).then(setProfile);
      getDesignRequests().then((requests) => {
        setDesignRequests(requests.filter((r) => r.email === currentUser.email));
      });
    }
  }, [currentUser, navigate, getUserProfile, getDesignRequests]);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await updateProfilePicture(currentUser.uid, file);
    setUploading(false);
    setShowPhotoPopup(false);
    getUserProfile(currentUser.uid).then(setProfile);
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
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
    Rejected: designRequests.filter((r) => r.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="relative overflow-hidden" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              {profile?.profilePicture ? (
                <button onClick={() => setShowPhotoPopup(true)} className="cursor-pointer">
                  <img
                    src={profile.profilePicture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 hover:ring-white/60 transition-all duration-200"
                  />
                </button>
              ) : (
                <button
                  onClick={() => setShowPhotoPopup(true)}
                  className="w-16 h-16 rounded-full bg-white/15 ring-4 ring-white/30 flex items-center justify-center hover:ring-white/60 transition-all duration-200 cursor-pointer"
                >
                  <FaCamera className="text-white text-xl" />
                </button>
              )}
              <div>
                <h1
                  className="text-3xl sm:text-4xl font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Dashboard
                </h1>
                <p className="text-white/70">
                  Welcome back, {fullName}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="pressable inline-flex items-center gap-2 px-5 py-2.5 text-white font-medium rounded-xl transition-all duration-200 cursor-pointer"
              style={{ background: '#dc2626' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FaSignOutAlt />
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {filters.map((f) => {
            const Icon = f === 'All' ? FaClock : statusIcons[f];
            const color = f === 'All' ? 'var(--color-accent)' : statusColors[f];
            return (
              <motion.div
                key={f}
                className="p-4 rounded-2xl glass-strong shadow-lg text-center cursor-pointer hover-lift"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveFilter(f)}
                style={{
                  border: activeFilter === f ? `2px solid ${color}` : '1px solid var(--border-default)',
                  background: activeFilter === f ? `${color}10` : 'var(--bg-elevated)',
                }}
              >
                <Icon className="text-lg mx-auto mb-1" style={{ color }} />
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{counts[f]}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{f}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="p-6 rounded-2xl glass-strong shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
          >
            {activeFilter === 'All' ? 'All Requests' : `${activeFilter} Requests`} ({filteredRequests.length})
          </h2>

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
                const StatusIcon = statusIcons[req.status] || FaClock;
                const badgeColor = statusColors[req.status] || 'hsl(247 12% 50%)';
                const badgeBg =
                  req.status === 'Accepted' ? 'rgba(16,185,129,0.12)' :
                  req.status === 'Rejected' ? 'rgba(239,68,68,0.12)' :
                  'hsl(247 12% 50% / 0.12)';
                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-xl"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{req.service}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: badgeBg, color: badgeColor }}
                      >
                        <StatusIcon className="text-xs" style={{ color: badgeColor }} />
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{req.description}</p>

                    <div
                      className="flex flex-wrap gap-3 text-[11px] mb-3"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {req.phone && <span>Phone: {req.phone}</span>}
                      {req.timeline && <span>Timeline: {req.timeline}</span>}
                    </div>

                    {req.status === 'Accepted' && (
                      <div className="space-y-2 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div
                            className="p-2.5 rounded-lg"
                            style={{
                              background: 'rgba(16,185,129,0.08)',
                              border: '1px solid rgba(16,185,129,0.2)',
                            }}
                          >
                            <span style={{ color: '#10b981' }} className="font-medium">
                              Standard: ₦{req.standardPrice?.toLocaleString()}
                            </span>
                          </div>
                          <div
                            className="p-2.5 rounded-lg"
                            style={{
                              background: 'rgba(139,92,246,0.08)',
                              border: '1px solid rgba(139,92,246,0.2)',
                            }}
                          >
                            <span style={{ color: 'var(--color-accent)' }} className="font-medium">
                              Premium: ₦{req.premiumPrice?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {req.adminComment && (
                          <div
                            className="p-2.5 rounded-lg text-xs"
                            style={{
                              background: 'rgba(16,185,129,0.06)',
                              border: '1px solid rgba(16,185,129,0.15)',
                            }}
                          >
                            <p className="font-medium mb-1" style={{ color: '#10b981' }}>Admin Reply:</p>
                            <p style={{ color: 'var(--text-secondary)' }}>{req.adminComment}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {req.status === 'Rejected' && req.rejectReason && (
                      <div
                        className="p-2.5 rounded-lg text-xs mb-3"
                        style={{
                          background: 'rgba(239,68,68,0.06)',
                          border: '1px solid rgba(239,68,68,0.15)',
                        }}
                      >
                        <p className="font-medium mb-1" style={{ color: '#ef4444' }}>Rejection Reason:</p>
                        <p style={{ color: 'var(--text-secondary)' }}>{req.rejectReason}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setOpenThreadId(openThreadId === req.id ? null : req.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer pressable"
                      style={{
                        background: openThreadId === req.id ? 'var(--color-accent)' : 'var(--bg-secondary)',
                        color: openThreadId === req.id ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <FaCommentDots />
                      {openThreadId === req.id ? 'Hide Messages' : 'Message Admin'}
                    </button>

                    {openThreadId === req.id && (
                      <MessageThread designRequestId={req.id} />
                    )}
                  </div>
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
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
                style={{ background: 'var(--color-accent)' }}
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
              <button
                onClick={() => setShowPhotoPopup(false)}
                className="block w-full mt-3 px-6 py-2.5 text-sm transition-colors duration-200 cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Skip
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
