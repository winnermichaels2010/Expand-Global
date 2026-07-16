import { Link, useLocation } from 'react-router-dom';
import { FaInstagram, FaBehance, FaDribbble, FaLinkedin } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Footer() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Terms', path: '/terms' },
    { name: 'Request a Design', path: '/request-design' },
  ];

  return (
    <footer className="relative" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className={`grid grid-cols-1 ${currentUser ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-10 md:gap-16`}>
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

          {/* Quick Links */}
          {!currentUser && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h4 className="label-caps mb-5">Navigation</h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 md:flex-col md:gap-y-2.5">
                {footerLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm transition-colors duration-200 ${
                      isActive(link.path)
                        ? 'font-medium'
                        : ''
                    }`}
                    style={{
                      color: isActive(link.path) ? 'var(--color-accent)' : 'var(--text-secondary)',
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4 className="label-caps mb-5">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: HiMail, value: 'esenichijindu53@gmail.com' },
                { icon: HiPhone, value: '+2348160740145' },
                { icon: HiLocationMarker, value: 'Lagos, Nigeria' },
              ].map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon className="text-[var(--color-accent-muted)] text-sm flex-shrink-0" />
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
                  className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-all duration-200"
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
