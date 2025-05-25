import { useState, useEffect } from 'react';
import { BrowserRouter as Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Components
import Navbar from './components/Navbar';

export const title = "Marketplace";
export const backend = "https://marketplace3562.pythonanywhere.com"

function App() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dataRes, usersRes] = await Promise.all([
          axios.get(backend),
          axios.get(`${backend}/users`)
        ]);
        setData(dataRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Errore fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Data:', data);
      console.log('Users:', users);
    }
  }, [data, users]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}

function Logout() {
  const location = useLocation();
  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  return <Navigate to="/login" state={{ from: location }} replace />;
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-2 text-gray-400">Il miglior posto per comprare e vendere</p>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {title}. Tutti i diritti riservati.</p><br />
        </div>
        <div className='text-center text-gray-400 text-lg'>
          <h2>By Valerio Calselli</h2>
        </div>
      </div>
    </footer>
  );
}

export default App;
