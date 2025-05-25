import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { backend } from '../App';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Per favore inserisci email e password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${backend}/login`, {
        username: email,
        password: password,
      });

      if (response.data.status === 'success') {
        const user = response.data.user;
        localStorage.setItem(
          'user',
          JSON.stringify({ username: user.username, email: user.email })
        );
        navigate('/');
      } else {
        setError('Email o password non validi');
      }
    } catch (err) {
      setError('Si è verificato un errore durante il login. Riprova più tardi.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3" aria-hidden="true">
            <FaSignInAlt size={24} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Accedi al tuo account</h2>

        {error && (
          <div
            role="alert"
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username or Email
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                aria-hidden="true"
              >
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                type="text"
                placeholder="Username or Email"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
                aria-describedby={error ? 'email-error' : undefined}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                aria-hidden="true"
              >
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="La tua password"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
                aria-describedby={error ? 'password-error' : undefined}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Caricamento...' : 'Accedi'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Non hai un account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
