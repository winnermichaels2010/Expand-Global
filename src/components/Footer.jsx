import { Link, useLocation } from 'react-router-dom';
import { FaInstagram, FaBehance, FaDribbble, FaLinkedin } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const publicLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
  { name: 'Terms', path: '/terms' },
];

const userLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Request Design', path: '/request-design' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Completed Projects', path: '/completed-projects' },
];

const adminLinks = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Design Requests', path: '/admin/design-requests' },
  { name: 'Gallery', path: '/admin/gallery' },
  { name: 'Finished Projects', path: '/admin/projects/finished' },
];

export default function Footer() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isAdmin = currentUser?.email === 'adminemail@gmail.com';
  const isActive = (path) => location.pathname === path;

  const navLinks = !currentUser ? publicLinks : isAdmin ? adminLinks : userLinks;

  return (
    <footer className="relative" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <img
                src="/expand-global-logo.jpg"
                alt="Expand Global"
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-black/[0.06] dark:ring-white/[0.08] transition-all duration-300"
              />
              <h3 className="text-lg tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                Expand Global
              </h3>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              We bring brands to life through creative design and strategic branding.
              Let&apos;s create something extraordinary together.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4
              className="text-[0.6875rem] font-semibold tracking-[0.08em] uppercase mb-5"
              style={{ color: 'var(--color-accent)' }}
            >
              {currentUser ? (isAdmin ? 'Admin Panel' : 'My Account') : 'Navigation'}
            </h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 md:flex-col md:gap-y-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm transition-colors duration-200"
                  style={{
                    color: isActive(link.path) ? 'var(--color-accent)' : 'var(--text-secondary)',
                    fontWeight: isActive(link.path) ? 500 : 400,
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4
              className="text-[0.6875rem] font-semibold tracking-[0.08em] uppercase mb-5"
              style={{ color: 'var(--color-accent)' }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              {[
                { icon: HiMail, value: 'esenichijindu53@gmail.com' },
                { icon: HiPhone, value: '+2348160740145' },
                { icon: HiLocationMarker, value: 'Aba, Nigeria' },
              ].map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon className="text-sm flex-shrink-0" style={{ color: 'var(--color-accent-muted)' }} />
                  {value}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 mt-5">
              {[
                { icon: FaInstagram, label: 'Instagram' },
                { icon: FaBehance, label: 'Behance' },
                { icon: FaDribbble, label: 'Dribbble' },
                { icon: FaLinkedin, label: 'LinkedIn' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ color: 'var(--text-tertiary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-accent)';
                    e.currentTarget.style.background = 'var(--color-accent-light)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-tertiary)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  aria-label={label}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-10 md:mt-14 pt-6 md:pt-8"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
            &copy; {new Date().getFullYear()} Expand Global. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
