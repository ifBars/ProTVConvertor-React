import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { useConverterStore } from '../hooks/useConverterStore';
import { toast } from 'sonner';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeySettings({ isOpen, onClose }: ApiKeySettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { darkMode } = useConverterStore();

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    setIsValidating(true);
    try {
      // Test the API key with a simple request
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=dQw4w9WgXcQ&key=${apiKey}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Invalid API key');
      }

      // Save the API key to localStorage
      localStorage.setItem('youtubeApiKey', apiKey);
      toast.success('API key saved successfully');
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          toast.error('API quota exceeded. Please try again later or use a different API key.');
        } else if (error.message.includes('key')) {
          toast.error('Invalid API key. Please check your key and try again.');
        } else {
          toast.error('Error validating API key: ' + error.message);
        }
      }
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>YouTube API Key Settings</DialogTitle>
          <DialogDescription>
            Enter your YouTube Data API v3 key to increase your quota limits.
            You can get an API key from the{' '}
            <a
              href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google Cloud Console
            </a>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter your YouTube API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Your API key will be stored locally in your browser.</p>
            <p>Note: The default API key has limited quota. Using your own key will give you higher limits.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isValidating}>
            {isValidating ? 'Validating...' : 'Save API Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 