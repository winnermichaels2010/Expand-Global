import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi';
import { FaInstagram, FaBehance, FaDribbble, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const contactDetails = [
  { icon: HiMail, label: 'Email', value: 'esenichijindu53@gmail.com', href: 'mailto:esenichijindu53@gmail.com' },
  { icon: HiPhone, label: 'Phone', value: '+234 816 074 0145', href: 'tel:+2348160740145' },
  { icon: HiLocationMarker, label: 'Location', value: 'Lagos, Nigeria', href: null },
  { icon: HiClock, label: 'Response Time', value: 'Within 24 hours', href: null },
];

const socialLinks = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaBehance, href: '#', label: 'Behance' },
  { icon: FaDribbble, href: '#', label: 'Dribbble' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--color-accent)' }} />
        <div className="grain-overlay absolute inset-0" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full" style={{ background: 'hsl(0 0% 100% / 0.06)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full" style={{ background: 'hsl(0 0% 100% / 0.04)', filter: 'blur(60px)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'hsl(0 0% 100% / 0.15)', border: '1px solid hsl(0 0% 100% / 0.2)', color: 'white' }}>
              <HiMail size={14} />
              Contact
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Let&apos;s talk
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.7)', lineHeight: 1.7 }}>
              Have a project in mind? We&apos;d love to hear about it. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Left — Info */}
            <motion.div
              className="lg:col-span-2 space-y-10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <h3 className="text-xl mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Get in touch</h3>
                <div className="space-y-3">
                  {contactDetails.map(({ icon: Icon, label, value, href }) => {
                    const Wrapper = href ? 'a' : 'div';
                    return (
                      <Wrapper
                        key={label}
                        {...(href ? { href, target: href.startsWith('mailto') || href.startsWith('tel') ? '_blank' : undefined, rel: 'noopener noreferrer' } : {})}
                        className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover-lift"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ background: 'var(--color-accent-light)' }}>
                          <Icon style={{ color: 'var(--color-accent)' }} />
                        </div>
                        <div>
                          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Follow us</h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
                      aria-label={label}
                      whileHover={{ scale: 1.08, y: -2, color: 'var(--color-accent)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-8 sm:p-10 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Send us a message</h3>
                <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>Fill out the form and we&apos;ll be in touch shortly.</p>

                {submitted && (
                  <div className="mb-6 p-4 rounded-xl text-sm font-medium" style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}>
                    Message sent! We&apos;ll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="input-base"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="input-base"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className="input-base"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your project..."
                      className="input-base resize-none"
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 font-semibold rounded-xl transition-all duration-200 pressable cursor-pointer"
                    style={{ background: 'var(--color-accent)', color: 'white' }}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
