import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI';

const departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    registerNumber: '',
    department: '',
    gender: '',
    stay_type: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
    if (!form.stay_type) next.stay_type = 'Select stay type';
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Map form data to backend expected format
    const userData = {
      reg_no: form.registerNumber,
      name: form.fullName,
      department: form.department,
      gender: form.gender,
      stay_type: form.stay_type,
      phone: form.phone,
      email: form.email,
      password: form.password
    };

    try {
      setIsLoading(true);
      const result = await signup(userData);
      // Always show onboarding for new signups
      navigate('/onboarding');
    } catch (err) {
      console.error('Signup error:', err);
      setErrors({ email: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (error) => `w-full rounded-lg border ${error ? 'border-red-300' : 'border-gray-200'} bg-gray-50/50 px-4 py-3 text-sm text-gray-900 shadow-neu-light placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-[500px]">
        <div className="bg-surface border border-white/60 rounded-2xl shadow-neu-flat p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join CampusVoice today</p>
          </div>

          <form onSubmit={onSubmit} aria-label="Signup form" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={update('fullName')}
                  aria-label="Full name"
                  className={inputClass(errors.fullName)}
                  placeholder="Full Name"
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.fullName}</p>}
              </div>
              <div>
                <input
                  type="text"
                  value={form.registerNumber}
                  onChange={update('registerNumber')}
                  aria-label="College register number"
                  className={inputClass(errors.registerNumber)}
                  placeholder="Register Number"
                />
                {errors.registerNumber && <p className="text-xs text-red-500 mt-1 ml-1">{errors.registerNumber}</p>}
              </div>
            </div>

            <div>
              <select
                value={form.department}
                onChange={update('department')}
                aria-label="Department"
                className={inputClass(errors.department)}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <p className="text-xs text-red-500 mt-1 ml-1">{errors.department}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-gray-50/50 border border-gray-100">
              <div className="flex-1">
                <span className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Gender</span>
                <div className="flex gap-4">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} className="inline-flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={form.gender === g}
                          onChange={update('gender')}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-brand peer-checked:bg-brand transition-colors"></div>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
              </div>

              <div className="flex-1">
                <span className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Stay Type</span>
                <div className="flex gap-4">
                  {['Hostel', 'Day Scholar'].map((s) => (
                    <label key={s} className="inline-flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="stay_type"
                          value={s}
                          checked={form.stay_type === s}
                          onChange={update('stay_type')}
                          className="peer sr-only"
                        />
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full peer-checked:border-brand peer-checked:bg-brand transition-colors"></div>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{s.split(' ')[0]}</span>
                    </label>
                  ))}
                </div>
                {errors.stay_type && <p className="text-xs text-red-500 mt-1">{errors.stay_type}</p>}
              </div>
            </div>

            <div>
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                aria-label="Phone number"
                className={inputClass(errors.phone)}
                placeholder="Phone Number"
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>}
            </div>

            <div>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                aria-label="Email address"
                className={inputClass(errors.email)}
                placeholder="Email (must end with @srec.ac.in)"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <Button type="submit" className="w-full py-3 mt-4 text-white shadow-lg shadow-brand/25" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center bg-white/50 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-4">
          <span className="text-gray-600 text-sm">Already have an account? </span>
          <Link to="/login" className="text-brand font-semibold hover:text-brand-dark transition-colors">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

