import { Button } from '../components/ui/button';
import { useConverterStore } from '../hooks/useConverterStore';
import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export function DarkModeToggle() {
  const { darkMode, setDarkMode } = useConverterStore();

  // Apply dark mode to the document when it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Button
      variant="outline"
      onClick={() => setDarkMode(!darkMode)}
      className="w-36 rounded-full transition-all duration-300 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
    >
      {darkMode ? (
        <>
          <Sun size={16} className="text-amber-500" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={16} className="text-indigo-600" />
          <span>Dark Mode</span>
        </>
      )}
    </Button>
  );
} 