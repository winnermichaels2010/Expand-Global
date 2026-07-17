import { FaEye, FaFlag, FaGem, FaChartLine, FaStar, FaHeart, FaHandshake, FaLightbulb, FaUserTie, FaChurch, FaHotel, FaGasPump } from 'react-icons/fa';
import { HiBadgeCheck, HiSparkles, HiColorSwatch, HiOfficeBuilding, HiPhotograph, HiTemplate } from 'react-icons/hi';
import { MdTrendingUp } from 'react-icons/md';
import { BsGraphUpArrow } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const team = [
  { name: 'Michael Winner', role: 'Creative Director & Lead Designer', bio: 'With over 5 years of experience in graphic design and branding, Michael founded Expand Global to help businesses build powerful visual identities.' },
  { name: 'Sarah Johnson', role: 'Brand Strategist', bio: 'Sarah brings strategic thinking to every project, ensuring brands connect meaningfully with their target audiences.' },
  { name: 'David Okafor', role: 'UI/UX Designer', bio: 'David specializes in creating intuitive digital experiences that blend aesthetics with functionality.' },
];

export default function About() {
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
              <HiSparkles size={14} />
              Our Story
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              We craft brands<br />that leave a mark
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.7)', lineHeight: 1.7 }}>
              A design studio built on the belief that every business deserves a visual identity as bold as its ambition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: FaEye, label: 'Vision', text: 'To position businesses for visibility, excellence, and confidence through premium solutions.' },
              { icon: FaFlag, label: 'Mission', text: 'To deliver durable, high-quality branding materials that elevate organizational identity and public perception.' },
            ].map(({ icon: Icon, label, text }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group p-8 md:p-10 rounded-2xl hover-lift"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ background: 'var(--color-accent-light)' }}>
                  <Icon className="text-2xl" style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{label}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Challenges</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              The problem we solve
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Businesses struggle with inconsistent branding, poor visibility, and materials that don&apos;t last.
            </p>
          </motion.div>

          {/* Who */}
          <div className="mb-16">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <FaUserTie style={{ color: 'var(--color-accent)' }} />
              Who faces this?
            </h3>
            <motion.div
              className="flex flex-wrap gap-3"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {[
                { name: 'Churches', Icon: FaChurch },
                { name: 'Hotels', Icon: FaHotel },
                { name: 'Filling Stations', Icon: FaGasPump },
                { name: 'Sole Proprietors', Icon: FaUserTie },
                { name: 'Growing SMEs', Icon: FaChartLine },
              ].map(({ name, Icon }) => (
                <motion.div
                  key={name}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                >
                  <Icon style={{ color: 'var(--color-accent)' }} />
                  <span className="text-sm font-medium">{name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* What */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <FaEye style={{ color: 'var(--color-accent)' }} />
              What they deal with
            </h3>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {[
                { icon: FaGem, title: 'Lack of uniqueness', desc: 'in brand presentation' },
                { icon: FaHandshake, title: 'Poor visual harmony', desc: 'across team and space' },
                { icon: FaEye, title: 'Weak visibility', desc: 'in a crowded market' },
                { icon: FaStar, title: 'Short-lived materials', desc: 'banners that fade fast' },
                { icon: FaHeart, title: 'Low foot traffic', desc: 'caused by poor branding' },
              ].map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-5 rounded-xl"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-accent-light)' }}>
                    <Icon style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Solutions</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              What we offer
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: HiTemplate, title: 'Polo Branding', desc: 'Staff identity solutions' },
              { icon: HiOfficeBuilding, title: 'Premium Signage', desc: 'Installation & design' },
              { icon: HiPhotograph, title: 'Picture Framing', desc: '& artwork production' },
              { icon: HiColorSwatch, title: 'Custom Photo', desc: 'Birthday & event shoots' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="p-6 rounded-2xl text-center hover-lift"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto" style={{ background: 'var(--color-accent-light)' }}>
                  <Icon className="text-xl" style={{ color: 'var(--color-accent)' }} />
                </div>
                <h4 className="font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: HiBadgeCheck, title: 'Easier identification', desc: 'of staff and business location' },
              { icon: FaStar, title: 'Long-lasting signage', desc: 'that withstands the elements' },
              { icon: FaGem, title: 'Premium positioning', desc: 'that elevates brand perception' },
              { icon: FaLightbulb, title: 'Imagination made visible', desc: 'turning ideas into excellence' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="flex items-start gap-4 p-6 rounded-2xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-accent-light)' }}>
                  <Icon style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{title}</h4>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Our Edge</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Why choose us
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: FaStar, title: 'Durable Signage', desc: 'Longer lasting than flex banners' },
              { icon: BsGraphUpArrow, title: 'Volume Pricing', desc: 'Better rates at scale' },
              { icon: FaGem, title: 'Premium Focus', desc: 'Excellence in every detail' },
              { icon: FaLightbulb, title: 'Creative + Technical', desc: 'Design meets expert installation' },
              { icon: MdTrendingUp, title: 'Fast Growing', desc: 'Rising presence in the region' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="p-6 rounded-2xl hover-lift"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <Icon className="text-2xl mb-4" style={{ color: 'var(--color-accent)' }} />
                <h4 className="font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Principles</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Our values
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: HiSparkles, title: 'Creativity First', desc: 'We push boundaries to deliver unique, memorable designs that stand out.' },
              { icon: HiBadgeCheck, title: 'Quality Driven', desc: 'Every pixel matters. We obsess over details to ensure exceptional results.' },
              { icon: FaHeart, title: 'Client Centric', desc: 'Your vision is our priority. We collaborate closely to bring your ideas to life.' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="p-8 rounded-2xl hover-lift"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--color-accent-light)' }}>
                  <Icon className="text-xl" style={{ color: 'var(--color-accent)' }} />
                </div>
                <h4 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>People</span>
            <h2 className="text-4xl sm:text-5xl mb-5" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
              Meet the team
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="p-8 rounded-2xl hover-lift"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: 'var(--color-accent)' }}>
                  <span className="text-xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h4 className="font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{member.name}</h4>
                <p className="text-sm mb-3" style={{ color: 'var(--color-accent)' }}>{member.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'var(--color-accent)' }}>
        <div className="grain-overlay absolute inset-0" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full" style={{ background: 'hsl(0 0% 100% / 0.06)', filter: 'blur(80px)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Ready to elevate your brand?
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.75)' }}>
              Let&apos;s collaborate and create something remarkable together.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-xl transition-all duration-200 pressable"
              style={{ background: 'white', color: 'var(--color-accent-hover)' }}
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
