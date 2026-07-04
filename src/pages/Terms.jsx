import { HiShieldCheck, HiDocumentText, HiLockClosed, HiScale } from 'react-icons/hi';
import { motion } from 'framer-motion';

const sections = [
  {
    icon: HiDocumentText,
    title: '1. Acceptance of Terms',
    content: 'By accessing and using the Expand Global website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our services or website.',
  },
  {
    icon: HiScale,
    title: '2. Services',
    content: 'Expand Global provides graphic design and branding services including but not limited to logo design, brand identity development, print design, digital design, and UI/UX design. The scope, timeline, and deliverables for each project will be outlined in a separate agreement or proposal.',
  },
  {
    icon: HiLockClosed,
    title: '3. Intellectual Property',
    content: 'Upon full payment for services rendered, the client receives full ownership rights to the final deliverables. Expand Global retains the right to display completed work in our portfolio unless otherwise agreed upon in writing. All preliminary concepts, drafts, and unused ideas remain the intellectual property of Expand Global.',
  },
  {
    icon: HiShieldCheck,
    title: '4. Client Responsibilities',
    content: 'Clients are responsible for providing timely feedback, necessary materials, and accurate information required for project completion. Delays caused by the client may affect project timelines. Clients must ensure they have the legal right to use any materials, images, or content provided to Expand Global.',
  },
  {
    icon: HiDocumentText,
    title: '5. Payment Terms',
    content: 'Payment terms are outlined in individual project proposals. Typically, a deposit is required before work begins, with the remaining balance due upon project completion. Late payments may result in project delays or suspension of services. All prices are in USD unless otherwise specified.',
  },
  {
    icon: HiScale,
    title: '6. Revisions and Modifications',
    content: 'Our standard process includes a set number of revision rounds as specified in the project agreement. Additional revisions beyond the agreed scope may incur extra charges. Major changes to project scope after work has begun may require a revised proposal and additional fees.',
  },
  {
    icon: HiLockClosed,
    title: '7. Confidentiality',
    content: 'Expand Global respects the confidentiality of our clients. Any proprietary information shared during the course of a project will be kept confidential and used solely for the purpose of completing the project. We will not share client information with third parties without explicit consent.',
  },
  {
    icon: HiShieldCheck,
    title: '8. Limitation of Liability',
    content: 'Expand Global shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or inability to deliver services due to circumstances beyond our control. Our total liability is limited to the amount paid by the client for the specific project giving rise to the claim.',
  },
  {
    icon: HiDocumentText,
    title: '9. Termination',
    content: 'Either party may terminate a project agreement with written notice. In the event of termination, the client shall pay for all work completed up to the point of termination. Any materials or concepts developed up to termination remain the property of Expand Global unless full payment for completed work is made.',
  },
  {
    icon: HiScale,
    title: '10. Changes to Terms',
    content: 'Expand Global reserves the right to update or modify these Terms and Conditions at any time without prior notice. Changes will be effective immediately upon posting to our website. We encourage clients to review these terms periodically for any updates.',
  },
];

export default function Terms() {
  return (
    <div className="pt-20">
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-fuchsia-600/5 dark:from-purple-900/20 dark:to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
              Terms &{' '}
              <span className="text-gradient">Conditions</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Please read these terms carefully before using our services. By working with
              Expand Global, you agree to the following terms and conditions.
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-4">
              Last updated: June 2026
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {sections.map(({ icon: Icon, title, content }) => (
              <motion.div
                key={title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="group p-6 sm:p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-purple-600/30 dark:hover:border-purple-400/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-xl text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto mt-12 p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/5 dark:from-purple-900/20 dark:to-fuchsia-900/10 border border-purple-600/20 dark:border-purple-400/20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4">Have Questions?</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              If you have any questions about these terms, please don&apos;t hesitate to contact us.
            </p>
            <motion.a
              href="mailto:hello@expandglobal.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact Us
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
