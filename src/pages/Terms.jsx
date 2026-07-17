import { HiShieldCheck, HiDocumentText, HiLockClosed, HiScale } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sections = [
  { icon: HiDocumentText, title: 'Acceptance of Terms', content: 'By accessing and using the Expand Global website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our services or website.' },
  { icon: HiScale, title: 'Services', content: 'Expand Global provides graphic design and branding services including but not limited to logo design, brand identity development, print design, digital design, and UI/UX design. The scope, timeline, and deliverables for each project will be outlined in a separate agreement or proposal.' },
  { icon: HiLockClosed, title: 'Intellectual Property', content: 'Upon full payment for services rendered, the client receives full ownership rights to the final deliverables. Expand Global retains the right to display completed work in our portfolio unless otherwise agreed upon in writing. All preliminary concepts, drafts, and unused ideas remain the intellectual property of Expand Global.' },
  { icon: HiShieldCheck, title: 'Client Responsibilities', content: 'Clients are responsible for providing timely feedback, necessary materials, and accurate information required for project completion. Delays caused by the client may affect project timelines. Clients must ensure they have the legal right to use any materials, images, or content provided to Expand Global.' },
  { icon: HiDocumentText, title: 'Payment Terms', content: 'Payment terms are outlined in individual project proposals. Typically, a deposit is required before work begins, with the remaining balance due upon project completion. Late payments may result in project delays or suspension of services. All prices are in USD unless otherwise specified.' },
  { icon: HiScale, title: 'Revisions & Modifications', content: 'Our standard process includes a set number of revision rounds as specified in the project agreement. Additional revisions beyond the agreed scope may incur extra charges. Major changes to project scope after work has begun may require a revised proposal and additional fees.' },
  { icon: HiLockClosed, title: 'Confidentiality', content: 'Expand Global respects the confidentiality of our clients. Any proprietary information shared during the course of a project will be kept confidential and used solely for the purpose of completing the project. We will not share client information with third parties without explicit consent.' },
  { icon: HiShieldCheck, title: 'Limitation of Liability', content: 'Expand Global shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or inability to deliver services due to circumstances beyond our control. Our total liability is limited to the amount paid by the client for the specific project giving rise to the claim.' },
  { icon: HiDocumentText, title: 'Termination', content: 'Either party may terminate a project agreement with written notice. In the event of termination, the client shall pay for all work completed up to the point of termination. Any materials or concepts developed up to termination remain the property of Expand Global unless full payment for completed work is made.' },
  { icon: HiScale, title: 'Changes to Terms', content: 'Expand Global reserves the right to update or modify these Terms and Conditions at any time without prior notice. Changes will be effective immediately upon posting to our website. We encourage clients to review these terms periodically for any updates.' },
];

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Terms() {
  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--color-accent)' }} />
        <div className="grain-overlay absolute inset-0" />
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full" style={{ background: 'hsl(0 0% 100% / 0.06)', filter: 'blur(80px)' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'hsl(0 0% 100% / 0.15)', border: '1px solid hsl(0 0% 100% / 0.2)', color: 'white' }}>
              <HiShieldCheck size={14} />
              Legal
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 text-white" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Terms & Conditions
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.7)', lineHeight: 1.7 }}>
              Please read these terms carefully before using our services.
            </p>
            <p className="text-sm mt-4" style={{ color: 'hsl(0 0% 100% / 0.5)' }}>
              Last updated: June 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-4"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {sections.map(({ icon: Icon, title, content }, i) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="group flex gap-5 p-6 sm:p-7 rounded-2xl transition-all duration-300"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: 'var(--color-accent-light)' }}>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>{i + 1}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-16 p-8 sm:p-10 rounded-2xl text-center"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Have questions?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              If anything is unclear, feel free to reach out. We&apos;re happy to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 font-semibold rounded-xl transition-all duration-200 pressable"
                style={{ background: 'var(--color-accent)', color: 'white' }}
              >
                Contact Us
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-7 py-3 font-semibold rounded-xl transition-all duration-200 pressable"
                style={{ border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
