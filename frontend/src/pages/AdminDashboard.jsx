import { useState, useEffect } from 'react';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';
import { ShieldAlert, Users, Calendar, CheckCircle2, UserCheck, Trash2, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const { success, error } = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, eventsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/events'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      error('Failed to load admin metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      success(`User role updated to ${newRole}`);
      fetchAdminData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and all their associated data?')) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      success('User deleted successfully');
      fetchAdminData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event as Admin?')) {
      return;
    }
    try {
      await api.delete(`/events/${eventId}`);
      success('Event deleted by Admin');
      fetchAdminData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrative Controls
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">Platform Administration</h1>
          <p className="text-rose-100 text-sm mt-1">
            Global system health, user management, role elevation, and content moderation.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <Users className="w-5 h-5 mx-auto text-indigo-500 mb-1" />
            <p className="text-xs text-slate-500 uppercase font-semibold">Total Users</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalUsers || 0}</p>
          </Card>
          <Card className="p-4 text-center">
            <UserCheck className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <p className="text-xs text-slate-500 uppercase font-semibold">Students</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalStudents || 0}</p>
          </Card>
          <Card className="p-4 text-center">
            <Calendar className="w-5 h-5 mx-auto text-purple-500 mb-1" />
            <p className="text-xs text-slate-500 uppercase font-semibold">Organizers</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalOrganizers || 0}</p>
          </Card>
          <Card className="p-4 text-center">
            <Calendar className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
            <p className="text-xs text-slate-500 uppercase font-semibold">Events</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalEvents || 0}</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto text-rose-500 mb-1" />
            <p className="text-xs text-slate-500 uppercase font-semibold">Registrations</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats?.totalRegistrations || 0}</p>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'events'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Event Moderation ({events.length})
        </button>
      </div>

      {/* User Management Table */}
      {activeTab === 'users' ? (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{u.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                  <td className="p-4 text-slate-500">{u.department || '—'}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs p-1.5 font-medium"
                    >
                      <option value="student">Student</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Delete User
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        /* Event Moderation Table */
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Organizer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Registrations</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {events.map((e) => (
                <tr key={e._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{e.title}</td>
                  <td className="p-4">
                    <Badge variant="indigo">{e.category || 'General'}</Badge>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{e.organizer?.name || 'Unknown'}</td>
                  <td className="p-4 text-slate-500">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-500">{e.registeredCount || 0} / {e.capacity}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteEvent(e._id)}
                    >
                      Remove Event
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
