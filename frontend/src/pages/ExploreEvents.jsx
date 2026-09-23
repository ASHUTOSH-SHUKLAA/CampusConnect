import { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/events/EventCard';
import EventFilter from '../components/events/EventFilter';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExploreEvents() {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('upcoming');

  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    if (isAuthenticated) {
      fetchMyRegistrations();
    }
  }, [isAuthenticated, searchQuery, selectedCategory, sortBy]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events', {
        params: {
          search: searchQuery,
          category: selectedCategory,
          sort: sortBy,
        },
      });
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
      error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const { data } = await api.get('/registrations/me');
      setMyRegistrations(data.map((e) => e._id));
    } catch (err) {
      console.error('Error loading registrations:', err);
    }
  };

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegisteringId(eventId);
    try {
      await api.post(`/events/${eventId}/register`);
      success('Successfully registered for event!');
      fetchEvents();
      fetchMyRegistrations();
    } catch (err) {
      error(err.response?.data?.message || 'Error registering for event');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    setRegisteringId(eventId);
    try {
      await api.delete(`/events/${eventId}/register`);
      success('Registration cancelled');
      fetchEvents();
      fetchMyRegistrations();
    } catch (err) {
      error(err.response?.data?.message || 'Error cancelling registration');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-500" />
          Explore Campus Events
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
          Discover hackathons, workshops, cultural fests, and campus meetups.
        </p>
      </div>

      {/* Filter Component */}
      <EventFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Try broadening your search or choosing a different category filter."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSortBy('upcoming');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isRegistered = myRegistrations.includes(event._id);
            const isOrganizerOwner = user?.id === event.organizer?._id || user?.id === event.organizer;

            return (
              <EventCard
                key={event._id}
                event={event}
                isRegistered={isRegistered}
                isOrganizerOwner={isOrganizerOwner}
                isAdmin={user?.role === 'admin'}
                isRegistering={registeringId === event._id}
                onRegister={handleRegister}
                onCancelRegistration={handleCancelRegistration}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
