import { FaPalette, FaBullhorn, FaLaptopCode, FaPenFancy, FaChurch, FaHotel, FaGasPump, FaUserTie, FaEye, FaFlag, FaCrosshairs, FaGem, FaChartLine, FaStar, FaHeart, FaHandshake } from 'react-icons/fa';
import { HiBadgeCheck, HiSparkles, HiLightBulb, HiEye, HiColorSwatch, HiOfficeBuilding, HiPhotograph, HiTemplate } from 'react-icons/hi';
import { MdBusinessCenter, MdPeople, MdTrendingUp } from 'react-icons/md';
import { BsBuilding, BsPeople, BsGraphUpArrow, BsLightbulb, BsEye, BsImage } from 'react-icons/bs';
import { Link } from 'react-router-dom';

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

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-purple-600/5 dark:from-purple-900/20 dark:to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-down">
              About{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Expand Global
              </span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed animate-fade-in-up">
              We are a passionate team of designers and brand strategists dedicated to helping 
              businesses create meaningful visual identities. Our mission is to empower brands 
              to expand their reach through exceptional design.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 group">
              <FaEye className="text-4xl text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To position businesses for visibility, excellence, and confidence through premium solutions.
              </p>
            </div>
            <div className="p-10 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 group">
              <FaFlag className="text-4xl text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                To deliver durable, high-quality branding materials that elevate organization identity and public perception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              The{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Problem
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              We understand the challenges businesses face today.
            </p>
          </div>

          {/* Who Has The Problem */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaUserTie className="text-purple-600 dark:text-purple-400" />
              Who Has The Problem?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['Churches', 'Hotels', 'Filling Stations', 'Sole Proprietors', 'Growing SMEs'].map((item, i) => (
                <div key={item} className="group p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  {i === 0 && <FaChurch className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />}
                  {i === 1 && <FaHotel className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />}
                  {i === 2 && <FaGasPump className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />}
                  {i === 3 && <FaUserTie className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />}
                  {i === 4 && <FaChartLine className="text-2xl text-purple-600 dark:text-purple-400 mx-auto mb-2" />}
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What Is The Problem */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaCrosshairs className="text-purple-600 dark:text-purple-400" />
              What Is The Problem?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: FaGem, title: 'Lack of uniqueness', desc: 'in brand presentation' },
                { icon: FaHandshake, title: 'Poor visual harmony', desc: 'among staff' },
                { icon: FaEye, title: 'Weak business', desc: 'visibility' },
                { icon: FaStar, title: 'Short lifespan', desc: 'of flex banners' },
                { icon: FaHeart, title: 'Low customer traffic', desc: 'due to poor branding' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-red-400/30 transition-all duration-300 group">
                  <Icon className="text-2xl text-red-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="font-semibold text-sm">{title}</h4>
                  <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Solution
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              What we offer to transform your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: HiTemplate, title: 'Polo Branding', desc: 'for staff identity' },
              { icon: HiOfficeBuilding, title: 'Premium Signage', desc: 'installation' },
              { icon: HiPhotograph, title: 'Picture Framing', desc: '& artwork production' },
              { icon: HiColorSwatch, title: 'Birthday/Custom', desc: 'photo production' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <Icon className="text-2xl text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] text-center">{desc}</p>
              </div>
            ))}
          </div>

          {/* Our Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: HiBadgeCheck, title: 'Easier identification', desc: 'of staff and business location' },
              { icon: FaStar, title: 'Long-lasting', desc: 'signage solutions' },
              { icon: FaGem, title: 'Premium brand', desc: 'positioning' },
              { icon: FaLightbulb, title: 'Turning imagination', desc: 'into visible excellence' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 group">
                <Icon className="text-3xl text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Makes Us{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Different
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              We don't just print, <strong>we elevate brands</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FaStar, title: 'Durable Signage', desc: 'Longer lasting than flex banners' },
              { icon: BsGraphUpArrow, title: 'Volume Pricing', desc: 'Volume-based pricing advantage' },
              { icon: FaGem, title: 'Premium Focus', desc: 'Focus on excellence and brand perception' },
              { icon: FaLightbulb, title: 'Creative Blend', desc: 'Blend of creativity and technical installation' },
              { icon: MdTrendingUp, title: 'Fast Growing', desc: 'Fast-growing presence in the region' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 group">
                <Icon className="text-3xl text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Market{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h2>
          </div>

          {/* Target Market */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaCrosshairs className="text-purple-600 dark:text-purple-400" />
              Target Market
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Churches', icon: FaChurch },
                { name: 'Filling Stations', icon: FaGasPump },
                { name: 'Hotels', icon: FaHotel },
                { name: 'Sole Proprietors', icon: FaUserTie },
              ].map(({ name, icon: Icon }) => (
                <div key={name} className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 text-center group">
                  <Icon className="text-3xl text-purple-600 dark:text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Potential */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MdTrendingUp className="text-purple-600 dark:text-purple-400" />
              Market Potential
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Branding is becoming a necessity, not luxury',
                'Growing demand for premium signage',
                'Artwork & photo framing create emotional value',
                'Estimated 60-70% growing demand within our region',
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 transition-all duration-300 flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <HiBadgeCheck className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-600/10 to-purple-400/10 border border-purple-600/20 text-center">
              <p className="text-lg font-semibold italic">
                Brand visibility is now strategic
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              The principles that guide every project we undertake.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <Icon className="text-3xl text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Meet the{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-[var(--text-secondary)]">
              The creative minds behind Expand Global.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={member.name}
                className="p-8 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">{member.role}</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Want to work{' '}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              together
            </span>
            ?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Let's discuss your next project and see how we can help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}