import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { FaPalette, FaBullhorn, FaLaptopCode, FaQuoteLeft, FaPlay, FaTimes, FaExpand } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';

const services = [
  {
    icon: FaPalette,
    title: 'Graphic Design',
    description: 'Eye-catching visuals that communicate your brand story and captivate your audience.',
  },
  {
    icon: FaBullhorn,
    title: 'Brand Identity',
    description: 'Complete branding solutions including logos, color schemes, and brand guidelines.',
  },
  {
    icon: FaLaptopCode,
    title: 'Digital Design',
    description: 'Modern UI/UX design for websites and applications that engage users.',
  },
];

const stats = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 30, suffix: '+', label: 'Happy Clients' },
  { value: 5, suffix: '+', label: 'Years in the Game' },
  { value: 15, suffix: '+', label: 'Awards Won' },
];

const testimonials = [
  {
    quote: 'Expand Global completely transformed our brand identity. The quality and attention to detail exceeded our expectations.',
    author: 'John Adeyemi',
    role: 'CEO, TechVibe Solutions',
  },
  {
    quote: 'Their premium signage solutions are unmatched. Durable, beautiful, and truly professional.',
    author: 'Grace Okonkwo',
    role: 'Manager, Royal Heritage Hotel',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function CountUp({ target, suffix = '', duration = 1.8 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const galleryImages = [
  { src: '/images/IMG-20260703-WA0003.jpg', alt: 'Branding project' },
  { src: '/images/IMG-20260703-WA0005.jpg', alt: 'Design work' },
  { src: '/images/IMG-20260703-WA0006.jpg', alt: 'Signage project' },
  { src: '/images/IMG-20260703-WA0007.jpg', alt: 'Creative design' },
  { src: '/images/IMG-20260703-WA0008.jpg', alt: 'Logo concept' },
  { src: '/images/IMG-20260703-WA0009.jpg', alt: 'Brand collateral' },
  { src: '/images/IMG-20260703-WA0010~2.jpg', alt: 'Print material' },
  { src: '/images/IMG-20260703-WA0011~3.jpg', alt: 'Digital design' },
  { src: '/images/IMG-20260703-WA0013~2.jpg', alt: 'Product design' },
  { src: '/images/IMG-20260703-WA0014~2.jpg', alt: 'Brand guideline' },
  { src: '/images/IMG-20260703-WA0034.jpg', alt: 'Identity design' },
  { src: '/images/IMG-20260703-WA0038.jpg', alt: 'Packaging work' },
  { src: '/images/IMG-20260703-WA0039.jpg', alt: 'Visual identity' },
  { src: '/images/IMG-20260703-WA0040~2.jpg', alt: 'Marketing design' },
  { src: '/images/IMG-20260703-WA0044~2.jpg', alt: 'Campaign creative' },
];

const galleryVideos = [
  '/videos/VID-1.mp4',
  '/videos/VID-2.mp4',
  '/videos/VID-3.mp4',
  '/videos/VID-4.mp4',
  '/videos/VID-5.mp4',
  '/videos/VID-6.mp4',
  '/videos/VID-7.mp4',
  '/videos/VID-8.mp4',
  '/videos/VID-9.mp4',
  '/videos/VID-10.mp4',
  '/videos/VID-11.mp4',
  '/videos/VID-12.mp4',
  '/videos/VID-13.mp4',
  '/videos/VID-14.mp4',
  '/videos/VID-15.mp4',
  '/videos/VID-16.mp4',
  '/videos/VID-17.mp4',
  '/videos/VID-18.mp4',
  '/videos/VID-19.mp4',
  '/videos/VID-20.mp4',
  '/videos/VID-21.mp4',
];

export default function Home() {
  const [videoModal, setVideoModal] = useState({ open: false, src: '' });
  const videoRef = useRef(null);
  const marqueeRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const handleDragStart = (e) => {
    const el = marqueeRef.current;
    if (!el) return;
    dragState.current = { isDragging: true, startX: e.pageX || e.touches?.[0]?.pageX || 0, scrollLeft: el.scrollLeft };
    el.classList.add('paused');
  };

  const handleDragMove = (e) => {
    if (!dragState.current.isDragging) return;
    e.preventDefault();
    const el = marqueeRef.current;
    if (!el) return;
    const x = e.pageX || e.touches?.[0]?.pageX || 0;
    const walk = (dragState.current.startX - x) * 1.5;
    el.scrollLeft = dragState.current.scrollLeft + walk;
  };

  const handleDragEnd = () => {
    dragState.current.isDragging = false;
    if (marqueeRef.current) marqueeRef.current.classList.remove('paused');
  };

  const openVideoModal = (src) => setVideoModal({ open: true, src });
  const closeVideoModal = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setVideoModal({ open: false, src: '' });
  };

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <Hero />

      {/* ===== STATS ===== */}
      <section className="py-16 md:py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} className="text-center" variants={itemVariants}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', letterSpacing: '-0.03em' }}>
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs mt-2 label-caps" style={{ color: 'var(--text-tertiary)' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>What We Do</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Design that moves brands forward
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We offer comprehensive design and branding services to help your business grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="group p-8 rounded-2xl transition-all duration-400 hover-lift"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110" style={{ background: 'var(--color-accent-light)' }}>
                  <Icon className="text-xl" style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Portfolio</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              A glimpse into our work
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Projects we&apos;ve brought to life across industries.
            </p>
          </motion.div>

          {/* Images Bento Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-20 auto-rows-[140px] sm:auto-rows-[180px]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {galleryImages.map((img, i) => {
              const isLarge = i % 7 === 0;
              const isWide = i % 5 === 2;
              const isTall = i % 4 === 1;
              return (
                <motion.div
                  key={i}
                  custom={i % 6}
                  variants={itemVariants}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                    isLarge ? 'col-span-2 row-span-2' :
                    isWide ? 'col-span-2' :
                    isTall ? 'row-span-2' : ''
                  }`}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-2xl" style={{ border: '1px solid var(--border-default)' }}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-end p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex items-center gap-2">
                        <FaExpand className="text-white/80 text-xs" />
                        <span className="text-white text-sm font-medium">{img.alt}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Videos Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-3xl sm:text-4xl mb-3" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Video highlights
            </h3>
            <p className="text-lg mb-12" style={{ color: 'var(--text-secondary)' }}>
              Watch our creative process in action.
            </p>
            <div
              ref={marqueeRef}
              className="video-marquee-wrap"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="video-marquee-track">
                {[...galleryVideos, ...galleryVideos].map((src, i) => (
                  <div
                    key={i}
                    className="video-marquee-item group relative rounded-xl overflow-hidden cursor-pointer flex-shrink-0"
                    onClick={() => openVideoModal(src)}
                  >
                    <video
                      src={src}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/5 group-hover:from-black/30 transition-all duration-400" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-400"
                        style={{ background: 'hsl(0 0% 100% / 0.12)', backdropFilter: 'blur(8px)', border: '1px solid hsl(0 0% 100% / 0.15)' }}
                      >
                        <FaPlay className="text-white text-sm ml-0.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== VIDEO MODAL ===== */}
      <AnimatePresence>
        {videoModal.open && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'hsl(0 0% 5% / 0.85)', backdropFilter: 'blur(8px)' }}
              onClick={closeVideoModal}
            />
            <motion.div
              className="relative w-full max-w-2xl z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={closeVideoModal}
                className="absolute -top-12 right-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 cursor-pointer z-20"
                style={{ background: 'hsl(0 0% 100% / 0.1)', border: '1px solid hsl(0 0% 100% / 0.15)' }}
              >
                <FaTimes className="text-sm" />
              </button>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid hsl(0 0% 100% / 0.08)', boxShadow: '0 25px 50px hsl(0 0% 0% / 0.5)' }}>
                <video
                  ref={videoRef}
                  src={videoModal.src}
                  className="w-full aspect-video object-cover"
                  style={{ background: 'black' }}
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Testimonials</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              What our clients say
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Trusted by businesses across various industries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map(({ quote, author, role }, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="p-8 md:p-10 rounded-2xl hover-lift"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <FaQuoteLeft className="text-2xl mb-6" style={{ color: 'var(--color-accent-muted)' }} />
                <p className="text-lg leading-relaxed mb-8 italic" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)' }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs" style={{ background: 'var(--color-accent)' }}>
                    {author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{author}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOGO SHOWCASE ===== */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Identity</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              A brand built on craft
            </h2>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative group">
              <div className="absolute -inset-4 rounded-full transition-all duration-500 group-hover:-inset-6" style={{ background: 'hsl(270 60% 50% / 0.06)' }} />
              <img
                src="/expand-global-logo.jpg"
                alt="Expand Global Logo"
                className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover transition-all duration-500"
                style={{ border: '3px solid var(--border-default)' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'var(--color-accent)' }}>
        <div className="grain-overlay absolute inset-0" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full" style={{ background: 'hsl(0 0% 100% / 0.06)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full" style={{ background: 'hsl(0 0% 100% / 0.04)', filter: 'blur(60px)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Ready to elevate your brand?
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.75)' }}>
              Let&apos;s collaborate and create something amazing together. Your brand deserves to be seen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-xl transition-all duration-200 pressable"
                style={{ background: 'white', color: 'var(--color-accent-hover)' }}
              >
                Get Started
                <HiArrowRight />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-xl transition-all duration-200 pressable"
                style={{ border: '2px solid hsl(0 0% 100% / 0.35)', color: 'white' }}
              >
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
