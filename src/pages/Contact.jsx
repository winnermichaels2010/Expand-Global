import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaInstagram, FaBehance, FaDribbble, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const contactInfo = [
  { icon: HiMail, label: 'Email', value: 'esenichijindu53@gmail.com' },
  { icon: HiPhone, label: 'Phone', value: '+2348160740145' },
  { icon: HiLocationMarker, label: 'Location', value: 'Lagos, Nigeria' },
];

const socialLinks = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaBehance, href: '#', label: 'Behance' },
  { icon: FaDribbble, href: '#', label: 'Dribbble' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
];

const reasons = [
  'Premium quality branding solutions',
  'Fast turnaround times',
  'Dedicated creative team',
  'Customized design approach',
];

export default function Contact() {
  return (
    <div className="pt-20">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>
              Contact
            </span>
            <h1
              className="text-5xl sm:text-6xl mb-6"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              Get in touch
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Have a project in mind? We&apos;d love to hear about it. Reach out to us and
              we&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Left Column */}
            <motion.div
              className="space-y-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <h3
                  className="text-xl font-semibold mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="group flex items-start gap-4 p-5 rounded-xl glass-strong hover-lift"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                        style={{ background: 'var(--color-accent-light)' }}
                      >
                        <Icon style={{ color: 'var(--color-accent)' }} />
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                          {label}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3
                  className="text-xl font-semibold mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Follow Us
                </h3>
                <div className="flex items-center gap-4">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl glass-strong transition-all duration-200"
                      style={{ color: 'var(--text-secondary)' }}
                      aria-label={label}
                      whileHover={{ scale: 1.1, y: -2, color: 'var(--color-accent)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="p-8 rounded-2xl glass-strong hover-lift"
                style={{ border: '1px solid var(--border-default)' }}
              >
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Why Work With Us?
                </h3>
                <ul className="space-y-3">
                  {reasons.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-accent)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
