import { Link, useLocation } from 'react-router-dom';
import { FaInstagram, FaBehance, FaDribbble, FaLinkedin, FaPalette } from 'react-icons/fa';
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
    <footer className="relative bg-[var(--bg-tertiary)] border-t border-[var(--border-color)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
        <div className={`grid grid-cols-1 ${currentUser ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8 md:gap-12`}>
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-3 group">
              <img
                src="/expand-global-logo.jpg"
                alt="Expand Global Logo"
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover ring-2 ring-purple-600/30 group-hover:ring-purple-600/60 transition-all duration-300"
              />
              <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Expand Global
              </h3>
            </Link>
            <p className="text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed max-w-xs">
              We bring brands to life through creative design and strategic branding.
              Let&apos;s create something extraordinary together.
            </p>
          </motion.div>

          {!currentUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-xs md:text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4 md:mb-6">
                Quick Links
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:gap-y-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs md:text-sm transition-colors duration-200 hover:translate-x-1 inline-block ${
                      isActive(link.path)
                        ? 'text-purple-600 dark:text-purple-400 font-medium'
                        : 'text-[var(--text-secondary)] hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-xs md:text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4 md:mb-6">
              Get In Touch
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-center gap-3 text-xs md:text-sm text-[var(--text-secondary)] group">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-200">
                  <HiMail className="text-purple-600 dark:text-purple-400 text-xs md:text-sm" />
                </div>
                esenichijindu53@gmail.com
              </li>
              <li className="flex items-center gap-3 text-xs md:text-sm text-[var(--text-secondary)] group">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-200">
                  <HiPhone className="text-purple-600 dark:text-purple-400 text-xs md:text-sm" />
                </div>
                +2348160740145
              </li>
              <li className="flex items-center gap-3 text-xs md:text-sm text-[var(--text-secondary)] group">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30 transition-colors duration-200">
                  <HiLocationMarker className="text-purple-600 dark:text-purple-400 text-xs md:text-sm" />
                </div>
                Lagos, Nigeria
              </li>
            </ul>
            <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6">
              {[
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaBehance, href: '#', label: 'Behance' },
                { icon: FaDribbble, href: '#', label: 'Dribbble' },
                { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 md:p-2.5 rounded-xl glass text-[var(--text-secondary)] hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-[var(--border-color)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-center text-[10px] md:text-xs text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} Expand Global. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
