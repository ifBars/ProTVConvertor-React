import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface Video {
  id: string;
  title: string;
  thumbnail?: string;
  duration?: string;
  customName?: string;
}

interface CustomNamingModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  onSave: (customNames: Record<string, string>) => void;
}

export function CustomNamingModal({ isOpen, onClose, videos, onSave }: CustomNamingModalProps) {
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [pattern, setPattern] = useState('');

  useEffect(() => {
    // Initialize custom names with original titles
    const initialNames = videos.reduce((acc, video) => {
      acc[video.id] = video.title;
      return acc;
    }, {} as Record<string, string>);
    setCustomNames(initialNames);
  }, [videos]);

  const handleNameChange = (videoId: string, newName: string) => {
    setCustomNames(prev => ({
      ...prev,
      [videoId]: newName
    }));
  };

  const handleApplyPattern = () => {
    if (!pattern) return;
    
    const newNames = { ...customNames };
    videos.forEach((video, index) => {
      const newName = pattern
        .replace('{number}', (index + 1).toString())
        .replace('{title}', video.title);
      newNames[video.id] = newName;
    });
    setCustomNames(newNames);
  };

  const handleResetToOriginal = () => {
    const originalNames = videos.reduce((acc, video) => {
      acc[video.id] = video.title;
      return acc;
    }, {} as Record<string, string>);
    setCustomNames(originalNames);
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customNames[video.id]?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Custom Video Names</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Pattern (e.g., 'Episode {number} - {title}')"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApplyPattern}>Apply Pattern</Button>
            <Button variant="outline" onClick={handleResetToOriginal}>
              Reset to Original
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-4 rounded-lg border dark:border-gray-700"
              >
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Original: {video.title}
                  </div>
                  <Input
                    value={customNames[video.id] || ''}
                    onChange={(e) => handleNameChange(video.id, e.target.value)}
                    placeholder="Enter custom name"
                    className="mt-1"
                  />
                </div>
                {video.duration && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {video.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(customNames)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 