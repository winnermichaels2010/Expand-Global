import { FaEye, FaFlag, FaGem, FaChartLine, FaStar, FaHeart, FaHandshake, FaLightbulb, FaUserTie, FaChurch, FaHotel, FaGasPump } from 'react-icons/fa';
import { HiBadgeCheck, HiSparkles, HiColorSwatch, HiOfficeBuilding, HiPhotograph, HiTemplate } from 'react-icons/hi';
import { MdTrendingUp } from 'react-icons/md';
import { BsGraphUpArrow } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const values = [
  {
    icon: HiSparkles,
    title: 'Creativity First',
    description: 'We push boundaries to deliver unique, memorable designs that stand out.',
  },
  {
    icon: HiBadgeCheck,
    title: 'Quality Driven',
    description: 'Every pixel matters. We obsess over details to ensure exceptional results.',
  },
  {
    icon: FaHeart,
    title: 'Client Centric',
    description: 'Your vision is our priority. We collaborate closely to bring your ideas to life.',
  },
];

const team = [
  {
    name: 'Michael Winner',
    role: 'Creative Director & Lead Designer',
    bio: 'With over 5 years of experience in graphic design and branding, Michael founded Expand Global to help businesses build powerful visual identities.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Brand Strategist',
    bio: 'Sarah brings strategic thinking to every project, ensuring brands connect meaningfully with their target audiences.',
  },
  {
    name: 'David Okafor',
    role: 'UI/UX Designer',
    bio: 'David specializes in creating intuitive digital experiences that blend aesthetics with functionality.',
  },
];

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

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Who We Are</span>
            <h1
              className="text-5xl sm:text-6xl mb-6"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              About Expand Global
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We are a passionate team of designers and brand strategists dedicated to helping
              businesses create meaningful visual identities. Our mission is to empower brands
              to expand their reach through exceptional design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div
              variants={itemVariants}
              className="hover-lift p-10 rounded-2xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <FaEye className="text-4xl mb-6" style={{ color: 'var(--color-accent)' }} />
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
              >
                Our Vision
              </h2>
              <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                To position businesses for visibility, excellence, and confidence through premium solutions.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="hover-lift p-10 rounded-2xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
            >
              <FaFlag className="text-4xl mb-6" style={{ color: 'var(--color-accent)' }} />
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
              >
                Our Mission
              </h2>
              <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">
                To deliver durable, high-quality branding materials that elevate organization identity and public perception.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Challenges</span>
            <h2
              className="text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              The Problem
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
              We understand the challenges businesses face today.
            </p>
          </motion.div>

          <div className="mb-16">
            <h3
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <FaUserTie style={{ color: 'var(--color-accent)' }} />
              Who Has The Problem?
            </h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
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
                  className="hover-lift p-5 rounded-xl text-center"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
                >
                  <Icon
                    className="text-2xl mx-auto mb-2"
                    style={{ color: 'var(--color-accent)' }}
                  />
                  <span className="text-sm font-medium">{name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <h3
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <FaEye style={{ color: 'var(--color-accent)' }} />
              What Is The Problem?
            </h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {[
                { icon: FaGem, title: 'Lack of uniqueness', desc: 'in brand presentation' },
                { icon: FaHandshake, title: 'Poor visual harmony', desc: 'among staff' },
                { icon: FaEye, title: 'Weak business', desc: 'visibility' },
                { icon: FaStar, title: 'Short lifespan', desc: 'of flex banners' },
                { icon: FaHeart, title: 'Low customer traffic', desc: 'due to poor branding' },
              ].map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={itemVariants}
                  className="hover-lift p-5 rounded-xl group"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
                >
                  <Icon className="text-2xl mb-3" style={{ color: 'var(--color-accent)' }} />
                  <h4 className="font-semibold text-sm">{title}</h4>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>What We Offer</span>
            <h2
              className="text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              Our Solution
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
              What we offer to transform your brand.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: HiTemplate, title: 'Polo Branding', desc: 'for staff identity' },
              { icon: HiOfficeBuilding, title: 'Premium Signage', desc: 'installation' },
              { icon: HiPhotograph, title: 'Picture Framing', desc: '& artwork production' },
              { icon: HiColorSwatch, title: 'Birthday/Custom', desc: 'photo production' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="hover-lift p-6 rounded-2xl text-center"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                  style={{ background: 'var(--color-accent-light)' }}
                >
                  <Icon className="text-2xl" style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: HiBadgeCheck, title: 'Easier identification', desc: 'of staff and business location' },
              { icon: FaStar, title: 'Long-lasting', desc: 'signage solutions' },
              { icon: FaGem, title: 'Premium brand', desc: 'positioning' },
              { icon: FaLightbulb, title: 'Turning imagination', desc: 'into visible excellence' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="hover-lift p-6 rounded-2xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <Icon className="text-3xl mb-3" style={{ color: 'var(--color-accent)' }} />
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Our Edge</span>
            <h2
              className="text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              What Makes Us Different
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
              We don&apos;t just print, <strong>we elevate brands</strong>
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              { icon: FaStar, title: 'Durable Signage', desc: 'Longer lasting than flex banners' },
              { icon: BsGraphUpArrow, title: 'Volume Pricing', desc: 'Volume-based pricing advantage' },
              { icon: FaGem, title: 'Premium Focus', desc: 'Focus on excellence and brand perception' },
              { icon: FaLightbulb, title: 'Creative Blend', desc: 'Blend of creativity and technical installation' },
              { icon: MdTrendingUp, title: 'Fast Growing', desc: 'Fast-growing presence in the region' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="hover-lift p-6 rounded-2xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
              >
                <Icon className="text-3xl mb-4" style={{ color: 'var(--color-accent)' }} />
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Growth</span>
            <h2
              className="text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              Market Opportunity
            </h2>
          </motion.div>

          <div className="mb-16">
            <h3
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <FaFlag style={{ color: 'var(--color-accent)' }} />
              Target Market
            </h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {[
                { name: 'Churches', icon: FaChurch },
                { name: 'Filling Stations', icon: FaGasPump },
                { name: 'Hotels', icon: FaHotel },
                { name: 'Sole Proprietors', icon: FaUserTie },
              ].map(({ name, icon: Icon }) => (
                <motion.div
                  key={name}
                  variants={itemVariants}
                  className="hover-lift p-6 rounded-xl text-center"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                >
                  <Icon className="text-3xl mx-auto mb-3" style={{ color: 'var(--color-accent)' }} />
                  <span className="font-medium text-sm">{name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <h3
              className="text-xl font-semibold mb-6 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <MdTrendingUp style={{ color: 'var(--color-accent)' }} />
              Market Potential
            </h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {[
                'Branding is becoming a necessity, not luxury',
                'Growing demand for premium signage',
                'Artwork & photo framing create emotional value',
                'Estimated 60-70% growing demand within our region',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="hover-lift p-5 rounded-xl flex items-center gap-3"
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--color-accent-light)' }}
                  >
                    <HiBadgeCheck style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="mt-8 p-8 rounded-2xl text-center"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p
                className="text-lg font-semibold italic"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}
              >
                Brand visibility is now strategic
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Principles</span>
            <h2
              className="text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              Our Values
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
              The principles that guide every project we undertake.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {values.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="hover-lift p-8 rounded-2xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
              >
                <Icon className="text-3xl mb-4" style={{ color: 'var(--color-accent)' }} />
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 md:py-32" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>People</span>
            <h2
              className="text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              Meet the Team
            </h2>
            <p className="max-w-xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
              The creative minds behind Expand Global.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="hover-lift p-8 rounded-2xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {member.name}
                </h3>
                <p className="text-sm mb-3" style={{ color: 'var(--color-accent)' }}>{member.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label-caps mb-4 block" style={{ color: 'var(--color-accent)' }}>Get Started</span>
            <h2
              className="text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}
            >
              Want to work together?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
              Let&apos;s discuss your next project and see how we can help.
            </p>
            <Link
              to="/contact"
              className="pressable inline-flex items-center gap-2 px-9 py-3.5 font-medium rounded-xl transition-all duration-200"
              style={{ background: 'var(--color-accent)', color: 'white' }}
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
