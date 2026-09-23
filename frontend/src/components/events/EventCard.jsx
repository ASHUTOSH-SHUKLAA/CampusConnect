import { Calendar, MapPin, Users, User, CheckCircle, XCircle, Trash2, Edit3, Eye } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function EventCard({
  event,
  isRegistered = false,
  isOrganizerOwner = false,
  isAdmin = false,
  onRegister,
  onCancelRegistration,
  onEdit,
  onDelete,
  onViewAttendees,
  isRegistering = false,
}) {
  const registeredCount = event.registeredCount || 0;
  const capacity = event.capacity || 100;
  const isFull = registeredCount >= capacity;
  const fillPercentage = Math.min(Math.round((registeredCount / capacity) * 100), 100);

  const getCategoryVariant = (cat) => {
    switch (cat) {
      case 'Hackathons': return 'purple';
      case 'Workshops': return 'blue';
      case 'Cultural & Arts': return 'rose';
      case 'Sports & Gaming': return 'emerald';
      case 'Club Meetups': return 'amber';
      case 'Seminars & Talks': return 'indigo';
      default: return 'slate';
    }
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card hover className="flex flex-col justify-between h-full group">
      <div>
        {/* Top Header & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={getCategoryVariant(event.category)}>
            {event.category || 'General'}
          </Badge>
          {isFull ? (
            <Badge variant="rose">Full Capacity</Badge>
          ) : isRegistered ? (
            <Badge variant="emerald">Registered</Badge>
          ) : (
            <Badge variant="indigo">{capacity - registeredCount} seats left</Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>{formattedDate} {event.time ? `• ${event.time}` : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{event.location || 'Main Campus Auditorium'}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Organizer: <strong className="text-slate-700 dark:text-slate-300 font-medium">{event.organizer?.name || 'Campus Team'}</strong></span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Registrations
            </span>
            <span>{registeredCount} / {capacity}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-rose-500'
                  : fillPercentage > 80
                  ? 'bg-amber-500'
                  : 'bg-indigo-600 dark:bg-indigo-500'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        {/* Organizer / Admin Actions */}
        {(isOrganizerOwner || isAdmin) ? (
          <div className="flex items-center gap-2 w-full">
            {onViewAttendees && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                icon={Eye}
                onClick={() => onViewAttendees(event)}
              >
                Attendees
              </Button>
            )}
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                icon={Edit3}
                onClick={() => onEdit(event)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => onDelete(event._id)}
              >
                Delete
              </Button>
            )}
          </div>
        ) : (
          /* Student Actions */
          <div className="w-full">
            {isRegistered ? (
              <Button
                variant="danger"
                size="md"
                className="w-full"
                icon={XCircle}
                isLoading={isRegistering}
                onClick={() => onCancelRegistration(event._id)}
              >
                Cancel Registration
              </Button>
            ) : (
              <Button
                variant={isFull ? 'secondary' : 'primary'}
                size="md"
                className="w-full"
                disabled={isFull}
                isLoading={isRegistering}
                icon={CheckCircle}
                onClick={() => onRegister(event._id)}
              >
                {isFull ? 'Event Full' : 'Register Now'}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
