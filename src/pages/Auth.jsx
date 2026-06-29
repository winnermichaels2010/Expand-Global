import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiMail, HiLockClosed, HiSparkles } from 'react-icons/hi';
import { BsShieldCheck } from 'react-icons/bs';

const floatingShapes = [
  { size: 'w-16 h-16', top: '10%', left: '5%', delay: '0s', color: 'from-purple-500/30 to-purple-300/10' },
  { size: 'w-24 h-24', top: '60%', left: '10%', delay: '2s', color: 'from-purple-600/20 to-purple-400/10' },
  { size: 'w-12 h-12', top: '30%', right: '5%', delay: '4s', color: 'from-purple-400/30 to-purple-200/10' },
  { size: 'w-20 h-20', top: '70%', right: '8%', delay: '1s', color: 'from-purple-500/25 to-purple-300/10' },
  { size: 'w-14 h-14', top: '50%', left: '50%', delay: '3s', color: 'from-purple-400/20 to-purple-200/10' },
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { signup, login, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  const brandSlides = [
    {
      icon: HiSparkles,
      title: 'Elevate Your Brand',
      desc: 'Premium design & branding solutions that make your business stand out.',
    },
    {
      icon: BsShieldCheck,
      title: 'Professional Quality',
      desc: 'Durable signage, stunning visuals, and identity that commands attention.',
    },
    {
      icon: HiMail,
      title: 'Creative Excellence',
      desc: 'Where imagination meets visible excellence for your organization.',
    },
  ];

  useEffect(() => {
    if (currentUser) {
      if (currentUser.email === 'winnermichael@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % brandSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
        if (userCred.user.email === 'winnermichael@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        await signup(email, password);
        setSuccessMsg('Account created successfully! You can now sign in.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
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
      if (result.user.email === 'winnermichael@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Showcase (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        {/* Animated shapes */}
        {floatingShapes.map((shape, i) => (
          <div
            key={i}
            className={`absolute ${shape.size} rounded-full bg-gradient-to-br ${shape.color} blur-2xl animate-float`}
            style={{ top: shape.top, left: shape.left, right: shape.right, animationDelay: shape.delay }}
          />
        ))}
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">EG</span>
            </div>
            <span className="text-white font-bold text-xl">Expand Global</span>
          </div>

          {/* Rotating Brand Messages */}
          <div className="space-y-8">
            <div className="transition-all duration-500 ease-in-out" key={activeIndex}>
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                {brandSlides[activeIndex].icon === HiSparkles && <HiSparkles className="text-3xl text-purple-200" />}
                {brandSlides[activeIndex].icon === BsShieldCheck && <BsShieldCheck className="text-3xl text-purple-200" />}
                {brandSlides[activeIndex].icon === HiMail && <HiMail className="text-3xl text-purple-200" />}
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                {brandSlides[activeIndex].title}
              </h2>
              <p className="text-lg text-purple-200/80 leading-relaxed max-w-md">
                {brandSlides[activeIndex].desc}
              </p>
            </div>

            {/* Dots */}
            <div className="flex gap-2">
              {brandSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom text */}
          <p className="text-purple-200/60 text-sm">
            Premium branding solutions for forward-thinking businesses
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden">
        {/* Mobile-only background */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-purple-700/10 via-purple-500/5 to-purple-600/10 dark:from-purple-900/20 dark:via-transparent" />
        
        {/* Mobile floating shapes */}
        <div className="lg:hidden absolute top-10 left-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="lg:hidden absolute bottom-10 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-700 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-600/30">
              <span className="text-white font-bold text-2xl">EG</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                className="text-purple-700 dark:text-purple-400 font-semibold hover:underline transition-all duration-200 cursor-pointer"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 backdrop-blur-sm animate-fade-in-down">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 backdrop-blur-sm animate-fade-in-down">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email address
              </label>
              <div className="relative group">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors duration-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-100/80 dark:bg-white/5 border-2 border-transparent focus:border-purple-600 dark:focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative group">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors duration-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-gray-100/80 dark:bg-white/5 border-2 border-transparent focus:border-purple-600 dark:focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm password
                </label>
                <div className="relative group">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors duration-200" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-gray-100/80 dark:bg-white/5 border-2 border-transparent focus:border-purple-600 dark:focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 cursor-pointer"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white font-semibold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-purple-800 to-transparent" />
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-purple-800 to-transparent" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-500 text-gray-700 dark:text-gray-200 font-medium flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/10 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
          >
            <FaGoogle className="text-red-500 text-lg" />
            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
          </button>

          {/* Mobile Toggle */}
          <div className="lg:hidden mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                className="font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline transition-all duration-200 cursor-pointer"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}