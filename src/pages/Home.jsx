import { Link } from 'react-router-dom';
import { HiArrowRight, HiLightBulb, HiEye, HiColorSwatch } from 'react-icons/hi';
import { FaPalette, FaBullhorn, FaLaptopCode, FaQuoteLeft, FaStar } from 'react-icons/fa';
import { MdDesignServices, MdVisibility, MdTimeline } from 'react-icons/md';

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

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient - more purple in light mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-purple-500/10 to-purple-600/10 dark:from-purple-900/20 dark:via-transparent dark:to-purple-900/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-100/30 via-transparent to-transparent dark:from-transparent" />
        
        {/* Animated Circles - more prominent */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Decorative purple grid */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-8 border border-purple-200 dark:border-purple-700/30">
              <FaStar className="text-purple-500" />
              Premium Branding Solutions
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-down" style={{ animationDelay: '200ms' }}>
            We Build{' '}
            <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              Brands
            </span>{' '}
            That{' '}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Expand
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[var(--text-secondary)] mb-10 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            We are a creative design studio specializing in graphic design and branding. 
            We help businesses stand out with unique visual identities that leave lasting impressions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-full transition-all duration-200 shadow-lg shadow-purple-700/30 hover:shadow-purple-700/50 hover:scale-105"
            >
              Start Your Project
              <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 font-medium rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200 hover:border-purple-500"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-purple-400 dark:border-purple-500 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 rounded-full bg-purple-500 animate-scroll-dot" />
          </div>
        </div>
      </section>

      {/* Stats Section - more purple */}
      <section className="py-16 bg-gradient-to-r from-purple-100/50 via-purple-50/30 to-purple-100/50 dark:from-purple-900/20 dark:via-purple-900/10 dark:to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-purple-700/70 dark:text-purple-300/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent dark:via-purple-900/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We{' '}
              <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                Do
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              We offer comprehensive design and branding services to help your business grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="group p-8 rounded-2xl bg-[var(--bg-secondary)] border-2 border-purple-200/50 dark:border-purple-700/20 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-600/10 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-purple-200 dark:bg-purple-900/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-purple-300 dark:group-hover:bg-purple-800/40">
                  <Icon className="text-2xl text-purple-700 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-purple-100/30 via-purple-50/20 to-purple-100/30 dark:from-purple-900/10 dark:via-purple-900/5 dark:to-purple-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our{' '}
              <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                Clients Say
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              Trusted by businesses across various industries.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map(({ quote, author, role }, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-[var(--bg-primary)] border-2 border-purple-200/50 dark:border-purple-700/20 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <FaQuoteLeft className="text-2xl text-purple-400 dark:text-purple-500 mb-4" />
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 italic">
                  "{quote}"
                </p>
                <div>
                  <p className="font-semibold text-sm text-purple-700 dark:text-purple-400">{author}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Showcase Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our{' '}
              <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                Identity
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              A brand built on creativity, quality, and excellence.
            </p>
          </div>
          <div className="flex justify-center animate-fade-in-up">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-purple-400/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <img
                src="/expand-global-logo.jpg"
                alt="Expand Global Logo"
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover ring-4 ring-purple-400/30 group-hover:ring-purple-500/50 transition-all duration-500 shadow-xl shadow-purple-600/20 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 dark:from-purple-900 dark:via-purple-800 dark:to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0tMTIgMGMxLjY1NyAwIDMtMS4zNDMgMy0zcy0xLjM0My0zLTMtMy0zIDEuMzQzLTMgMyAxLjM0MyAzIDMgM3oiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
              Ready to{' '}
              <span className="text-purple-200">
                Elevate
              </span>{' '}
              Your Brand?
            </h2>
            <p className="text-purple-100 mb-8">
              Let's collaborate and create something amazing together. Your brand deserves to be seen.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-700 font-medium rounded-full transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:scale-105 hover:bg-purple-50"
            >
              Get In Touch
              <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}