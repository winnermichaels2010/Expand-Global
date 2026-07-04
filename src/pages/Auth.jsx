import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    { active: strength >= 1, color: 'bg-red-500' },
    { active: strength >= 2, color: 'bg-amber-500' },
    { active: strength >= 3, color: 'bg-emerald-500' },
  ];

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-1">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              bar.active ? bar.color : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <ul className="space-y-1">
        {passwordRequirements.map((req) => {
          const met = req.test(password);
          return (
            <li
              key={req.label}
              className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                met
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  met
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
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
  const { signup, login, loginWithGoogle, currentUser, saveUserProfile } = useAuth();
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

    setLoading(true);
    try {
      if (isLogin) {
        const userCred = await login(email, password);
        redirectUser(userCred.user.email);
      } else {
        const userCred = await signup(email, password);
        await saveUserProfile(userCred.user.uid, {
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
      const msg = err.message
        .replace('Firebase: ', '')
        .replace(/\(auth\/.*\)/, '')
        .replace(/\.$/, '')
        .trim();
      setError(msg || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      await saveUserProfile(result.user.uid, {
        email: result.user.email,
        surname: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: '',
        createdAt: new Date().toISOString(),
      });
      redirectUser(result.user.email);
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-indigo-600/20 dark:from-violet-950/40 dark:via-fuchsia-900/20 dark:to-indigo-950/40" />

      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl" />

      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div
        className="relative w-full max-w-[420px] mx-4"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl blur-xl opacity-30" />
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
                  <span className="text-white font-bold text-xl">EG</span>
                </div>
                <motion.button
                  onClick={toggleDarkMode}
                  className="absolute -right-16 p-2 rounded-xl bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                  aria-label="Toggle theme"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {darkMode ? <BsSun size={16} /> : <BsMoonStars size={16} />}
                </motion.button>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mt-4">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isLogin ? 'Sign in to continue to Expand Global' : 'Join us and start your journey'}
              </p>
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1 mb-8">
              <button
                onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  isLogin
                    ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  !isLogin
                    ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            {successMsg && (
              <motion.div
                className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">{successMsg}</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-200"
                />
              </div>

              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Surname *</label>
                    <input
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      required
                      placeholder="Doe"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="John"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Smith"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 pr-11 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {!isLogin && <PasswordStrength password={password} />}
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 pr-11 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                    >
                      {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
            </div>

            <motion.button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500 text-gray-700 dark:text-gray-200 font-medium flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-violet-600/10 cursor-pointer disabled:opacity-60"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              {isLogin ? 'Continue with Google' : 'Sign up with Google'}
            </motion.button>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline transition-all duration-200 cursor-pointer"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
