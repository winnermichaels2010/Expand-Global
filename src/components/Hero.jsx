import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '150+', label: 'Happy Clients' },
  { value: '300+', label: 'Projects Completed' },
  { value: '5+', label: 'Years of Experience' },
];

const heroImages = [
  { src: '/images/IMG-20260703-WA0003.jpg', alt: 'Branding project' },
  { src: '/images/IMG-20260703-WA0006.jpg', alt: 'Signage design' },
  { src: '/images/IMG-20260703-WA0008.jpg', alt: 'Logo design' },
  { src: '/images/IMG-20260703-WA0010~2.jpg', alt: 'Print design' },
  { src: '/images/IMG-20260703-WA0034.jpg', alt: 'Brand identity' },
  { src: '/images/IMG-20260703-WA0038.jpg', alt: 'Packaging design' },
  { src: '/images/IMG-20260703-WA0044~2.jpg', alt: 'Visual identity' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUpDelay = (delay) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  },
});

const scaleFade = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const floatAnimation = (duration = 6, delay = 0) => ({
  y: [0, -14, 0],
  transition: {
    duration,
    repeat: Infinity,
    ease: 'easeInOut',
    delay,
  },
});

function MockupBusinessCard({ style, delay = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ ...style, zIndex: 10 }}
      animate={floatAnimation(7, delay)}
    >
      <div
        className="w-36 h-22 sm:w-44 sm:h-28 rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.1)',
        }}
      >
        <div className="p-3 sm:p-4 h-full flex flex-col justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            >
              <span className="text-white text-[6px] sm:text-[7px] font-bold">EG</span>
            </div>
            <span className="text-white/90 text-[7px] sm:text-[8px] font-semibold tracking-wide">
              EXPAND GLOBAL
            </span>
          </div>
          <div>
            <div className="text-white text-[8px] sm:text-[9px] font-medium">Creative Director</div>
            <div className="text-white/40 text-[6px] sm:text-[7px] mt-0.5">hello@expandglobal.com</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MockupBrandBook({ style, delay = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ ...style, zIndex: 8 }}
      animate={floatAnimation(8, delay)}
    >
      <div
        className="w-28 h-36 sm:w-36 sm:h-48 rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f5 100%)',
          border: '1px solid rgba(124,58,237,0.15)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3), 0 0 30px rgba(124,58,237,0.08)',
        }}
      >
        <div className="p-3 sm:p-4 h-full flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mb-2 sm:mb-3 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            >
              <span className="text-white text-[8px] sm:text-[10px] font-bold">EG</span>
            </div>
            <div className="text-[7px] sm:text-[8px] font-bold text-gray-800 tracking-widest">BRAND</div>
            <div className="text-[7px] sm:text-[8px] font-bold text-gray-800 tracking-widest">GUIDELINES</div>
          </div>
          <div className="space-y-1.5">
            <div className="h-1 bg-gray-200 rounded-full" />
            <div className="h-1 bg-gray-200 rounded-full w-3/4" />
            <div className="h-1 bg-purple-200 rounded-full w-1/2" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MockupLetterhead({ style, delay = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ ...style, zIndex: 7 }}
      animate={floatAnimation(9, delay)}
    >
      <div
        className="w-24 h-32 sm:w-32 sm:h-44 rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #fafafe 0%, #f4f4fa 100%)',
          border: '1px solid rgba(200,200,220,0.4)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        }}
      >
        <div className="p-2.5 sm:p-3 h-full flex flex-col">
          <div className="flex items-center gap-1 mb-2 sm:mb-3">
            <div
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            />
            <span className="text-[6px] sm:text-[7px] font-bold text-gray-700">EXPAND GLOBAL</span>
          </div>
          <div className="space-y-1">
            <div className="h-0.5 bg-gray-200 rounded-full" />
            <div className="h-0.5 bg-gray-200 rounded-full w-5/6" />
            <div className="h-0.5 bg-gray-200 rounded-full w-4/6" />
            <div className="h-0.5 bg-gray-200 rounded-full w-full" />
            <div className="h-0.5 bg-gray-200 rounded-full w-3/4" />
            <div className="h-0.5 bg-gray-100 rounded-full w-full" />
            <div className="h-0.5 bg-gray-100 rounded-full w-5/6" />
            <div className="h-0.5 bg-gray-100 rounded-full w-full" />
            <div className="h-0.5 bg-gray-100 rounded-full w-2/3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MockupMug({ style, delay = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ ...style, zIndex: 12 }}
      animate={floatAnimation(6.5, delay)}
    >
      <div
        className="w-16 h-18 sm:w-20 sm:h-22 rounded-lg overflow-hidden shadow-2xl relative"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.4), 0 0 25px rgba(124,58,237,0.1)',
        }}
      >
        <div className="p-2 sm:p-2.5 h-full flex items-center justify-center">
          <div
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
          >
            <span className="text-white text-[6px] sm:text-[7px] font-bold">EG</span>
          </div>
        </div>
        <div
          className="absolute -right-2 top-1/3 w-3 h-8 sm:w-4 sm:h-10 rounded-r-full"
          style={{
            background: '#1a1a2e',
            border: '1px solid rgba(124,58,237,0.15)',
            borderLeft: 'none',
          }}
        />
      </div>
    </motion.div>
  );
}

