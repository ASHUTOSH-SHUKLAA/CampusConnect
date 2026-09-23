import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  'Hackathons',
  'Workshops',
  'Cultural & Arts',
  'Sports & Gaming',
  'Club Meetups',
  'Seminars & Talks',
  'General',
];

export default function CreateEventModal({ isOpen, onClose, eventToEdit = null, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00 AM',
    category: 'General',
    location: 'Main Campus Auditorium',
    capacity: 50,
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        date: eventToEdit.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : '',
        time: eventToEdit.time || '10:00 AM',
        category: eventToEdit.category || 'General',
        location: eventToEdit.location || 'Main Campus Auditorium',
        capacity: eventToEdit.capacity || 50,
        imageUrl: eventToEdit.imageUrl || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '10:00 AM',
        category: 'General',
        location: 'Main Campus Auditorium',
        capacity: 50,
        imageUrl: '',
      });
    }
  }, [eventToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (eventToEdit) {
        await api.put(`/events/${eventToEdit._id}`, formData);
        success('Event updated successfully!');
      } else {
        await api.post('/events', formData);
        success('New event created successfully!');
      }
      onSuccess();
      onClose();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Event Details' : 'Host a New Campus Event'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Title"
          required
          placeholder="e.g. Annual Campus Hackathon 2026"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            required
            rows={3}
            placeholder="Detailed outline of the event, agenda, rules..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Input
            label="Time"
            type="text"
            placeholder="e.g. 10:00 AM - 04:00 PM"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Seat Capacity"
            type="number"
            min="1"
            required
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />
        </div>

        <Input
          label="Venue / Location"
          placeholder="e.g. Auditorium Hall B / Tech Park Lab 3"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            {eventToEdit ? 'Save Changes' : 'Publish Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
