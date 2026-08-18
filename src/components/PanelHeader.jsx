import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

// eslint-disable-next-line react/prop-types
export default function PanelHeader({ title, subtitle, onBack, backLabel, children }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(262 83% 56%) 0%, hsl(263 70% 44%) 40%, hsl(280 60% 35%) 70%, hsl(262 80% 22%) 100%)',
      }}
    >
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'hsl(0 0% 100% / 0.07)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'hsl(0 0% 100% / 0.05)', filter: 'blur(90px)' }}
      />
      <div
        className="absolute top-0 right-1/3 w-px h-full pointer-events-none"
        style={{ background: 'hsl(0 0% 100% / 0.08)' }}
      />
      <div
        className="absolute top-8 left-1/2 w-px h-24 pointer-events-none"
        style={{ background: 'hsl(0 0% 100% / 0.06)' }}
      />
      <div
        className="absolute -top-8 left-1/3 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'hsl(320 60% 50% / 0.08)', filter: 'blur(50px)' }}
      />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 text-xs font-semibold rounded-full px-4 py-2 text-white/90 hover:text-white transition-all duration-200 cursor-pointer"
              style={{
                background: 'hsl(0 0% 100% / 0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid hsl(0 0% 100% / 0.18)',
              }}
            >
              <FaArrowLeft size={11} /> {backLabel || 'Back'}
            </button>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-4xl font-bold text-white mb-2 tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base" style={{ color: 'hsl(0 0% 100% / 0.65)' }}>{subtitle}</p>
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