function MockupPackage({ style, delay = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ ...style, zIndex: 9 }}
      animate={floatAnimation(7.5, delay)}
    >
      <div
        className="w-24 h-20 sm:w-32 sm:h-26 rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          border: '1px solid rgba(124,58,237,0.25)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35), 0 0 35px rgba(124,58,237,0.12)',
        }}
      >
        <div className="p-3 sm:p-4 h-full flex flex-col items-center justify-center">
          <div className="text-white/90 text-[7px] sm:text-[8px] font-bold tracking-[0.2em] mb-1">EXPAND</div>
          <div className="text-white/60 text-[6px] sm:text-[7px] tracking-[0.15em]">GLOBAL</div>
          <div className="w-6 sm:w-8 h-px bg-white/20 mt-2" />
        </div>
      </div>
    </motion.div>
  );
}

function MockupNotebook({ style, delay = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ ...style, zIndex: 11 }}
      animate={floatAnimation(8.5, delay)}
    >
      <div
        className="w-22 h-30 sm:w-28 sm:h-40 rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #12121e 100%)',
          border: '1px solid rgba(124,58,237,0.18)',
          boxShadow: '0 22px 55px rgba(0,0,0,0.35), 0 0 28px rgba(124,58,237,0.08)',
        }}
      >
        <div className="p-3 sm:p-4 h-full flex flex-col">
          <div className="flex items-center gap-1 mb-3">
            <div className="w-0.5 h-full rounded-full bg-white/10 absolute left-4" />
          </div>
          <div className="ml-2 space-y-1.5 flex-1">
            <div className="h-0.5 bg-white/15 rounded-full" />
            <div className="h-0.5 bg-white/10 rounded-full w-4/5" />
            <div className="h-0.5 bg-white/8 rounded-full w-3/5" />
            <div className="h-0.5 bg-white/12 rounded-full w-full" />
            <div className="h-0.5 bg-white/8 rounded-full w-2/3" />
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            >
              <span className="text-white text-[4px] sm:text-[5px] font-bold">EG</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MockupLogoCard({ style, delay = 0 }) {
  return (
    <motion.div
      className="absolute"
      style={{ ...style, zIndex: 13 }}
      animate={floatAnimation(7, delay)}
    >
      <div
        className="w-20 h-20 sm:w-26 sm:h-26 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)',
          boxShadow: '0 20px 50px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15)',
        }}
      >
        <div className="text-center">
          <div className="text-white text-xl sm:text-2xl font-bold tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            EG
          </div>
          <div className="text-white/70 text-[5px] sm:text-[6px] tracking-[0.2em] mt-0.5">EXPAND GLOBAL</div>
        </div>
      </div>
    </motion.div>
  );
}

