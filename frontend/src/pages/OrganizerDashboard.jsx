import { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/events/EventCard';
import CreateEventModal from '../components/events/CreateEventModal';
import AttendeesModal from '../components/events/AttendeesModal';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Plus, Calendar, Users, Award, Sparkles } from 'lucide-react';

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);

  const { user } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      const myOwnedEvents = data.filter(
        (e) => e.organizer?._id === user.id || e.organizer === user.id
      );
      setEvents(myOwnedEvents);
    } catch (err) {
      console.error('Error fetching organizer events:', err);
      error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This will also remove all student registrations.')) {
      return;
    }
    try {
      await api.delete(`/events/${eventId}`);
      success('Event deleted successfully');
      fetchMyEvents();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleEdit = (event) => {
    setEventToEdit(event);
    setIsCreateModalOpen(true);
  };

  const handleViewAttendees = (event) => {
    setSelectedEvent(event);
    setIsAttendeesModalOpen(true);
  };

  const totalSeats = events.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const totalRegistrations = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Organizer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Organizer Dashboard</h1>
          <p className="text-purple-100 text-sm">
            Host campus events, monitor seat capacities, and view student attendee lists.
          </p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          icon={Plus}
          className="bg-white text-purple-700 hover:bg-slate-100 shadow-md shrink-0"
          onClick={() => {
            setEventToEdit(null);
            setIsCreateModalOpen(true);
          }}
        >
          Host New Event
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Events Hosted
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{events.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Registrations
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalRegistrations}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Seat Capacity
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalSeats}</p>
          </div>
        </Card>
      </div>

      {/* Events List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          My Organized Events ({events.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            title="You haven't created any events yet"
            description="Start engaging with the campus community by hosting your first hackathon, workshop, or meetup."
            actionLabel="Host First Event"
            onAction={() => {
              setEventToEdit(null);
              setIsCreateModalOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                isOrganizerOwner={true}
                onEdit={handleEdit}
                onDelete={handleDeleteEvent}
                onViewAttendees={handleViewAttendees}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        eventToEdit={eventToEdit}
        onSuccess={fetchMyEvents}
      />

      {/* Attendees Modal */}
      <AttendeesModal
        isOpen={isAttendeesModalOpen}
        onClose={() => setIsAttendeesModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
