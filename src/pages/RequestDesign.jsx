import { useState } from 'react';
import { HiPaperAirplane, HiPhotograph, HiColorSwatch, HiTemplate, HiOfficeBuilding } from 'react-icons/hi';
import { FaPalette, FaBullhorn, FaLaptopCode } from 'react-icons/fa';

const designServices = [
  { icon: FaPalette, label: 'Logo Design' },
  { icon: FaBullhorn, label: 'Brand Identity' },
  { icon: FaLaptopCode, label: 'UI/UX Design' },
  { icon: HiTemplate, label: 'Polo Branding' },
  { icon: HiOfficeBuilding, label: 'Signage Design' },
  { icon: HiPhotograph, label: 'Photo Framing' },
  { icon: HiColorSwatch, label: 'Custom Artwork' },
  { icon: HiPhotograph, label: 'Birthday/Event Design' },
];

export default function RequestDesign() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    description: '',
    budget: '',
    timeline: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', service: '', description: '', budget: '', timeline: '' });
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-purple-500/10 to-purple-600/10 dark:from-purple-900/20 dark:via-transparent dark:to-purple-900/10" />
        <div className="relative z-10 text-center max-w-lg mx-auto px-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mx-auto mb-6 animate-bounce shadow-xl shadow-purple-600/30">
            <HiPaperAirplane className="text-4xl text-white rotate-45" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Request Submitted!</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Thank you for your design request. We'll review the details and get back to you within 24-48 hours with a custom proposal.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-3 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white font-medium rounded-full transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 via-purple-500/10 to-purple-600/10 dark:from-purple-900/20 dark:via-transparent dark:to-purple-900/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Request a{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Design
              </span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Tell us about your project and we'll create a custom solution tailored to your brand.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {designServices.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 text-center group cursor-pointer"
                onClick={() => setFormData({ ...formData, service: label })}
              >
                <Icon className={`text-2xl mx-auto mb-2 transition-colors duration-300 ${
                  formData.service === label ? 'text-purple-600' : 'text-purple-400 group-hover:text-purple-600'
                }`} />
                <span className={`text-xs font-medium ${
                  formData.service === label ? 'text-purple-600 dark:text-purple-400' : 'text-[var(--text-secondary)]'
                }`}>{label}</span>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                  >
                    <option value="">Select budget range</option>
                    <option value="Under $500">Under $500</option>
                    <option value="$500 - $1,000">$500 - $1,000</option>
                    <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                    <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                    <option value="$5,000+">$5,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Service Needed *</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                >
                  <option value="">Select a service</option>
                  {designServices.map(({ label }) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP (Within a week)">ASAP (Within a week)</option>
                  <option value="1-2 Weeks">1-2 Weeks</option>
                  <option value="2-4 Weeks">2-4 Weeks</option>
                  <option value="1-2 Months">1-2 Months</option>
                  <option value="Flexible / Not sure">Flexible / Not sure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Description *</label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-600 transition-all duration-200 resize-none"
                  placeholder="Describe your project in detail... What do you need? Any specific requirements, colors, styles, or references?"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Submit Design Request
                <HiPaperAirplane className="rotate-45" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}