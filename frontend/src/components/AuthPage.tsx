import { useState } from 'react';
import { Scale, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface AuthPageProps {
  onBack: () => void;
}

export function AuthPage({ onBack }: AuthPageProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
      const res = await api.post(endpoint, payload);
      login(res.data.token, res.data.user);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-md">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm mb-8 transition-colors group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </button>

        {/* Card */}
        <div className="card p-8 shadow-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Scale className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-blue-950">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {mode === 'login' ? 'Sign in to your LexiBot account' : 'Start your legal consultation today'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={cn(
                  'flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200',
                  mode === m
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  name="name" type="text" autoComplete="name"
                  value={form.name} onChange={handleChange}
                  placeholder="John Doe" required
                  className="input-field"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                name="email" type="email" autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="john@example.com" required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={form.password} onChange={handleChange}
                  placeholder={mode === 'signup' ? 'Min 8 chars, upper, lower & number' : '••••••••'}
                  required className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={isLoading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-base"
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-6 leading-relaxed">
            By continuing, you agree that LexiBot provides informational content only,
            not legal advice. Consult a licensed attorney for legal matters.
          </p>
        </div>
      </div>
    </div>
  );
}
