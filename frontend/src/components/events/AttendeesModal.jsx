import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import api from '../../utils/api';
import { User, Mail, Building, Calendar, Loader2 } from 'lucide-react';
import Badge from '../ui/Badge';

export default function AttendeesModal({ isOpen, onClose, event }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && event?._id) {
      fetchAttendees();
    }
  }, [isOpen, event]);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events/${event._id}/attendees`);
      setAttendees(data);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Registered Attendees (${attendees.length})`} maxWidth="max-w-2xl">
      <div className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Showing list of students registered for <strong>{event?.title}</strong>
        </p>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : attendees.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No students have registered for this event yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto pr-1">
            {attendees.map((reg) => (
              <div key={reg._id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {reg.student?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {reg.student?.name || 'Unknown Student'}
                      {reg.student?.department && (
                        <Badge variant="slate">{reg.student.department}</Badge>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      {reg.student?.email}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(reg.registrationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
