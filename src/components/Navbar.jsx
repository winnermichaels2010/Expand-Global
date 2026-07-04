import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { BsSun, BsMoonStars } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const publicLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Terms', path: '/terms' },
];

const userLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Request Design', path: '/request-design' },
  { name: 'Settings', path: '/settings' },
];

const adminLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Users', path: '/admin?view=users' },
  { name: 'Settings', path: '/settings' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const location = useLocation();
  const navbarRef = useRef(null);

  const isActive = (path) => location.pathname === path || location.pathname + location.search === path;
  const isAdmin = currentUser?.email === 'adminemail@gmail.com';

  const links = !currentUser
    ? publicLinks
    : isAdmin
      ? adminLinks
      : publicLinks.filter((l) => l.name !== 'Home').concat(userLinks);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (mobileOpen && currentScrollY < lastScrollY) {
        setMobileOpen(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen, lastScrollY]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  return (
    <motion.nav
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="w-full max-w-7xl rounded-2xl glass shadow-lg shadow-purple-600/5"
        animate={{
          paddingTop: scrolled ? '0.5rem' : '0.75rem',
          paddingBottom: scrolled ? '0.5rem' : '0.75rem',
          paddingLeft: scrolled ? '1.5rem' : '2rem',
          paddingRight: scrolled ? '1.5rem' : '2rem',
          borderRadius: scrolled ? '1rem' : '1rem',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              src="/expand-global-logo.jpg"
              alt="Expand Global Logo"
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-purple-600/30 group-hover:ring-purple-600/60 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            />
            <motion.span
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
              animate={{ fontSize: scrolled ? '1.125rem' : '1.25rem' }}
              transition={{ duration: 0.3 }}
            >
              Expand Global
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-100/60 dark:bg-purple-900/20'
                    : 'text-[var(--text-secondary)] hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 cursor-pointer border border-[var(--border-color)]"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? <BsSun size={16} /> : <BsMoonStars size={16} />}
            </motion.button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={currentUser ? (isAdmin ? '/admin' : '/dashboard') : '/auth'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40"
              >
                <span className="hidden lg:inline">{currentUser ? (isAdmin ? 'Admin' : 'Account') : 'Sign In'}</span>
                <span className="lg:hidden">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
              </Link>
            </motion.div>
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 cursor-pointer"
              aria-label="Toggle theme"
              whileTap={{ scale: 0.95 }}
            >
              {darkMode ? <BsSun size={16} /> : <BsMoonStars size={16} />}
            </motion.button>
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-[var(--text-primary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 cursor-pointer"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              {mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-4 right-4 mt-2 rounded-2xl glass shadow-xl border border-[var(--glass-border)] overflow-hidden md:hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-[var(--text-secondary)] hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to={currentUser ? (isAdmin ? '/admin' : '/dashboard') : '/auth'}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-center mt-2"
              >
                {currentUser ? (isAdmin ? 'Admin' : 'Account') : 'Sign In'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
