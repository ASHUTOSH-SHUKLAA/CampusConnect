import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">CampusConnect</h1>
            {user && (
              <button 
                onClick={() => { localStorage.clear(); setUser(null); }}
                className="text-gray-600 hover:text-red-500"
              >
                Logout ({user.name})
              </button>
            )}
          </div>
        </nav>
        
        <main className="max-w-6xl mx-auto p-4">
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/" element={
              !user ? <Navigate to="/login" /> : 
              user.role === 'organizer' ? <OrganizerDashboard user={user} /> : 
              <Dashboard user={user} />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