function AbstractShape({ shape, style, delay = 0 }) {
  const shapes = {
    ring: (
      <div
        className="w-14 h-14 sm:w-20 sm:h-20 rounded-full"
        style={{
          border: '2px solid rgba(124,58,237,0.3)',
          background: 'transparent',
          boxShadow: '0 0 30px rgba(124,58,237,0.08)',
        }}
      />
    ),
    cube: (
      <div
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))',
          border: '1px solid rgba(124,58,237,0.15)',
          backdropFilter: 'blur(8px)',
          transform: 'rotate(12deg)',
        }}
      />
    ),
    dot: (
      <div
        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          boxShadow: '0 0 20px rgba(124,58,237,0.3)',
        }}
      />
    ),
    triangle: (
      <div
        className="w-0 h-0"
        style={{
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '14px solid rgba(124,58,237,0.25)',
          filter: 'drop-shadow(0 0 10px rgba(124,58,237,0.1))',
        }}
      />
    ),
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ ...style, zIndex: 5 }}
      animate={floatAnimation(10, delay)}
    >
      {shapes[shape]}
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden select-none flex flex-col"
      style={{
        background: 'var(--bg-primary)',
      }}
    >
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large ambient orbs */}
        <div
          className="absolute rounded-full"
          style={{
            width: '800px',
            height: '800px',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)',
            top: '-20%',
            right: '-15%',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)',
            bottom: '-15%',
            left: '-10%',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '300px',
            height: '300px',
            background:
              'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)',
            top: '10%',
            left: '20%',
            filter: 'blur(50px)',
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Grain overlay */}
        <div className="grain-overlay absolute inset-0" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 flex-1 flex items-center pt-24 sm:pt-28 lg:pt-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* ===== LEFT COLUMN — TEXT ===== */}
            <motion.div
              className="order-2 lg:order-1"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              {/* Label */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6 sm:mb-8">
                <div
                  className="w-8 sm:w-10 h-[2px] rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #7C3AED, #A855F7)',
                  }}
                />
                <span
                  className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Graphic Design & Branding Solutions
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUpDelay(0.15)}
                className="text-[2.5rem] sm:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem] leading-[1.05] tracking-tight mb-5 sm:mb-6"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                We Design Brands
                <br />
                That{' '}
                <span
                  className="hero-gradient-text"
                  style={{
                    background:
                      'linear-gradient(135deg, #7C3AED 0%, #A855F7 40%, #C084FC 70%, #7C3AED 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient-shift 4s ease infinite',
                  }}
                >
                  Stand Out.
                </span>
              </motion.h1>

              {/* Paragraph */}
              <motion.p
                variants={fadeUpDelay(0.3)}
                className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mb-8 sm:mb-10"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Expand Global helps businesses grow through strategic branding,
                logo design, visual identity systems, packaging, social media
                graphics, and creative design that captivates audiences and
                drives results.
              </motion.p>

              {/* Buttons */}
              <motion.div
                variants={fadeUpDelay(0.45)}
                className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4"
              >
                <Link
                  to="/auth"
                  className="hero-btn-primary group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 text-white text-sm sm:text-[0.9375rem] font-semibold rounded-full transition-all duration-300"
                  style={{
                    background:
                      'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
                    boxShadow:
                      '0 8px 32px rgba(124,58,237,0.35), 0 0 0 1px rgba(124,58,237,0.1)',
                  }}
                >
                  Explore Our Work
                  <HiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/contact"
                  className="hero-btn-secondary inline-flex items-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-[0.9375rem] font-semibold rounded-full transition-all duration-300"
                  style={{
                    color: 'var(--text-primary)',
                    border: '1.5px solid var(--border-default)',
                    background: 'transparent',
                  }}
                >
                  <HiSparkles className="text-sm" style={{ color: 'var(--color-accent)' }} />
                  Get a Free Consultation
                </Link>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                variants={fadeUpDelay(0.6)}
                className="mt-10 sm:mt-14 pt-8 sm:pt-10 flex items-center gap-6 sm:gap-0 sm:divide-x"
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex flex-col ${
                      i === 0 ? 'sm:pr-8' : i === 1 ? 'sm:px-8' : 'sm:pl-8'
                    } ${i === 0 ? '' : 'pt-4 sm:pt-0'} ${
                      i < 2 ? 'sm:border-t-0' : ''
                    }`}
                  >
                    <span
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: 'var(--text-primary)',
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[11px] sm:text-xs font-medium tracking-wide mt-0.5"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ===== RIGHT COLUMN — SHOWCASE ===== */}
            <motion.div
              className="order-1 lg:order-2 relative"
              variants={scaleFade}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square max-w-lg mx-auto">
                {/* Central glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                />

                {/* Ambient ring */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full"
                  style={{
                    border: '1px solid rgba(124,58,237,0.08)',
                    boxShadow:
                      '0 0 80px rgba(124,58,237,0.04), inset 0 0 80px rgba(124,58,237,0.02)',
                  }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full"
                  style={{
                    border: '1px solid rgba(124,58,237,0.06)',
                  }}
                />

                {/* Real Project Images — Collage Layout */}
                {/* Large featured image — center */}
                <motion.div
                  className="absolute"
                  style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', zIndex: 14 }}
                  animate={floatAnimation(8, 0)}
                >
                  <div
                    className="w-40 h-48 sm:w-52 sm:h-64 lg:w-56 lg:h-72 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      boxShadow: '0 25px 60px rgba(0,0,0,0.35), 0 0 40px rgba(124,58,237,0.12)',
                    }}
                  >
                    <img
                      src={heroImages[0].src}
                      alt={heroImages[0].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Left column — stacked */}
                <motion.div
                  className="absolute"
                  style={{ top: '22%', left: '0%', zIndex: 12 }}
                  animate={floatAnimation(9, 0.6)}
                >
                  <div
                    className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      transform: 'rotate(-6deg)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    }}
                  >
                    <img
                      src={heroImages[1].src}
                      alt={heroImages[1].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute z-10"
                  style={{ bottom: '22%', left: '3%' }}
                  animate={floatAnimation(7.5, 1.2)}
                >
                  <div
                    className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      transform: 'rotate(4deg)',
                      boxShadow: '0 18px 45px rgba(0,0,0,0.28)',
                    }}
                  >
                    <img
                      src={heroImages[3].src}
                      alt={heroImages[3].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Right column — stacked */}
                <motion.div
                  className="absolute"
                  style={{ top: '8%', right: '0%', zIndex: 12 }}
                  animate={floatAnimation(8.5, 0.3)}
                >
                  <div
                    className="w-28 h-36 sm:w-36 sm:h-44 rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      transform: 'rotate(5deg)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    }}
                  >
                    <img
                      src={heroImages[2].src}
                      alt={heroImages[2].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute z-10"
                  style={{ bottom: '18%', right: '2%' }}
                  animate={floatAnimation(7, 1.5)}
                >
                  <div
                    className="w-24 h-28 sm:w-[7.5rem] sm:h-[8.5rem] rounded-xl overflow-hidden shadow-2xl"
                    style={{
                      transform: 'rotate(-3deg)',
                      boxShadow: '0 18px 45px rgba(0,0,0,0.28)',
                    }}
                  >
                    <img
                      src={heroImages[4].src}
                      alt={heroImages[4].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Bottom center — small accent */}
                <motion.div
                  className="absolute"
                  style={{ bottom: '5%', left: '35%', zIndex: 11 }}
                  animate={floatAnimation(6.5, 2)}
                >
                  <div
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden shadow-2xl"
                    style={{
                      transform: 'rotate(-2deg)',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
                    }}
                  >
                    <img
                      src={heroImages[5].src}
                      alt={heroImages[5].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Abstract Shapes */}
                <AbstractShape
                  shape="ring"
                  delay={1}
                  style={{ top: '40%', left: '-5%' }}
                />
                <AbstractShape
                  shape="cube"
                  delay={1.8}
                  style={{ bottom: '35%', right: '-2%' }}
                />
                <AbstractShape
                  shape="dot"
                  delay={0.6}
                  style={{ top: '70%', left: '25%' }}
                />
                <AbstractShape
                  shape="dot"
                  delay={2.2}
                  style={{ top: '25%', right: '30%' }}
                />
              </div>

              {/* ===== FLOATING GLASS CARD ===== */}
              <motion.div
                className="absolute bottom-0 right-0 sm:bottom-4 sm:right-2 lg:-bottom-4 lg:right-0 z-20"
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  delay: 1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div
                  className="hero-glass-card p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] max-w-[260px] sm:max-w-xs"
                  style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px) saturate(1.5)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                    border: '1px solid var(--glass-border)',
                    boxShadow:
                      '0 20px 50px rgba(0,0,0,0.15), 0 0 40px rgba(124,58,237,0.06)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.1))',
                        border: '1px solid rgba(124,58,237,0.15)',
                      }}
                    >
                      <HiSparkles
                        className="text-base sm:text-lg"
                        style={{ color: '#A855F7' }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3
                        className="text-sm sm:text-[0.9375rem] font-bold leading-tight mb-1"
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          color: 'var(--text-primary)',
                        }}
                      >
                        Creative. Strategic. Impactful.
                      </h3>
                      <p
                        className="text-xs sm:text-[0.75rem] leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        We create visual identities that connect, inspire, and
                        convert.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, var(--bg-primary), transparent)',
        }}
      />
    </section>
  );
}
