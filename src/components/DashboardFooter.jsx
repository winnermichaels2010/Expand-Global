import { Link } from 'react-router-dom';
import { FaLifeRing, FaExclamationTriangle } from 'react-icons/fa';

export default function DashboardFooter() {
  return (
    <footer
      className="mt-8 px-4 sm:px-6 lg:px-8 py-5"
      style={{
        background: 'hsl(262 55% 10%)',
        borderTop: '1px solid hsl(0 0% 100% / 0.08)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 sm:gap-4">
        <p className="text-xs order-2 sm:order-1 text-center sm:text-left" style={{ color: 'hsl(0 0% 68%)' }}>
          © {new Date().getFullYear()} Expand Global. All rights reserved.
        </p>
        <nav className="flex items-center gap-1 flex-wrap justify-center order-1 sm:order-2" aria-label="Support">
          <Link
            to="/contact"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 cursor-pointer"
            style={{ color: 'hsl(0 0% 84%)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#a78bfa';
              e.currentTarget.style.background = 'hsl(0 0% 100% / 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'hsl(0 0% 84%)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <FaLifeRing />
            Help / Support
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 cursor-pointer"
            style={{ color: 'hsl(0 0% 84%)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#a78bfa';
              e.currentTarget.style.background = 'hsl(0 0% 100% / 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'hsl(0 0% 84%)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <FaExclamationTriangle />
            Report an issue
          </Link>
        </nav>
      </div>
    </footer>
  );
}
