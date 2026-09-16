import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ user }) {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const [allEventsRes, myEventsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/events'),
        axios.get('http://localhost:5000/api/users/me/events', { headers })
      ]);
      setEvents(allEventsRes.data);
      setMyEvents(myEventsRes.data.map(e => e._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering');
    }
  };

  const handleCancel = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}/register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Error cancelling');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upcoming Campus Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const isRegistered = myEvents.includes(event._id);
          return (
            <div key={event._id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Organizer: {event.organizer?.name || 'Unknown'}</p>
                <p>Capacity: {event.capacity}</p>
              </div>
              <div className="mt-6">
                {isRegistered ? (
                  <button onClick={() => handleCancel(event._id)} className="w-full bg-red-100 text-red-700 py-2 rounded-md font-semibold hover:bg-red-200">
                    Cancel Registration
                  </button>
                ) : (
                  <button onClick={() => handleRegister(event._id)} className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700">
                    Register
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
