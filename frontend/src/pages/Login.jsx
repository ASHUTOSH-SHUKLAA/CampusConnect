import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Mail, Lock, Sparkles, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      success(`Welcome back, ${loggedUser.name}!`);
      if (loggedUser.role === 'admin') navigate('/admin');
      else if (loggedUser.role === 'organizer') navigate('/organizer');
      else navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Card className="shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your campus dashboard & registered events
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            icon={Mail}
            placeholder="student@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="primary" className="w-full" size="lg" isLoading={loading}>
            Sign In
          </Button>
        </form>

        {/* Demo Quick Fill Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
            Quick Demo Fill
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('student@demo.com', 'password123')}
              className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('organizer@demo.com', 'password123')}
              className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Organizer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@demo.com', 'admin123')}
              className="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register now
          </Link>
        </p>
      </Card>
    </div>
  );
}
