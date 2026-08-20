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
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
  { name: 'Terms', path: '/terms' },
];

const userLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Request Design', path: '/request-design' },
];

const adminLinks = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Pending Requests', path: '/admin/projects/pending' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const location = useLocation();
  const navbarRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const isAdmin = currentUser?.email === 'winnermichael21dev@gmail.com';

  const links = !currentUser
    ? publicLinks
    : isAdmin
      ? adminLinks
      : publicLinks.filter((l) => l.name !== 'Home').concat(userLinks);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`w-full max-w-6xl transition-all duration-500 ease-out ${
          scrolled
            ? 'mt-3 glass rounded-2xl shadow-lg shadow-black/[0.04] dark:shadow-black/20 px-5 py-3'
            : 'mt-5 px-6 py-4'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/expand-global-logo.jpg"
              alt="Expand Global"
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-black/[0.06] dark:ring-white/[0.08] group-hover:ring-[var(--color-accent)]/40 transition-all duration-300"
            />
            <span
              className="text-lg tracking-tight transition-all duration-300"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)' }}
            >
              Expand Global
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-2 text-[0.8125rem] font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className={`${!currentUser ? 'hidden md:flex' : 'hidden lg:flex'} items-center gap-2.5`}>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-all duration-300 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, hsl(45 100% 60%) 0%, hsl(25 95% 53%) 50%, hsl(350 80% 55%) 100%)',
                color: '#ffffff',
                boxShadow: '0 2px 10px hsl(45 100% 60% / 0.3)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px hsl(45 100% 60% / 0.5)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 10px hsl(45 100% 60% / 0.3)'; e.currentTarget.style.transform = 'scale(1)'; }}
              aria-label="Toggle theme"
            >
              {darkMode ? <BsSun size={15} className="drop-shadow-sm" /> : <BsMoonStars size={15} className="drop-shadow-sm" />}
            </button>
            <Link
              to={currentUser ? (isAdmin ? '/admin' : '/dashboard') : '/auth'}
              className="inline-flex items-center px-5 py-2 text-[0.8125rem] font-semibold rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-all duration-200 shadow-sm hover:shadow-md pressable"
            >
              {currentUser ? (isAdmin ? 'Admin Panel' : 'My Account') : 'Get Started'}
            </Link>
          </div>

          <div className={`${!currentUser ? 'md:hidden' : 'lg:hidden'} flex items-center gap-1.5`}>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-all duration-300 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, hsl(45 100% 60%) 0%, hsl(25 95% 53%) 50%, hsl(350 80% 55%) 100%)',
                color: '#ffffff',
                boxShadow: '0 2px 10px hsl(45 100% 60% / 0.3)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px hsl(45 100% 60% / 0.5)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 10px hsl(45 100% 60% / 0.3)'; e.currentTarget.style.transform = 'scale(1)'; }}
              aria-label="Toggle theme"
            >
              {darkMode ? <BsSun size={15} className="drop-shadow-sm" /> : <BsMoonStars size={15} className="drop-shadow-sm" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors duration-200 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[72px] left-4 right-4 sm:left-6 sm:right-6 rounded-2xl glass shadow-xl overflow-hidden lg:hidden"
            style={{ border: '1px solid var(--border-default)' }}
          >
            <div className="p-3 space-y-0.5">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {currentUser && (
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="hidden sm:inline-flex items-center justify-center w-full px-4 py-2.5 mt-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-all duration-200"
                >
                  {isAdmin ? 'Admin Panel' : 'My Account'}
                </Link>
              )}
              {!currentUser && (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 mt-2 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-all duration-200"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
