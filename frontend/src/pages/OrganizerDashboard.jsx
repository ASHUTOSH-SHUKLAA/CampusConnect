import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OrganizerDashboard({ user }) {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', capacity: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/events');
      setEvents(data.filter(e => e.organizer?._id === user.id || e.organizer === user.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/events', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', description: '', date: '', capacity: '' });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating event');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      alert('Error deleting');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Organizer Dashboard</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input type="text" placeholder="Event Title" required className="w-full p-2 border rounded"
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <textarea placeholder="Description" className="w-full p-2 border rounded"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input type="date" required className="w-full p-2 border rounded"
            value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          <input type="number" placeholder="Capacity (Seats)" required className="w-full p-2 border rounded"
            value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Event</button>
        </form>
      </div>

      <h3 className="text-xl font-bold mb-4">My Events</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p className="text-gray-600 mt-2">{event.description}</p>
            <p className="mt-4 text-sm text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(event._id)} className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
              Cancel Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
