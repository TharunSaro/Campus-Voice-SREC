import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/UI';

const departments = [
  'CSE', 'IT', 'AI&DS', 'ECE', 'EEE', 'EIE',
  'MECH', 'CIVIL', 'AERO', 'BME', 'R&A',
  'Mtech CSE', 'MBA'
];

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
  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next = {};
    if (!form.fullName) next.fullName = 'Full name is required';
    if (!form.registerNumber) next.registerNumber = 'Register number is required';
    else if (!String(form.registerNumber).startsWith('7181')) next.registerNumber = 'Roll number must start with 7181';

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
      navigate('/onboarding');
    } catch (err) {
      console.error('Signup error:', err);
      setErrors({ email: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (error) => `
    w-full rounded-xl border-0 
    bg-gray-50/50 shadow-neu-inset 
    px-4 py-3 text-sm text-gray-900 
    placeholder:text-gray-400 
    focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 
    transition-all duration-200
    ${error ? 'ring-2 ring-red-300' : ''}
  `;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="w-full max-w-[500px]">
        <div className="bg-surface border border-white/60 rounded-2xl shadow-neu-flat p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join CampusVoice today</p>
          </div>

          <form onSubmit={onSubmit} aria-label="Signup form" className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <div className="relative">
                <select
                  value={form.department}
                  onChange={update('department')}
                  aria-label="Department"
                  className={`${inputClass(errors.department)} appearance-none`}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.department && <p className="text-xs text-red-500 mt-1 ml-1">{errors.department}</p>}
            </div>

            {/* Gender Section */}
            <div>
              <span className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide ml-1">Gender</span>
              <div className="flex gap-3">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setField('gender', g)}
                    className={`
                                flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                                ${form.gender === g
                        ? 'bg-brand/10 text-brand border border-brand/30 shadow-inner'
                        : 'bg-surface text-gray-600 border border-transparent shadow-neu-flat hover:text-gray-900'}
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
                {['Hostel', 'Day Scholar'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setField('stay_type', s)}
                    className={`
                                flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                                ${form.stay_type === s
                        ? 'bg-brand/10 text-brand border border-brand/30 shadow-inner'
                        : 'bg-surface text-gray-600 border border-transparent shadow-neu-flat hover:text-gray-900'}
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

            <Button type="submit" className="w-full py-3.5 mt-2 text-white shadow-raise-btn hover:shadow-raise-btn-hover" disabled={isLoading}>
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

