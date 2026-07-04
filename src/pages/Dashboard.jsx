import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FaPalette, FaCog, FaSignOutAlt, FaCamera, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const quickActions = [
  { icon: FaPalette, label: 'Request Design', path: '/request-design', desc: 'Submit a new design request' },
  { icon: FaCog, label: 'Settings', path: '/settings', desc: 'Manage your preferences' },
];

export default function Dashboard() {
  const { currentUser, logout, updateProfilePicture, getUserProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
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
    }
  }, [currentUser, navigate, getUserProfile]);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      await updateProfilePicture(currentUser.uid, event.target.result);
      setUploading(false);
      setShowPhotoPopup(false);
      getUserProfile(currentUser.uid).then(setProfile);
    };
    reader.readAsDataURL(file);
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
        <p className="text-[var(--text-secondary)]">Redirecting...</p>
      </div>
    );
  }

  const fullName = profile
    ? [profile.surname, profile.firstName, profile.lastName].filter(Boolean).join(' ')
    : currentUser.displayName || currentUser.email?.split('@')[0] || 'User';

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 dark:from-purple-950 dark:via-indigo-950 dark:to-purple-900">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
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
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white/20 hover:ring-purple-300 transition-all duration-200"
                  />
                </button>
              ) : (
                <button
                  onClick={() => setShowPhotoPopup(true)}
                  className="w-16 h-16 rounded-full bg-white/10 ring-4 ring-white/20 flex items-center justify-center hover:ring-purple-300 transition-all duration-200 cursor-pointer"
                >
                  <FaCamera className="text-white text-xl" />
                </button>
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-purple-200/80">
                  Welcome back, {fullName}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 cursor-pointer"
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
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map(({ icon: Icon, label, path, desc }) => (
                  <Link
                    key={path}
                    to={path}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                      <Icon className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              className="p-6 rounded-2xl glass-strong shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-semibold mb-4">Account</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Email</p>
                  <p className="text-sm font-medium truncate">{currentUser.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Full Name</p>
                  <p className="text-sm font-medium">{fullName}</p>
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPhotoPopup(false)} />
            <motion.div
              className="relative bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-color)] p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setShowPhotoPopup(false)}
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors duration-200 cursor-pointer text-[var(--text-secondary)]"
              >
                <FaTimes />
              </button>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
                {profile?.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <FaCamera className="text-4xl text-white" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">Profile Picture</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Upload a new photo or change your current one.</p>
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium rounded-xl transition-all duration-200 cursor-pointer shadow-lg">
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
                className="block w-full mt-3 px-6 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 cursor-pointer"
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
