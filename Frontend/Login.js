import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import './Login.css'
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtiene la función de login del contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://gitbf.onrender.com/api/auth/login', { email, password });
      console.log('Full API response:', response); // Para depuración

      const { token, role, user } = response.data; // Extrae user directamente
      if (!token || !role || !user) {
        console.error('Token, role, or user missing from response:', response.data);
        throw new Error('Token, role, or user missing from response');
      }

      // Almacena el token y los datos del usuario en el contexto
      login({ token, role, name: user.name, email: user.email });

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role.toLowerCase());
      console.log('Token and role saved:', token, role.toLowerCase());
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      setError(error.response?.data?.message || 'Invalid credentials or server error, please try again');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-900 flex justify-center w-full login1">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1 login1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img
              src="https://gitbf.onrender.com/uploads/logo1.png"
              className="w-32 mx-auto"
              alt="Logo"
            />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <form onSubmit={handleLogin}>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className={`mt-5 tracking-wide font-semibold bg-primary text-primary-foreground w-full py-4 rounded-lg hover:bg-primary/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 008-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6 -ml-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="8.5" cy="7" r="4" />
                          <path d="M20 8v6M23 11h-6" />
                        </svg>
                        <span className="ml-3">Login</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-primary-foreground text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
