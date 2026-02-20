import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/UI';

import { DEPARTMENT_LIST, GENDER, STAY_TYPE } from '../../../utils/constants';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '',
    roll_no: '',
    department_id: '',
    year: '', // Optional 1-10
    gender: '',
    stay_type: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation Regex
  const rollNoRegex = /^[a-zA-Z0-9]{5,20}$/;
  const nameRegex = /^[a-zA-Z\s]{2,255}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Password: at least 8 chars, 1 upper, 1 lower, 1 digit, 1 special
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const passwordsMatch = useMemo(() => (form.password || '') === (form.confirmPassword || ''), [form.password, form.confirmPassword]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next = {};

    // Name
    if (!form.name) next.name = 'Full name is required';
    else if (!nameRegex.test(form.name)) next.name = 'Name must be 2-255 chars, no digits';

    // Roll No
    if (!form.roll_no) next.roll_no = 'Roll number is required';
    else if (!rollNoRegex.test(form.roll_no)) next.roll_no = 'Roll no must be 5-20 alphanumeric characters';

    // Dropdowns
    if (!form.department_id) next.department_id = 'Select a department';
    if (!form.gender) next.gender = 'Select gender';
    if (!form.stay_type) next.stay_type = 'Select stay type';

    // Year (Optional but if present check range)
    if (form.year) {
      const y = parseInt(form.year);
      if (isNaN(y) || y < 1 || y > 10) next.year = 'Year must be 1-10';
    }

    // Email
    if (!form.email) next.email = 'Email is required';
    else if (!emailRegex.test(form.email)) next.email = 'Invalid email address';

    // Password
    if (!form.password) next.password = 'Password is required';
    else if (!passwordRegex.test(form.password)) next.password = '8+ chars, 1 upper, 1 lower, 1 digit, 1 special';

    if (!form.confirmPassword) next.confirmPassword = 'Confirm your password';
    else if (!passwordsMatch) next.confirmPassword = 'Passwords do not match';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Map form data to backend expected format
    const userData = {
      roll_no: form.roll_no,
      name: form.name,
      department_id: parseInt(form.department_id),
      gender: form.gender,
      stay_type: form.stay_type,
      email: form.email,
      password: form.password,
      ...(form.year ? { year: parseInt(form.year) } : {})
    };

    try {
      setIsLoading(true);
      await signup(userData); // Response handled in service/context (usually auto-login or redirect)
      navigate('/onboarding');
    } catch (err) {
      console.error('Signup error:', err);
      // Handle backend 422 errors or text errors
      const msg = err.message || 'Signup failed';
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (error) => `
    w-full rounded-xl border-0 
    bg-gray-50/50 shadow-inner 
    px-4 py-3 text-sm text-srec-textPrimary
    placeholder:text-gray-400 
    focus:bg-white focus:outline-none focus:ring-2 focus:ring-srec-primary/50 
    transition-all duration-200
    ${error ? 'ring-2 ring-red-300' : ''}
  `;

  return (
    <div className="min-h-screen bg-srec-background flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-[500px]">
        <div className="bg-white border border-srec-border rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-srec-textPrimary tracking-tight">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join CampusVoice today</p>
          </div>

          <form onSubmit={onSubmit} aria-label="Signup form" className="space-y-5">
            {errors.form && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mb-4">
                {errors.form}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  aria-label="Full name"
                  className={inputClass(errors.name)}
                  placeholder="Full Name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="text"
                  value={form.roll_no}
                  onChange={update('roll_no')}
                  aria-label="Roll number"
                  className={inputClass(errors.roll_no)}
                  placeholder="Roll Number"
                />
                {errors.roll_no && <p className="text-xs text-red-500 mt-1 ml-1">{errors.roll_no}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="relative">
                  <select
                    value={form.department_id}
                    onChange={update('department_id')}
                    aria-label="Department"
                    className={`${inputClass(errors.department_id)} appearance-none`}
                  >
                    <option value="">Department</option>
                    {DEPARTMENT_LIST.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.department_id && <p className="text-xs text-red-500 mt-1 ml-1">{errors.department_id}</p>}
              </div>

              <div>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.year}
                  onChange={update('year')}
                  aria-label="Student Year"
                  className={inputClass(errors.year)}
                  placeholder="Year (Optional)"
                />
                {errors.year && <p className="text-xs text-red-500 mt-1 ml-1">{errors.year}</p>}
              </div>
            </div>

            {/* Gender Section */}
            <div>
              <span className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide ml-1">Gender</span>
              <div className="flex gap-3">
                {GENDER.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setField('gender', g)}
                    className={`
                                flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                                ${form.gender === g
                        ? 'bg-srec-primary/10 text-srec-primary border border-srec-primary/30 shadow-inner'
                        : 'bg-white text-gray-600 border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:text-gray-900'}
                            `}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {errors.gender && <p className="text-xs text-red-500 mt-1 ml-1">{errors.gender}</p>}
            </div>

            {/* Stay Type Section */}
            <div>
              <span className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide ml-1">Stay Type</span>
              <div className="flex gap-3">
                {STAY_TYPE.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setField('stay_type', s)}
                    className={`
                                flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                                ${form.stay_type === s
                        ? 'bg-srec-primary/10 text-srec-primary border border-srec-primary/30 shadow-inner'
                        : 'bg-white text-gray-600 border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:text-gray-900'}
                            `}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {errors.stay_type && <p className="text-xs text-red-500 mt-1 ml-1">{errors.stay_type}</p>}
            </div>

            <div>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                aria-label="Email address"
                className={inputClass(errors.email)}
                placeholder="Email address"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <input
                  type="password"
                  value={form.password}
                  onChange={update('password')}
                  aria-label="Password"
                  className={inputClass(errors.password)}
                  placeholder="Password"
                />
                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
              </div>
              <div>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  aria-label="Confirm password"
                  className={inputClass(errors.confirmPassword)}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2 ml-1">
                Password must contain 8+ chars, 1 uppercase, 1 number, 1 special char.
              </p>
              <Button type="submit" variant="primary" className="w-full py-3.5 mt-2" isLoading={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center bg-white/50 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-4">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <Link to="/login" className="text-srec-primary font-semibold hover:text-srec-primaryHover transition-colors">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
