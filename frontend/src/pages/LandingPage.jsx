import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Compass,
  Zap,
  Award,
  BookOpen,
} from 'lucide-react';
import Button from '../components/ui/Button';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            The Ultimate Campus Event Management Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Connect, Discover & Experience{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              Campus Life
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            CampusConnect bridges students, academic clubs, and campus organizers. Never miss a hackathon, technical workshop, cultural fest, or club meetup again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Go to My Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={Sparkles}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button variant="outline" size="lg" icon={Compass}>
                    Explore Campus Events
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-200/80 dark:border-slate-800 max-w-4xl mx-auto">
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-Time Registration</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">24/7</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Instant Access</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Multi-Role</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Student, Organizer & Admin</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Secure</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JWT Protected APIs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop / Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Everything You Need for Campus Events
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Designed specifically for university ecosystems to streamline event discovery, capacity management, and student participation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-4 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Event Catalog & Search
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Filter by categories like Hackathons, Workshops, Cultural, and Sports. Search in real-time with instant capacity progress tracking.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-4 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Organizer Suite
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Organizers can publish events, manage seat capacities, track real-time student registrations, and view attendee rosters.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-4 hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Role-Based Security
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Backend authorization checks ensure students register safely, organizers control their own events, and administrators moderate the platform.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              How CampusConnect Works
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create Account</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Register as a Student to join events or as an Organizer to host campus initiatives.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Discover & Register</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Browse upcoming events, check seat availability, and register with a single click.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Participate & Connect</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Attend workshops, network with peers, track your registered events on your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ready to Upgrade Your Campus Experience?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base">
              Join thousands of students and organizers discovering and managing campus activities effortlessly.
            </p>
            <div className="pt-4 flex justify-center">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="bg-white text-indigo-700 hover:bg-slate-100">
                  Join CampusConnect Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
