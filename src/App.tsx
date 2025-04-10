import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AddLinkForm } from './components/AddLinkForm';
import { PlaylistForm } from './components/PlaylistForm';
import { ExportForm } from './components/ExportForm';
import { URLList } from './components/URLList';
import { StatsDisplay } from './components/StatsDisplay';
import { DarkModeToggle } from './components/DarkModeToggle';
import { ApiKeySettings } from './components/ApiKeySettings';
import { useConverterStore } from './hooks/useConverterStore';
import { Button } from './components/ui/button';
import { Settings } from 'lucide-react';

function App() {
  const { darkMode, validateApiKey } = useConverterStore();
  const [isApiKeySettingsOpen, setIsApiKeySettingsOpen] = useState(false);
  
  useEffect(() => {
    // Validate API key on mount
    validateApiKey();
  }, [validateApiKey]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
        <div className="container mx-auto py-10 min-h-screen">
          <header className="mb-12 text-center">
            <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              ProTVConvertor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Convert YouTube videos and playlists into the correct format for ProTV, a VRChat development add-on.
            </p>
          </header>

          <div className="flex justify-end gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsApiKeySettingsOpen(true)}
              title="API Key Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <DarkModeToggle />
          </div>

          <div className="mb-8">
            <StatsDisplay />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-1 transition-all duration-300 hover:translate-y-[-5px]">
              <AddLinkForm />
            </div>
            <div className="md:col-span-1 transition-all duration-300 hover:translate-y-[-5px]">
              <PlaylistForm />
            </div>
            <div className="md:col-span-1 transition-all duration-300 hover:translate-y-[-5px]">
              <ExportForm />
            </div>
          </div>

          <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transition-all duration-300">
            <URLList />
          </div>

          <footer className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12 pb-6">
            <p className="mb-2">ProTVConvertor - Created by ifBars | Web Version</p>
            <p className="text-xs">Built with React, Vite, Tailwind CSS and shadcn-ui</p>
          </footer>
        </div>
        
        <ApiKeySettings
          isOpen={isApiKeySettingsOpen}
          onClose={() => setIsApiKeySettingsOpen(false)}
        />
        
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: darkMode ? '#1f2937' : '#ffffff',
              color: darkMode ? '#f9fafb' : '#1f2937',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb'
            }
          }}
        />
      </div>
    </DndProvider>
  );
}

export default App;
