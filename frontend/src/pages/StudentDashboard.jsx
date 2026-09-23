import { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/events/EventCard';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, CheckCircle2, Compass, Sparkles, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState('registered');

  const { user } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [myRes, allRes] = await Promise.all([
        api.get('/registrations/me'),
        api.get('/events'),
      ]);
      setMyEvents(myRes.data);

      const registeredIds = myRes.data.map((e) => e._id);
      setRecommendedEvents(allRes.data.filter((e) => !registeredIds.includes(e._id)));
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
      error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    setCancellingId(eventId);
    try {
      await api.delete(`/events/${eventId}/register`);
      success('Registration cancelled successfully');
      fetchDashboardData();
    } catch (err) {
      error(err.response?.data?.message || 'Error cancelling registration');
    } finally {
      setCancellingId(null);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/register`);
      success('Successfully registered for event!');
      fetchDashboardData();
    } catch (err) {
      error(err.response?.data?.message || 'Error registering');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name}!</h1>
          <p className="text-indigo-100 text-sm">
            Track your registered events, explore upcoming campus sessions, and manage your schedules.
          </p>
        </div>
        <div className="z-10 shrink-0">
          <Link to="/explore">
            <Button variant="secondary" className="bg-white text-indigo-700 hover:bg-slate-100 shadow-md">
              <Compass className="w-4 h-4 mr-2" /> Explore More Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Registered Events
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{myEvents.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Available Events
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{recommendedEvents.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Department
            </p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {user?.department || 'General Student'}
            </p>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button
          onClick={() => setActiveTab('registered')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'registered'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          My Registered Events ({myEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'recommended'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Recommended Events ({recommendedEvents.length})
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      ) : activeTab === 'registered' ? (
        myEvents.length === 0 ? (
          <EmptyState
            title="No registered events yet"
            description="You haven't registered for any upcoming events. Browse the catalog and register today!"
            actionLabel="Explore Events Catalog"
            onAction={() => setActiveTab('recommended')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isRegistered={true}
                isRegistering={cancellingId === event._id}
                onCancelRegistration={handleCancelRegistration}
              />
            ))}
          </div>
        )
      ) : recommendedEvents.length === 0 ? (
        <EmptyState
          title="All caught up!"
          description="You are currently registered for all available campus events."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedEvents.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              isRegistered={false}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
}
