import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaInstagram, FaBehance, FaDribbble, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-fuchsia-600/5 dark:from-purple-900/20 dark:to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
              Get in{' '}
              <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Have a project in mind? We&apos;d love to hear about it. Reach out to us and
              we&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  {[
                    { icon: HiMail, label: 'Email', value: 'esenichijindu53@gmail.com' },
                    { icon: HiPhone, label: 'Phone', value: '+2348160740145' },
                    { icon: HiLocationMarker, label: 'Location', value: 'Lagos, Nigeria' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="group flex items-start gap-4 p-5 rounded-xl glass-strong hover:shadow-md transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="text-lg text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Follow Us</h3>
                <div className="flex items-center gap-4">
                  {[
                    { icon: FaInstagram, href: '#', label: 'Instagram' },
                    { icon: FaBehance, href: '#', label: 'Behance' },
                    { icon: FaDribbble, href: '#', label: 'Dribbble' },
                    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl glass-strong text-[var(--text-secondary)] hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                      aria-label={label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Why Work With Us */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-8 rounded-2xl glass-strong border border-[var(--border-color)]">
                <h3 className="text-xl font-semibold mb-4">Why Work With Us?</h3>
                <ul className="space-y-3">
                  {[
                    'Premium quality branding solutions',
                    'Fast turnaround times',
                    'Dedicated creative team',
                    'Customized design approach',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
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
