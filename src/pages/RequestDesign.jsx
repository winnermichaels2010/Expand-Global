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
        <svg className={`text-2xl mx-auto mb-2 transition-colors duration-300 ${selected ? '' : ''}`} style={{ color: selected ? 'var(--color-accent)' : 'var(--color-accent-muted)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    }
    const Icon = icon;
    return <Icon className="text-2xl mx-auto mb-2 transition-colors duration-300" style={{ color: selected ? 'var(--color-accent)' : 'var(--color-accent-muted)' }} />;
  }

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div
          className="relative z-10 text-center max-w-lg mx-auto px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--color-accent)', boxShadow: '0 8px 24px hsl(270 60% 50% / 0.25)' }}
          >
            <HiPaperAirplane className="text-4xl text-white rotate-45" />
          </motion.div>
          <h2 className="text-3xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Request Submitted!</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Thank you for your design request. We&apos;ll review the details and get back to you within 24-48 hours with a custom proposal.
          </p>
          <motion.button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 font-medium rounded-xl transition-all duration-200 pressable"
            style={{ background: 'var(--color-accent)', color: 'white', boxShadow: '0 4px 12px hsl(270 60% 50% / 0.2)' }}
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
    <div>
      <section className="py-16 relative overflow-hidden" style={{ background: 'var(--color-accent)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl mb-4 text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Request a design
            </h1>
            <p className="text-lg text-white/75">
              Tell us about your project and we&apos;ll create a custom solution tailored to your brand.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 mb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {designServices.map(({ icon, label }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
                className="p-5 rounded-xl transition-all duration-300 text-center group cursor-pointer hover-lift"
                style={{
                  background: formData.service === label ? 'var(--color-accent-light)' : 'var(--bg-elevated)',
                  border: formData.service === label ? '2px solid var(--color-accent)' : '2px solid var(--border-default)',
                }}
                onClick={() => setFormData({ ...formData, service: label })}
              >
                <ServiceIcon icon={icon} selected={formData.service === label} />
                <span className="text-xs font-medium" style={{ color: formData.service === label ? 'var(--color-accent)' : 'var(--text-secondary)' }}>{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5 glass-strong rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly
                    required
                    className="input-base"
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    required
                    className="input-base"
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-base"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Service Needed *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="input-base"
                >
                  <option value="">Select a service</option>
                  {designServices.map(({ label }) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="input-base"
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
                <label className="block text-sm font-medium mb-1.5">Project Description *</label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="input-base"
                  style={{ resize: 'none' }}
                  placeholder="Describe your project in detail... What do you need? Any specific requirements, colors, styles, or references?"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-200 pressable"
                style={{ background: 'var(--color-accent)', color: 'white', boxShadow: '0 4px 12px hsl(270 60% 50% / 0.2)' }}
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
