import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { FaPalette, FaBullhorn, FaLaptopCode, FaQuoteLeft, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

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
  { value: '50+', label: 'Projects Completed' },
  { value: '30+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '15+', label: 'Awards Won' },
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
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
  hover: {
    y: -6,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const coverPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80',
    title: 'Brand Identity',
    subtitle: 'Crafting visual stories that resonate',
  },
  {
    url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1600&q=80',
    title: 'Graphic Design',
    subtitle: 'Where creativity meets precision',
  },
  {
    url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80',
    title: 'Digital Art',
    subtitle: 'Pixel-perfect experiences',
  },
  {
    url: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1600&q=80',
    title: 'Brand Strategy',
    subtitle: 'Building brands that matter',
  },
  {
    url: 'https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=1600&q=80',
    title: 'Creative Excellence',
    subtitle: 'Design that speaks volumes',
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef(null);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = (index) => {
    if (transitioning) return;
    const target = (index + coverPhotos.length) % coverPhotos.length;
    if (target === activeIndex) return;
    setTransitioning(true);
    setActiveIndex(target);
    setTimeout(() => setTransitioning(false), 800);
  };

  const handlePointerDown = (e) => {
    pointerStart.current = e.pageX;
  };

  const handlePointerUp = (e) => {
    if (pointerStart.current === null) return;
    const diff = pointerStart.current - e.pageX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? activeIndex + 1 : activeIndex - 1);
    }
    pointerStart.current = null;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goTo(activeIndex + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, transitioning]);

  return (
    <div>
      {/* Cover Photo Carousel */}
      <section
        className="relative h-[300px] sm:h-[450px] lg:h-[600px] overflow-hidden select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <AnimatePresence>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img
              src={coverPhotos[activeIndex].url}
              alt={coverPhotos[activeIndex].title}
              className="w-full h-full object-cover"
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-3xl">
                <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-3 tracking-tight drop-shadow-lg">
                  {coverPhotos[activeIndex].title}
                </h1>
                <p className="text-base sm:text-xl lg:text-2xl text-white/90 font-light drop-shadow">
                  {coverPhotos[activeIndex].subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {coverPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'bg-white w-6'
                  : 'bg-white/40 hover:bg-white/60 w-2.5'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/40 via-purple-50/20 to-fuchsia-100/30 dark:from-purple-900/15 dark:via-purple-900/5 dark:to-fuchsia-900/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} className="text-center" variants={itemVariants}>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-purple-700/60 dark:text-purple-300/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent dark:via-purple-900/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              What We{' '}
              <span className="text-gradient">Do</span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
              We offer comprehensive design and branding services to help your business grow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: '-50px' }}
                className="group p-10 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-500/40 dark:hover:border-purple-400/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-purple-500/30 group-hover:to-fuchsia-500/30 transition-all duration-300">
                    <Icon className="text-2xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">{title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 via-purple-50/15 to-fuchsia-100/20 dark:from-purple-900/8 dark:via-purple-900/3 dark:to-fuchsia-900/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              What Our{' '}
              <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
              Trusted by businesses across various industries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map(({ quote, author, role }, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="p-10 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-500/30 dark:hover:border-purple-400/20 transition-all duration-500 relative"
              >
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                  <FaQuoteLeft className="text-white text-lg" />
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-8 italic text-lg mt-4">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm">
                    {author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-purple-700 dark:text-purple-400">{author}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Showcase Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Our{' '}
              <span className="text-gradient">Identity</span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
              A brand built on creativity, quality, and excellence.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="group relative"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-fuchsia-500/30 rounded-full blur-3xl group-hover:blur-[60px] transition-all duration-700" />
              <div className="absolute inset-0 rounded-full animate-pulse-glow" />
              <img
                src="/expand-global-logo.jpg"
                alt="Expand Global Logo"
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover ring-4 ring-purple-400/30 group-hover:ring-purple-500/50 transition-all duration-500 shadow-2xl shadow-purple-600/20"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 dark:from-purple-900 dark:via-purple-800 dark:to-fuchsia-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMTIgMGMxLjY1NyAwIDMtMS4zNDMgMy0zcy0xLjM0My0zLTMtMy0zIDEuMzQzLTMgMyAxLjM0MyAzIDMgM3oiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white tracking-tight">
              Ready to{' '}
              <span className="text-purple-200">
                Elevate
              </span>{' '}
              Your Brand?
            </h2>
            <p className="text-purple-100/80 text-lg mb-10 max-w-xl mx-auto">
              Let&apos;s collaborate and create something amazing together. Your brand deserves to be seen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-9 py-3.5 bg-white text-purple-700 font-medium rounded-xl transition-all duration-300 shadow-2xl shadow-black/15 hover:shadow-black/25 hover:bg-purple-50"
                >
                  Get Started
                  <HiArrowRight />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-9 py-3.5 border-2 border-white/30 text-white font-medium rounded-xl transition-all duration-300 hover:bg-white/10"
                >
                  Get In Touch
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
