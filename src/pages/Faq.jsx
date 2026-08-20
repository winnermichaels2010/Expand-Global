import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChevronDown, FaQuestionCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import PanelHeader from '../components/PanelHeader';

const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Expand Global?',
        a: 'Expand Global is a professional graphic design and branding platform where you can request custom designs including logos, brand identities, print materials, digital designs, and UI/UX designs. We connect clients with expert designers to bring your vision to life.',
      },
      {
        q: 'How do I create an account?',
        a: 'Click the "Sign Up" button on the auth page. You can register using your email and password. Once registered, you\'ll be directed to your personal dashboard where you can start requesting designs.',
      },
      {
        q: 'Is there a mobile app available?',
        a: 'Currently, Expand Global is a web-based platform accessible through any modern browser on desktop, tablet, or mobile devices. The website is fully responsive and works great on all screen sizes.',
      },
    ],
  },
  {
    category: 'Design Requests',
    questions: [
      {
        q: 'How do I request a design?',
        a: 'Navigate to "Request Design" from your sidebar. Fill out the form with your project details including service type, description, timeline, budget, and contact information. Submit the form and the admin will review your request.',
      },
      {
        q: 'What design services are offered?',
        a: 'We offer a wide range of design services including Logo Design, Brand Identity Development, Print Design (flyers, brochures, banners), Digital Design, Social Media Graphics, UI/UX Design, and more.',
      },
      {
        q: 'How long does it take to get a response?',
        a: 'The admin typically reviews and responds to design requests within 24-48 hours. You\'ll receive a notification once your request has been accepted or if the admin needs more information.',
      },
      {
        q: 'Can I include my budget in the request?',
        a: 'Yes! The design request form includes a budget field where you can specify your budget range. The admin will consider this when setting the project price.',
      },
      {
        q: 'What happens after I submit a design request?',
        a: 'After submission, your request appears as "Pending" in your dashboard. The admin will review it and either accept (with pricing) or reject (with a reason). You\'ll be notified of the decision.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'How does the payment system work?',
        a: 'Payment is split into two equal installments. You pay 50% upfront to start the project, and the remaining 50% is due after the admin submits the finished design. All payments are processed securely through Paystack.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept all major payment methods supported by Paystack including debit/credit cards, bank transfers, and USSD payments. All transactions are in Nigerian Naira (NGN).',
      },
      {
        q: 'Is there a refund policy?',
        a: 'No. All payments are final and non-refundable. Once payment has been made, no refunds will be issued under any circumstances. Please review our Terms and Conditions for full details.',
      },
      {
        q: 'How do I pay for a project?',
        a: 'When a design request is accepted, you\'ll see a "Pay Now" button in your Active Requests page. Click it to view the payment breakdown and complete the first 50% payment via Paystack.',
      },
      {
        q: 'When do I pay the remaining balance?',
        a: 'After the admin submits the finished design, a "Pay Remaining" button will appear on your Active Requests page. Click it to pay the remaining 50% and unlock the full design for download.',
      },
      {
        q: 'Can I see my payment history?',
        a: 'Yes! Navigate to "All Transactions" in your sidebar to view a complete history of all your payments including amounts, dates, and payment status.',
      },
      {
        q: 'What happens if I don\'t pay the remaining balance?',
        a: 'The finished design will remain blurred/locked until the remaining balance is paid. You won\'t be able to download the full-resolution design until payment is complete.',
      },
    ],
  },
  {
    category: 'Projects & Deliverables',
    questions: [
      {
        q: 'How do I track my project status?',
        a: 'Your dashboard shows all your requests organized by status: Pending, Active (Accepted), and Completed. Active Requests shows projects in progress with payment status.',
      },
      {
        q: 'Where can I download my finished design?',
        a: 'Once you\'ve paid the full amount (both installments), the project moves to "Completed Design" in your sidebar. You can view and download your finished design files from there.',
      },
      {
        q: 'What file formats will I receive?',
        a: 'File formats depend on the project type and what the admin delivers. Common formats include PNG, JPG, PDF, SVG, and AI files. Check the submitted files in your Completed Design page for details.',
      },
      {
        q: 'Can I see a preview of my design before paying the full amount?',
        a: 'Yes! After the admin submits the design, you\'ll see a blurred preview in your Active Requests. Pay the remaining balance to unlock and download the full design.',
      },
      {
        q: 'What if my request is rejected?',
        a: 'If the admin rejects your request, you\'ll see it in "Rejected Requests" with the reason why. You can review the feedback and submit a new request with the necessary changes.',
      },
      {
        q: 'Can I resubmit a rejected request?',
        a: 'Yes! In the Rejected Requests page, each rejected request has a "Resubmit Request" button that takes you to the request form to submit a new design request.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    questions: [
      {
        q: 'How do I update my profile information?',
        a: 'Your profile information (name, email) is managed through your authentication account. Your profile picture can be updated through your account settings.',
      },
      {
        q: 'How do I change my password?',
        a: 'Password changes can be done through your authentication settings. If you\'re having trouble, you can use the "Forgot Password" option on the login page.',
      },
      {
        q: 'How do I log out?',
        a: 'Click the "Sign Out" button at the bottom of your sidebar. This will securely log you out of your account.',
      },
      {
        q: 'Can I toggle between dark and light mode?',
        a: 'Yes! Use the theme toggle button in your sidebar (showing "Dark Mode" or "Light Mode") to switch between dark and light themes. Your preference is saved automatically.',
      },
    ],
  },
  {
    category: 'Notifications & Communication',
    questions: [
      {
        q: 'How do I receive updates about my projects?',
        a: 'You\'ll receive real-time notifications for important updates like request acceptance, rejection, project submissions, and payment confirmations. Check the bell icon in your navbar.',
      },
      {
        q: 'Can I communicate with the admin about my project?',
        a: 'Yes! Click the "My Requests" button (chevron icon) in the top-right corner on mobile, or use the right sidebar on desktop. This opens a chat panel where you can message the admin about your projects.',
      },
      {
        q: 'What notifications will I receive?',
        a: 'You\'ll receive notifications for: new messages, design request status changes (accepted/rejected), project submissions, payment confirmations, and general information updates.',
      },
    ],
  },
  {
    category: 'Gallery',
    questions: [
      {
        q: 'What is the Gallery?',
        a: 'The Gallery showcases our portfolio of completed design projects. It\'s a great place to see examples of our work and get inspiration for your own design projects.',
      },
      {
        q: 'Can I request a design similar to something in the Gallery?',
        a: 'Absolutely! When submitting a design request, you can reference any gallery image in your description to give the admin a better idea of what you\'re looking for.',
      },
    ],
  },
  {
    category: 'Technical Issues',
    questions: [
      {
        q: 'The website isn\'t loading properly. What should I do?',
        a: 'Try these steps: 1) Clear your browser cache and cookies. 2) Try a different browser. 3) Check your internet connection. 4) If the issue persists, contact us through the Contact page.',
      },
      {
        q: 'My payment failed. What should I do?',
        a: 'If your payment fails, check your card details and try again. Ensure you have sufficient funds. If the issue persists, try a different payment method or contact your bank. You can also reach out to us for support.',
      },
      {
        q: 'I\'m not receiving notifications. How do I fix this?',
        a: 'Ensure notifications are enabled in your browser settings for this website. Try refreshing the page. If you\'re still not receiving notifications, log out and log back in.',
      },
      {
        q: 'The page is showing a loading spinner indefinitely.',
        a: 'This usually means there\'s a connectivity issue. Try refreshing the page. If the problem persists, clear your browser cache or try accessing the site from a different device.',
      },
    ],
  },
];

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

