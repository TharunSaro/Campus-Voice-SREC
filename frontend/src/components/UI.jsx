import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-neu-flat border border-brand/5 border-t-2 border-t-brand/20 hover:shadow-neu-hover hover:-translate-y-[1px] transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-[0.98] outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand/50 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    // Soft Green Gradient with subtle Gold highlight on top edge
    primary: "bg-gradient-to-b from-brand-light/90 to-brand text-white shadow-lg shadow-brand/20 hover:shadow-brand/30 hover:-translate-y-0.5 border-t border-accent/40",

    // White surface, Green border
    secondary: "bg-white text-gray-700 border border-brand/30 text-brand-dark shadow-sm hover:bg-brand/5",

    ghost: "bg-transparent text-gray-600 hover:bg-brand/5 hover:text-brand-dark",
    outline: "bg-transparent border border-brand text-brand hover:bg-brand/5",
    danger: "bg-white border border-error text-error hover:bg-error/5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />;
}

export function Badge({ children, type = 'default' }) {
  const styles = {
    default: 'bg-gray-100 text-gray-700',
    Pending: 'bg-accent/10 text-accent-dark border border-accent/20', // Gold/Amber for Pending
    Resolved: 'bg-brand/10 text-brand-dark border border-brand/20', // Green for Resolved
    Rejected: 'bg-red-50 text-red-700 border border-red-100',
    High: 'bg-accent/10 text-accent-dark font-semibold border border-accent/20', // Gold for Priority
    Medium: 'bg-orange-50 text-orange-700',
    Low: 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[type] || styles.default}`}>
      {children}
    </span>
  );
}

export function Select({ value, onChange, options, placeholder, className = '' }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border border-gray-200 bg-surface px-4 py-2.5 text-sm text-gray-900 shadow-neu-light focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50 ${className}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export function Stat({ label, value, color = 'brand' }) {
  const colorClasses = {
    brand: 'bg-brand/5 text-brand-dark border border-brand/10',
    green: 'bg-brand/5 text-brand-dark border border-brand/10',
    amber: 'bg-accent/5 text-accent-dark border border-accent/10',
    red: 'bg-red-50 text-red-700 border border-red-100',
  }[color] || 'bg-gray-50 text-gray-700';

  return (
    <div className={`rounded-xl ${colorClasses} p-4 shadow-sm`}>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}





