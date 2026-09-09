import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        addToast(`Welcome back, ${data.user.name}!`, 'success');
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
        addToast(data.error || 'Login failed', 'error');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
      addToast('Network error connecting to backend.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-slate-900/60 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 mb-6">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-300">
            Sign in to continue exploring safe water practices.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 focus:ring-offset-slate-900 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-sm text-slate-300">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-400 hover:text-brand-300 transition-colors">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
