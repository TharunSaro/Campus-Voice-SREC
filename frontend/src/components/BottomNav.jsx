import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  // Only show for student users, not admin
  if (!user || user.role === 'admin') return null;

  const navItems = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: Home,
      routes: ['/home']
    },
    { 
      path: '/posts', 
      label: 'Posts', 
      icon: FileText,
      routes: ['/posts']
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: User,
      routes: ['/profile']
    },
  ];

  // Save last visited tab to localStorage
  useEffect(() => {
    const match = navItems.find((item) => 
      item.routes.includes(location.pathname)
    );
    if (match) {
      localStorage.setItem('cv_last_tab', match.path);
    }
  }, [location.pathname]);

  // Check if a nav item is active based on current route
  const isActive = (item) => {
    return item.routes.includes(location.pathname);
  };

  return (
    <>
      {/* Mobile: Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="h-16 flex items-center justify-around px-2">
          {navItems.map((item) => {
            const active = isActive(item);
            const IconComponent = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                onClick={() => localStorage.setItem('cv_last_tab', item.path)}
                className={`
                  relative flex flex-col items-center justify-center flex-1 py-2 
                  transition-colors duration-200
                  ${active 
                    ? 'text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <div className="relative flex flex-col items-center justify-center gap-1">
                  <div className={`
                    relative p-2 rounded-lg transition-colors
                    ${active 
                      ? 'bg-blue-50' 
                      : ''
                    }
                  `}>
                    <IconComponent 
                      size={22} 
                      strokeWidth={active ? 2.5 : 2}
                      className={active ? 'text-blue-600' : ''}
                    />
                  </div>
                  <span className={`
                    text-xs font-medium transition-colors
                    ${active 
                      ? 'text-blue-600' 
                      : 'text-gray-500'
                    }
                  `}>
                    {item.label}
                  </span>
                  {/* Active indicator dot */}
                  {active && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
        {/* Safe area for devices with home indicator */}
        <div className="h-[env(safe-area-inset-bottom,0px)] bg-white" />
      </nav>

      {/* Desktop: Left sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 z-20 w-16 flex-col items-center bg-white/80 backdrop-blur-sm border-r border-gray-200 pt-4">
        {navItems.map((item) => {
          const active = isActive(item);
          const IconComponent = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              onClick={() => localStorage.setItem('cv_last_tab', item.path)}
              className={`
                group my-2 w-12 h-12 flex items-center justify-center rounded-xl transition-colors duration-200
                ${active 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <IconComponent 
                size={22} 
                strokeWidth={active ? 2.5 : 2}
                className={active ? 'text-blue-600' : ''}
              />
              <span className="sr-only">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
