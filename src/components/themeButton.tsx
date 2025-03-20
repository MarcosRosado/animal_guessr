import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeButton() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex justify-end p-4">
      <button onClick={toggleTheme} className="relative w-12 h-6 bg-gray-200 rounded-full">
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform ${
            theme === 'dark' ? 'transform translate-x-6 bg-blue-900' : 'bg-yellow-500'
          }`}
        >
          {theme === 'light' ? <Sun className="h-4 w-4 text-white"/> : <Moon className="h-4 w-4 text-white"/>}
        </span>
      </button>
    </div>
  );
}