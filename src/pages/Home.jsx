import { Link } from 'react-router-dom';
import { HiArrowRight, HiLightBulb, HiEye, HiColorSwatch } from 'react-icons/hi';
import { FaPalette, FaBullhorn, FaLaptopCode } from 'react-icons/fa';

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

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-purple-600/5 dark:from-purple-900/20 dark:to-transparent" />
        
        {/* Animated Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            We Build{' '}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Brands
            </span>{' '}
            That{' '}
            <span className="bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
              Expand
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[var(--text-secondary)] mb-10">
            We are a creative design studio specializing in graphic design and branding. 
            We help businesses stand out with unique visual identities that leave lasting impressions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
            >
              Start Your Project
              <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3 border border-[var(--border-color)] text-[var(--text-primary)] font-medium rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What We{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Do
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              We offer comprehensive design and branding services to help your business grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/5"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-2xl text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Elevate
              </span>{' '}
              Your Brand?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Let's collaborate and create something amazing together. Your brand deserves to be seen.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
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