import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane } from 'react-icons/hi';
import { FaInstagram, FaBehance, FaDribbble, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Get in{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Have a project in mind? We'd love to hear about it. Send us a message 
              and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                    <HiPaperAirplane className="text-2xl text-purple-600 dark:text-purple-400 rotate-45" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-[var(--text-secondary)] mb-6">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-200 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                      placeholder="Project Discussion"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200 resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 cursor-pointer"
                  >
                    Send Message
                    <HiPaperAirplane className="rotate-45" />
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <HiMail className="text-xl text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-sm text-[var(--text-secondary)]">hello@expandglobal.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <HiPhone className="text-xl text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Phone</p>
                      <p className="text-sm text-[var(--text-secondary)]">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                    <HiLocationMarker className="text-xl text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Location</p>
                      <p className="text-sm text-[var(--text-secondary)]">Lagos, Nigeria</p>
                    </div>
                  </div>
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
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-200"
                      aria-label={label}
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/10 to-purple-400/5 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-600/20 dark:border-purple-400/20">
                <h3 className="text-lg font-semibold mb-2">Let's Create Together</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  We're always excited to take on new challenges. Whether you need a 
                  complete brand overhaul or a stunning new design, we're here to help 
                  bring your vision to life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}