export default function Faq() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return faqData;
    const term = search.toLowerCase();
    return faqData
      .map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
          (item) =>
            item.q.toLowerCase().includes(term) ||
            item.a.toLowerCase().includes(term)
        ),
      }))
      .filter((cat) => cat.questions.length > 0);
  }, [search]);

  const totalResults = filtered.reduce((sum, cat) => sum + cat.questions.length, 0);

  function toggleQuestion(idx) {
    setOpenIndex(openIndex === idx ? null : idx);
  }

  let globalIdx = 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <PanelHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Expand Global"
        onBack={() => navigate('/dashboard')}
        backLabel="Back to Dashboard"
      >
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ background: 'hsl(0 0% 100% / 0.12)', border: '1px solid hsl(0 0% 100% / 0.25)' }}
        >
          <FaQuestionCircle size={14} />
          {totalResults} {totalResults === 1 ? 'question' : 'questions'}
        </div>
      </PanelHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-8">
        <motion.div
          className="p-5 sm:p-6 rounded-2xl"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Search */}
          <div className="relative mb-6">
            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(null);
              }}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 text-sm rounded-xl input-base"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FaSearch className="text-3xl mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                No questions found matching "{search}"
              </p>
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-xs font-medium cursor-pointer"
                style={{ color: 'var(--color-accent)' }}
              >
                Clear search
              </button>
            </div>
          ) : (
            <motion.div
              className="space-y-6"
              variants={staggerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((cat) => (
                <div key={cat.category}>
                  <h3
                    className="text-sm font-semibold mb-3 uppercase tracking-wider"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {cat.category}
                  </h3>
                  <div className="space-y-2">
                    {cat.questions.map((item) => {
                      const idx = globalIdx++;
                      const isOpen = openIndex === idx;
                      return (
                        <motion.div
                          key={idx}
                          variants={itemVariants}
                          className="rounded-xl overflow-hidden"
                          style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-default)',
                          }}
                        >
                          <button
                            onClick={() => toggleQuestion(idx)}
                            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            <span className="text-sm font-medium">{item.q}</span>
                            <FaChevronDown
                              className="text-xs flex-shrink-0 transition-transform duration-200"
                              style={{
                                color: 'var(--text-tertiary)',
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                            />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p
                                  className="px-4 pb-4 text-sm leading-relaxed"
                                  style={{ color: 'var(--text-secondary)' }}
                                >
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
