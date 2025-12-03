import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function TopNav() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/'} className="font-semibold text-gray-900">Campus Voice</Link>
        <nav className="flex items-center gap-4 text-sm">
          {isAdmin ? (
            <Link to="/admin" className={location.pathname === '/admin' ? 'text-brand' : 'text-gray-600 hover:text-gray-900'}>Dashboard</Link>
          ) : (
            <Link to="/" className={location.pathname === '/' ? 'text-brand' : 'text-gray-600 hover:text-gray-900'}>Feed</Link>
          )}
        </nav>
      </div>
    </div>
  );
}

export function AdminSidebar({ children }) {
  return (
    <div className="min-h-screen sm:grid sm:grid-cols-[220px_1fr]">
      <aside className="hidden sm:block border-r border-gray-100 p-4">
        <div className="font-semibold text-gray-900 mb-4">Campus Voice</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin" className="block text-gray-600 hover:text-gray-900">Dashboard</Link>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}

export function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!user || user.role === 'admin') return null;

  const navItems = [
    { path: '/home', label: 'Home', icon: 'home', isCenter: false },
    { path: '/posts', label: 'Posts', icon: 'plus-circle', isCenter: true },
    { path: '/notifications', label: 'Notifications', icon: 'bell', isCenter: false },
    { path: '/profile', label: 'Profile', icon: 'user', isCenter: false },
  ];

  // Persist last active tab
  useEffect(() => {
    const match = navItems.find(i => i.path === location.pathname);
    if (match) localStorage.setItem('cv_last_tab', match.path);
  }, [location.pathname]);

  const getIconSvg = (iconName, isActive, isCenter) => {
    const baseIconClass = isCenter ? 'w-7 h-7' : 'w-6 h-6';
    
    const icons = {
      home: (
        <svg className={baseIconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          {isActive ? (
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          )}
        </svg>
      ),
      list: (
        <svg className={baseIconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          {isActive ? (
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      ),
      bell: (
        <svg className={baseIconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          {isActive ? (
            <path d="M5 20h14l-1.405-1.405A2.032 2.032 0 0117 17.158V11a5 5 0 10-10 0v6.159c0 .538-.214 1.055-.595 1.436L5 20zm7 2a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
          )}
        </svg>
      ),
      'plus-circle': (
        <svg className={baseIconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      user: (
        <svg className={baseIconClass} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          {isActive ? (
            <path d="M10 9a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 1114 0H3z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          )}
        </svg>
      ),
    };
    return icons[iconName] || icons.home;
  };

  return (
    <>
      {/* Bottom bar: mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm shadow-lg md:hidden h-16" aria-label="Primary bottom navigation">
        <div className="h-full flex items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isCenter = item.isCenter;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => localStorage.setItem('cv_last_tab', item.path)}
                className="relative flex flex-col items-center justify-center flex-1 max-w-[120px] py-2 transition duration-200 ease-in-out group focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 rounded-lg"
              >
                <div className={`relative flex flex-col items-center justify-center ${isCenter ? 'mb-1' : ''}`}>
                  {isCenter && (
                    <div className={`absolute -inset-2 rounded-full transition duration-200 ease-in-out ${
                      isActive ? 'bg-blue-100' : 'group-hover:bg-gray-100'
                    }`} />
                  )}
                  <div className={`relative ${isCenter ? 'z-10' : ''}`}>
                    {getIconSvg(item.icon, isActive, isCenter)}
                  </div>
                  <span className={`text-xs mt-0.5 font-medium transition duration-200 ease-in-out ${
                    isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                  {!isCenter && isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
        <div className="h-safe-area bg-white/80" style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
      </nav>

      {/* Left sidebar: md and up */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-20 w-16 flex-col items-center bg-white/80 backdrop-blur-sm border-r border-gray-200 pt-3" aria-label="Primary sidebar navigation">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isCenter = item.isCenter;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => localStorage.setItem('cv_last_tab', item.path)}
              className="group my-1 w-12 h-12 flex items-center justify-center rounded-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <div className={`relative flex flex-col items-center justify-center ${isCenter ? 'mb-0' : ''}`}>
                {isCenter && (
                  <div className={`absolute -inset-2 rounded-full transition duration-200 ease-in-out ${
                    isActive ? 'bg-blue-100' : 'group-hover:bg-gray-100'
                  }`} />
                )}
                <div className={`relative ${isCenter ? 'z-10' : ''}`}>
                  {getIconSvg(item.icon, isActive, isCenter)}
                </div>
                <span className={`sr-only`}>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
