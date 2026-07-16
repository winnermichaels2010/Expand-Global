import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaPalette, FaCog, FaSignOutAlt, FaCamera, FaTimes, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const quickActions = [
  { icon: FaPalette, label: 'Request Design', path: '/request-design', desc: 'Submit a new design request' },
  { icon: FaCog, label: 'Settings', path: '/settings', desc: 'Manage your preferences' },
];

const statusIcons = {
  Pending: FaClock,
  Accepted: FaCheckCircle,
  Rejected: FaTimesCircle,
};

const statusColors = {
  Pending: '#f59e0b',
  Accepted: '#10b981',
  Rejected: '#ef4444',
};

export default function Dashboard() {
  const { currentUser, logout, updateProfilePicture, getUserProfile, getDesignRequests } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [designRequests, setDesignRequests] = useState([]);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              className="p-6 rounded-2xl glass-strong shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
              >
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map(({ icon: Icon, label, path, desc }) => (
                  <Link
                    key={path}
                    to={path}
                    className="hover-lift group flex items-center gap-3 p-4 rounded-xl transition-all duration-200"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200"
                      style={{ background: 'var(--color-accent)' }}
                    >
                      <Icon className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            {designRequests.length > 0 && (
              <motion.div
                className="p-6 rounded-2xl glass-strong shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
                >
                  My Design Requests ({designRequests.length})
                </h2>
                <div className="space-y-3">
                  {[...designRequests].reverse().map((req) => {
                    const StatusIcon = statusIcons[req.status] || FaClock;
                    const badgeColor = statusColors[req.status] || '#f59e0b';
                    const badgeBg =
                      req.status === 'Accepted' ? 'rgba(16,185,129,0.12)' :
                      req.status === 'Rejected' ? 'rgba(239,68,68,0.12)' :
                      'rgba(245,158,11,0.12)';
                    return (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl"
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{req.service}</p>
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
                        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{req.description}</p>
                        {req.status === 'Accepted' && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div
                              className="p-2 rounded-lg"
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
                              className="p-2 rounded-lg"
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
                        )}
                        {req.adminComment && (
                          <p className="text-xs italic mt-2" style={{ color: 'var(--text-secondary)' }}>
                            &ldquo;{req.adminComment}&rdquo;
                          </p>
                        )}
                        {req.status === 'Rejected' && req.rejectReason && (
                          <p className="text-xs mt-2" style={{ color: '#ef4444' }}>
                            Reason: {req.rejectReason}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <motion.div
              className="p-6 rounded-2xl glass-strong shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
              >
                Account
              </h2>
              <div className="space-y-3">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Email</p>
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{currentUser.email}</p>
                </div>
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{fullName}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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
