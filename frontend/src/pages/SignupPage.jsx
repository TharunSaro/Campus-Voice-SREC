import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    registerNumber: '',
    department: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const phoneOk = useMemo(() => /^\d{10}$/.test(form.phone || ''), [form.phone]);
  const emailOk = useMemo(() => /@srec\.ac\.in$/i.test(form.email || ''), [form.email]);
  const passwordsMatch = useMemo(() => (form.password || '') === (form.confirmPassword || ''), [form.password, form.confirmPassword]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.fullName) next.fullName = 'Full name is required';
    if (!form.registerNumber) next.registerNumber = 'Register number is required';
    if (!form.department) next.department = 'Select a department';
    if (!form.gender) next.gender = 'Select gender';
    if (!form.phone) next.phone = 'Phone is required';
    else if (!phoneOk) next.phone = 'Enter 10 digit phone number';
    if (!form.email) next.email = 'Email is required';
    else if (!emailOk) next.email = 'Email must end with @srec.ac.in';
    if (!form.password) next.password = 'Password is required';
    if (!form.confirmPassword) next.confirmPassword = 'Confirm your password';
    else if (!passwordsMatch) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = signup(form.email);
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    // After successful signup, show onboarding if not seen
    const hasOnboarded = localStorage.getItem('onboarded') === 'true';
    if (!hasOnboarded) {
      navigate('/onboarding');
    } else {
      alert('Account created successfully. Please sign in.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">Create account</h1>
          <form onSubmit={onSubmit} aria-label="Signup form" className="mt-6 grid grid-cols-1 gap-3">
            <div>
              <input
                type="text"
                value={form.fullName}
                onChange={update('fullName')}
                aria-label="Full name"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Full Name"
              />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <input
                type="text"
                value={form.registerNumber}
                onChange={update('registerNumber')}
                aria-label="College register number"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="College Register Number"
              />
              {errors.registerNumber && <p className="text-xs text-red-600 mt-1">{errors.registerNumber}</p>}
            </div>
            <div>
              <select
                value={form.department}
                onChange={update('department')}
                aria-label="Department"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
            </div>
            <div>
              <div className="flex items-center gap-4 text-sm">
                {['Male', 'Female', 'Other'].map((g) => (
                  <label key={g} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={update('gender')}
                      aria-label={`Gender ${g}`}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
            </div>
            <div>
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                aria-label="Phone number"
                className={`w-full rounded-md border ${phoneOk || !form.phone ? 'border-gray-300 dark:border-gray-600' : 'border-red-300'} bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="Phone Number"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                aria-label="Email address"
                className={`w-full rounded-md border ${emailOk || !form.email ? 'border-gray-300 dark:border-gray-600' : 'border-red-300'} bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                placeholder="Email (must end with @srec.ac.in)"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="password"
                  value={form.password}
                  onChange={update('password')}
                  aria-label="Password"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Password"
                />
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>
              <div>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  aria-label="Confirm password"
                  className={`w-full rounded-md border ${passwordsMatch || !form.confirmPassword ? 'border-gray-300 dark:border-gray-600' : 'border-red-300'} bg-gray-50 dark:bg-gray-700 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button type="submit" aria-label="Create account" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-sm font-medium transition">
              Create Account
            </button>
          </form>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 mt-3 text-center text-sm">
          <span className="text-gray-700 dark:text-gray-300">Already have an account? </span>
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

