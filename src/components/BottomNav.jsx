import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: 'home', isCenter: false },
    { path: '/posts', label: 'Posts', icon: 'plus-circle', isCenter: true },
    { path: '/notifications', label: 'Notifications', icon: 'bell', isCenter: false },
    { path: '/profile', label: 'Profile', icon: 'user', isCenter: false },
  ];

  useEffect(() => {
    const match = navItems.find((i) => i.path === location.pathname);
    if (match) localStorage.setItem('cv_last_tab', match.path);
  }, [location.pathname]);

  function Icon({ name, active, large = false }) {
    const cls = large ? 'w-7 h-7' : 'w-6 h-6';
    const stroke = 'currentColor';
    const fill = active ? 'currentColor' : 'none';
    const path = {
      home: active
        ? "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
        : "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      'plus-circle': active
        ? "M12 4a8 8 0 100 16 8 8 0 000-16zm1 8V9a1 1 0 10-2 0v3H8a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3z"
        : "M12 4v16m8-8H4",
      bell: active
        ? "M5 20h14l-1.405-1.405A2.032 2.032 0 0117 17.158V11a5 5 0 10-10 0v6.159c0 .538-.214 1.055-.595 1.436L5 20zm7 2a3 3 0 01-3-3h6a3 3 0 01-3 3z"
        : "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9",
      user: active
        ? "M10 9a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 1114 0H3z"
        : "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    }[name];

    return (
      <svg
        className={cls}
        fill={fill}
        stroke={stroke}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={path}
        />
      </svg>
    );
  }

  return (
    <>
      {/* Bottom navigation (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-md shadow-lg md:hidden h-16">
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
                className="relative flex flex-col items-center justify-center flex-1 py-1 group focus:outline-none"
              >
                <div
                  className={`relative flex flex-col items-center justify-center ${
                    isCenter ? 'mb-0' : ''
                  }`}
                >
                  {isCenter && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition ${
                        isActive ? 'bg-blue-100 rounded-full p-2' : 'group-hover:bg-gray-100 rounded-full p-2'
                      }`}
                    />
                  )}
                  <div className="relative z-10">
                    <Icon name={item.icon} active={isActive} large={isCenter} />
                  </div>
                  {/* FIX: Always show label properly below icon */}
                  <span
                    className={`text-xs mt-1 font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom,0px)] bg-white/80" />
      </nav>

      {/* Sidebar (desktop) */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-20 w-16 flex-col items-center bg-white/80 backdrop-blur-sm border-r border-gray-200 pt-3">
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
              className="group my-1 w-12 h-12 flex items-center justify-center rounded-xl transition"
            >
              <div className="relative flex flex-col items-center justify-center">
                {isCenter && (
                  <div
                    className={`absolute -inset-2 rounded-full ${
                      isActive ? 'bg-blue-100' : 'group-hover:bg-gray-100'
                    }`}
                  />
                )}
                <div className="relative z-10">
                  <Icon name={item.icon} active={isActive} large={isCenter} />
                </div>
                <span className="sr-only">{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
