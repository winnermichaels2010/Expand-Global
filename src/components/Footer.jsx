import { Link } from 'react-router-dom';
import { FaInstagram, FaBehance, FaDribbble, FaLinkedin } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img
                src="/expand-global-logo.jpg"
                alt="Expand Global Logo"
                className="w-10 h-10 rounded-lg object-cover ring-2 ring-purple-600/30 group-hover:ring-purple-600/60 transition-all duration-300"
              />
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Expand Global
              </h3>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              We bring brands to life through creative design and strategic branding. 
              Let's create something extraordinary together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Terms & Conditions', path: '/terms' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-[var(--text-secondary)] hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <HiMail className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                hello@expandglobal.com
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <HiPhone className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <HiLocationMarker className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                Lagos, Nigeria
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaBehance, href: '#', label: 'Behance' },
                { icon: FaDribbble, href: '#', label: 'Dribbble' },
                { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
          <p className="text-center text-xs text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} Expand Global. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}