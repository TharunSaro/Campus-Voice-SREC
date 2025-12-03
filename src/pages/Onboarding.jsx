import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    title: 'Report campus issues easily & anonymously.',
    icon: '📝',
  },
  {
    title: 'Track progress transparently with real-time updates.',
    icon: '📈',
  },
  {
    title: 'Your voice matters – make SREC better.',
    icon: '🎓',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const isLast = useMemo(() => idx === slides.length - 1, [idx]);

  const next = () => {
    if (isLast) {
      localStorage.setItem('onboarded', 'true');
      navigate('/dashboard');
    } else {
      setIdx((i) => Math.min(i + 1, slides.length - 1));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-8 text-center overflow-hidden">
          <div className="transition-all duration-500 ease-in-out">
            <div className="text-6xl mb-4 select-none animate-pulse">{slides[idx].icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{slides[idx].title}</h2>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {slides.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
            ))}
          </div>

          <button
            onClick={next}
            aria-label={isLast ? 'Get Started' : 'Next slide'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 text-sm font-medium transition mt-8"
          >
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">You can change this later in settings.</p>
      </div>
    </div>
  );
}

