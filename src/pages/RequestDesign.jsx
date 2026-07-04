import { useState, useEffect } from 'react';
import { HiPaperAirplane, HiPhotograph, HiColorSwatch, HiTemplate, HiOfficeBuilding } from 'react-icons/hi';
import { FaPalette, FaBullhorn } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const designServices = [
  { icon: FaPalette, label: 'Logo Design' },
  { icon: FaBullhorn, label: 'Brand Identity' },
  { icon: null, label: 'Others' },
  { icon: HiTemplate, label: 'Polo Branding' },
  { icon: HiOfficeBuilding, label: 'Signage Design' },
  { icon: HiPhotograph, label: 'Photo Framing' },
  { icon: HiColorSwatch, label: 'Custom Artwork' },
  { icon: HiPhotograph, label: 'Birthday/Event Design' },
];

export default function RequestDesign() {
  const { currentUser, saveDesignRequest, getUserProfile } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState(null);

  const displayName = profile
    ? [profile.surname, profile.firstName, profile.lastName].filter(Boolean).join(' ')
    : currentUser?.displayName || '';

  const [formData, setFormData] = useState({
    name: displayName,
    email: currentUser?.email || '',
    phone: '',
    service: '',
    description: '',
    timeline: '',
  });

  useEffect(() => {
    if (currentUser) {
      getUserProfile(currentUser.uid).then((p) => {
        setProfile(p);
        const name = p
          ? [p.surname, p.firstName, p.lastName].filter(Boolean).join(' ')
          : currentUser?.displayName || '';
        setFormData((prev) => ({ ...prev, name, email: currentUser?.email || '' }));
      });
    }
  }, [currentUser, getUserProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDesignRequest(formData);
    setSubmitted(true);
    setFormData({ name: displayName, email: currentUser?.email || '', phone: '', service: '', description: '', timeline: '' });
  };

  function ServiceIcon({ icon, selected }) {
    if (!icon) {
      return (
        <svg className={`text-2xl mx-auto mb-2 transition-colors duration-300 ${selected ? 'text-purple-600' : 'text-purple-400 group-hover:text-purple-600'}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    }
    const Icon = icon;
    return <Icon className={`text-2xl mx-auto mb-2 transition-colors duration-300 ${selected ? 'text-purple-600' : 'text-purple-400 group-hover:text-purple-600'}`} />;
  }

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-purple-500/10 to-fuchsia-600/10 dark:from-purple-900/20 dark:via-transparent dark:to-fuchsia-900/10" />
        <motion.div
          className="relative z-10 text-center max-w-lg mx-auto px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-600/30"
          >
            <HiPaperAirplane className="text-4xl text-white rotate-45" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Request Submitted!</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Thank you for your design request. We&apos;ll review the details and get back to you within 24-48 hours with a custom proposal.
          </p>
          <motion.button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Submit Another Request
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-purple-500/10 to-fuchsia-600/10 dark:from-purple-900/20 dark:via-transparent dark:to-fuchsia-900/10" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
              Request a{' '}
              <span className="text-gradient">Design</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Tell us about your project and we&apos;ll create a custom solution tailored to your brand.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {designServices.map(({ icon, label }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className={`p-5 rounded-xl border transition-all duration-300 text-center group cursor-pointer ${
                  formData.service === label
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-md'
                    : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-purple-600/30 hover:shadow-sm'
                }`}
                onClick={() => setFormData({ ...formData, service: label })}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <ServiceIcon icon={icon} selected={formData.service === label} />
                <span className={`text-xs font-medium ${
                  formData.service === label ? 'text-purple-600 dark:text-purple-400' : 'text-[var(--text-secondary)]'
                }`}>{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6 glass-strong rounded-2xl p-8 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] opacity-60 border border-[var(--border-color)] cursor-not-allowed transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] opacity-60 border border-[var(--border-color)] cursor-not-allowed transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Service Needed *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                >
                  <option value="">Select a service</option>
                  {designServices.map(({ label }) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP (Within a week)">ASAP (Within a week)</option>
                  <option value="1-2 Weeks">1-2 Weeks</option>
                  <option value="2-4 Weeks">2-4 Weeks</option>
                  <option value="1-2 Months">1-2 Months</option>
                  <option value="Flexible / Not sure">Flexible / Not sure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Description *</label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200 resize-none"
                  placeholder="Describe your project in detail... What do you need? Any specific requirements, colors, styles, or references?"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Design Request
                <HiPaperAirplane className="rotate-45" />
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}
