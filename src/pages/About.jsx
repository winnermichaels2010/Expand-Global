import { FaPenFancy, FaChurch, FaHotel, FaGasPump, FaUserTie, FaEye, FaFlag, FaCrosshairs, FaGem, FaChartLine, FaStar, FaHeart, FaHandshake, FaLightbulb } from 'react-icons/fa';
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
    icon: FaPenFancy,
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
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-fuchsia-600/5 dark:from-purple-900/20 dark:to-transparent" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
              About{' '}
              <span className="text-gradient">Expand Global</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              We are a passionate team of designers and brand strategists dedicated to helping
              businesses create meaningful visual identities. Our mission is to empower brands
              to expand their reach through exceptional design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-[var(--bg-secondary)] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-fuchsia-100/20 dark:from-purple-900/10 dark:to-fuchsia-900/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div variants={itemVariants} className="group p-10 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <FaEye className="text-4xl text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To position businesses for visibility, excellence, and confidence through premium solutions.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="group p-10 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <FaFlag className="text-4xl text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To deliver durable, high-quality branding materials that elevate organization identity and public perception.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              The{' '}
              <span className="text-gradient">Problem</span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
              We understand the challenges businesses face today.
            </p>
          </motion.div>

          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaUserTie className="text-purple-600 dark:text-purple-400" />
              Who Has The Problem?
            </h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {['Churches', 'Hotels', 'Filling Stations', 'Sole Proprietors', 'Growing SMEs'].map((item, i) => (
                <motion.div key={item} variants={itemVariants} className="group p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 text-center">
                  {i === 0 && <FaChurch className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />}
                  {i === 1 && <FaHotel className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />}
                  {i === 2 && <FaGasPump className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />}
                  {i === 3 && <FaUserTie className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />}
                  {i === 4 && <FaChartLine className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />}
                  <span className="text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaCrosshairs className="text-purple-600 dark:text-purple-400" />
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
                <motion.div key={title} variants={itemVariants} className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-red-400/30 transition-all duration-300 group">
                  <Icon className="text-2xl text-red-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="font-semibold text-sm">{title}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-24 bg-[var(--bg-secondary)] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-fuchsia-100/20 dark:from-purple-900/10 dark:to-fuchsia-900/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Our{' '}
              <span className="text-gradient">Solution</span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
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
              <motion.div key={title} variants={itemVariants} className="group p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-500 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Icon className="text-2xl text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
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
              <motion.div key={title} variants={itemVariants} className="group p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icon className="text-3xl text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              What Makes Us{' '}
              <span className="text-gradient">Different</span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
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
              <motion.div key={title} variants={itemVariants} className="group p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icon className="text-3xl text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-24 bg-[var(--bg-secondary)] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-fuchsia-100/20 dark:from-purple-900/10 dark:to-fuchsia-900/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Market{' '}
              <span className="text-gradient">Opportunity</span>
            </h2>
          </motion.div>

          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaCrosshairs className="text-purple-600 dark:text-purple-400" />
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
                <motion.div key={name} variants={itemVariants} className="group p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 text-center">
                  <Icon className="text-3xl text-purple-600 dark:text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-sm">{name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MdTrendingUp className="text-purple-600 dark:text-purple-400" />
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
                <motion.div key={i} variants={itemVariants} className="group p-5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <HiBadgeCheck className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-purple-600/10 to-fuchsia-500/10 border border-purple-600/20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-lg font-semibold italic">
                Brand visibility is now strategic
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Our{' '}
              <span className="text-gradient">Values</span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
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
                className="group p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icon className="text-3xl text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[var(--bg-secondary)] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-fuchsia-100/20 dark:from-purple-900/10 dark:to-fuchsia-900/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Meet the{' '}
              <span className="text-gradient">Team</span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)] text-lg">
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
                className="group p-8 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-600/20">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">{member.role}</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              Want to work{' '}
              <span className="text-gradient">together</span>
              ?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8">
              Let&apos;s discuss your next project and see how we can help.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-9 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
              >
                Get In Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
