import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-center text-gray-900">Campus Voice – SREC</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-3" aria-label="Login form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Email address"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-3 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {error && <div className="text-xs text-red-600" role="alert">{error}</div>}
            <button type="submit" aria-label="Sign in" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-sm font-medium transition">
              Sign In
            </button>
            <p className="text-[10px] text-gray-500 text-center">Use password "password". Use email starting with "admin" for Admin role.</p>
          </form>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 mt-3 text-center text-sm">
          <span className="text-gray-700">Don't have an account? </span>
          <Link to="/signup" className="text-blue-600 font-medium">Sign up</Link>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">PWA ready. Install from your browser menu.</p>
      </div>
    </div>
  );
}

