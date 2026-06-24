import { FaPalette, FaBullhorn, FaLaptopCode, FaPenFancy } from 'react-icons/fa';
import { HiBadgeCheck, HiSparkles } from 'react-icons/hi';
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Expand Global
              </span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              We are a passionate team of designers and brand strategists dedicated to helping 
              businesses create meaningful visual identities. Our mission is to empower brands 
              to expand their reach through exceptional design.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Our{' '}
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  Story
                </span>
              </h2>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  Expand Global was born from a simple belief: every brand deserves to be seen. 
                  What started as a freelance graphic design project grew into a full-service 
                  branding agency that helps businesses of all sizes make their mark.
                </p>
                <p>
                  We've had the privilege of working with startups, established companies, and 
                  nonprofits across various industries, creating brand identities that resonate 
                  with audiences and drive growth.
                </p>
                <p>
                  Our approach combines strategic thinking with creative excellence. We take 
                  the time to understand your business, your audience, and your goals before 
                  crafting a visual identity that truly represents who you are.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Projects</div>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">30+</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Clients</div>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">5+</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Years</div>
              </div>
              <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">15+</div>
                <div className="text-sm text-[var(--text-secondary)] mt-1">Awards</div>
              </div>
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
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-300"
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
            {team.map((member) => (
              <div
                key={member.name}
                className="p-8 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-300"
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