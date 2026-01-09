import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    const srec = /@srec\.ac\.in$/i.test(email);
    if (!srec) {
      setError('Please use your @srec.ac.in email.');
      return;
    }
    // Mock wrong credentials check (for demo): require a simple password
    if (password !== 'password') {
      alert('Wrong email or password.');
      return;
    }
    const result = login(email, password);
    if (!result.ok) setError(result.message || 'Login failed');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">Campus Voice – SREC</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-3" aria-label="Login form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Email address"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Password"
            />
            {error && <div className="text-xs text-red-600" role="alert">{error}</div>}
            <button type="submit" aria-label="Sign in" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-sm font-medium transition">
              Sign In
            </button>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center">Use password "password". Use email starting with "admin" for Admin role.</p>
          </form>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 mt-3 text-center text-sm">
          <span className="text-gray-700 dark:text-gray-300">Don’t have an account? </span>
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-medium">Sign up</Link>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">PWA ready. Install from your browser menu.</p>
      </div>
    </div>
  );
}

