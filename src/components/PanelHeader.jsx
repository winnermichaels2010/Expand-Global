import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

// eslint-disable-next-line react/prop-types
export default function PanelHeader({ title, subtitle, onBack, backLabel, children }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(120deg, hsl(262 83% 56%) 0%, hsl(263 70% 44%) 55%, hsl(262 80% 28%) 100%)',
      }}
    >
      <div
        className="absolute -top-24 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'hsl(0 0% 100% / 0.08)', filter: 'blur(70px)' }}
      />
      <div
        className="absolute -bottom-28 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'hsl(0 0% 100% / 0.06)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute top-0 right-1/3 w-px h-full pointer-events-none"
        style={{ background: 'hsl(0 0% 100% / 0.1)' }}
      />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 text-sm font-medium rounded-full px-3.5 py-1.5 text-white/85 hover:text-white transition-all duration-200 cursor-pointer"
              style={{
                background: 'hsl(0 0% 100% / 0.1)',
                border: '1px solid hsl(0 0% 100% / 0.2)',
              }}
            >
              <FaArrowLeft size={12} /> {backLabel || 'Back'}
            </button>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
              >
                {title}
              </h1>
              {subtitle && (
                <p style={{ color: 'hsl(0 0% 100% / 0.7)' }}>{subtitle}</p>
              )}
            </div>
            {children && (
              <div className="flex items-center gap-3 flex-shrink-0">{children}</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
