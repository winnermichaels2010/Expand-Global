import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import { BsSun, BsMoonStars } from 'react-icons/bs';
import { motion } from 'framer-motion';

const passwordRequirements = [
  { label: 'At least 6 characters', test: (pw) => pw.length >= 6 },
  { label: 'Contains a number', test: (pw) => /\d/.test(pw) },
  { label: 'Contains a letter', test: (pw) => /[a-zA-Z]/.test(pw) },
];

function PasswordStrength({ password }) { // eslint-disable-line react/prop-types
  const strength = passwordRequirements.filter((r) => r.test(password)).length;
  const bars = [
    { active: strength >= 1, color: '#ef4444' },
    { active: strength >= 2, color: 'hsl(270 60% 50%)' },
    { active: strength >= 3, color: '#10b981' },
  ];

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1">
        {bars.map((bar, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: bar.active ? bar.color : 'var(--border-default)',
            }}
          />
        ))}
      </div>
      <ul className="space-y-1">
        {passwordRequirements.map((req) => {
          const met = req.test(password);
          return (
            <li
              key={req.label}
              className="flex items-center gap-2 text-xs transition-all duration-200"
              style={{ color: met ? '#10b981' : 'var(--text-tertiary)' }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200"
                style={{
                  borderColor: met ? '#10b981' : 'var(--border-strong)',
                  background: met ? '#10b981' : 'transparent',
                }}
              >
                {met && <FaCheck className="text-white text-[6px]" />}
              </div>
              {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const ADMIN_EMAIL = 'adminemail@gmail.com';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { signup, login, currentUser, saveUserProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const redirectUser = (email) => {
    navigate(email === ADMIN_EMAIL ? '/admin' : '/dashboard');
  };

  useEffect(() => {
    if (currentUser) {
      redirectUser(currentUser.email);
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (!isLogin && !agreedToTerms) {
      return setError('You must agree to the Terms & Conditions');
    }

    setLoading(true);
    try {
      if (isLogin) {
        const userCred = await login(email, password);
        redirectUser(userCred.user.email);
      } else {
        const userCred = await signup(email, password, { surname, first_name: firstName, last_name: lastName });
        await saveUserProfile(userCred.user?.id, {
          email,
          surname,
          firstName,
          lastName,
          createdAt: new Date().toISOString(),
        });
        setSuccessMsg('Account created! You can now sign in.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setSurname('');
        setFirstName('');
        setLastName('');
      }
    } catch (err) {
      const msg = (err.message || '')
        .replace(/^Auth[A-Za-z]*Error: /, '')
        .replace(/^[^:]+: /, '')
        .replace(/\.$/, '')
        .trim();
      setError(msg || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 50%, var(--bg-secondary) 100%)',
          opacity: 0.6,
        }}
      />

      <motion.div
        className="relative w-full max-w-[420px] mx-4"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="relative rounded-2xl shadow-lg p-8"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
          }}
        >
          <div className="text-center mb-8">
            <div className="relative flex items-center justify-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden ring-2 ring-white/20 shadow-lg"
                style={{ background: 'var(--color-accent)' }}
              >
                <img src="/expand-global-logo.jpg" alt="Expand Global" className="w-full h-full object-cover" />
              </div>
              <motion.button
                onClick={toggleDarkMode}
                className="absolute -right-16 p-2 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                }}
                aria-label="Toggle theme"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? <BsSun size={16} /> : <BsMoonStars size={16} />}
              </motion.button>
            </div>
            <h1
              className="text-2xl font-bold mt-4"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? 'Sign in to continue to Expand Global' : 'Join us and start your journey'}
            </p>
          </div>

          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
              className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                background: isLogin ? 'var(--bg-elevated)' : 'transparent',
                color: isLogin ? 'var(--color-accent)' : 'var(--text-secondary)',
                boxShadow: isLogin ? 'var(--shadow-sm)' : 'none',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
              className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
              style={{
                background: !isLogin ? 'var(--bg-elevated)' : 'transparent',
                color: !isLogin ? 'var(--color-accent)' : 'var(--text-secondary)',
                boxShadow: !isLogin ? 'var(--shadow-sm)' : 'none',
              }}
            >
              Sign Up
            </button>
          </div>

          {successMsg && (
            <motion.div
              className="mb-6 p-4 rounded-2xl"
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16, 185, 129, 0.15)' }}
                >
                  <svg className="w-4 h-4" style={{ color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: '#047857' }}>{successMsg}</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              className="mb-6 p-4 rounded-2xl"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(239, 68, 68, 0.15)' }}
                >
                  <svg className="w-4 h-4" style={{ color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input-base"
              />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Surname *
                  </label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                    placeholder="Doe"
                    className="input-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="John"
                    className="input-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Smith"
                    className="input-base"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-base"
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 cursor-pointer"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {!isLogin && <PasswordStrength password={password} />}
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="input-base"
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 cursor-pointer"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-[var(--color-accent)]"
                />
                <label htmlFor="agreeTerms" className="text-xs leading-relaxed cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                  I agree to the{' '}
                  <Link to="/terms" className="font-semibold hover:underline" style={{ color: 'var(--color-accent)' }}>
                    Terms &amp; Conditions
                  </Link>
                </label>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading || (!isLogin && !agreedToTerms)}
              className="pressable w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: 'var(--color-accent)' }}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
              className="font-semibold hover:underline transition-all duration-200 cursor-pointer"
              style={{ color: 'var(--color-accent)' }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
