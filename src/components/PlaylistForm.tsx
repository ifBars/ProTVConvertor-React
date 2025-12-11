import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { useConverterStore } from '../hooks/useConverterStore';
import { ListVideo, YoutubeIcon } from 'lucide-react';

export function PlaylistForm() {
  const { 
    loadPlaylist, 
    prefix, 
    setPrefix, 
    useCustomNames, 
    setUseCustomNames, 
    isExporting 
  } = useConverterStore();
  
  const [playlistId, setPlaylistId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playlistId) {
      toast.error('Please enter a playlist ID or URL');
      return;
    }

    setLoading(true);
    
    try {
      const videosCount = await loadPlaylist(playlistId);
      
      if (videosCount > 0) {
        toast.success(`${videosCount} videos loaded from playlist`);
        setPlaylistId('');
      } else {
        toast.error('No videos found in playlist or invalid playlist ID');
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      toast.error('An error occurred while loading the playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full shadow-lg border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="text-center text-xl font-bold">Playlists</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-5 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
          <Checkbox 
            id="useCustomNames" 
            checked={useCustomNames}
            onCheckedChange={(checked: boolean | "indeterminate") => 
              setUseCustomNames(checked === "indeterminate" ? false : checked)
            }
            disabled={isExporting}
            className="border-purple-400 text-purple-600 focus:ring-purple-500"
          />
          <label
            htmlFor="useCustomNames"
            className="text-sm font-medium text-purple-700 dark:text-purple-300 cursor-pointer select-none"
          >
            Use Custom Names for Videos
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <YoutubeIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="YouTube Playlist ID or Link"
                value={playlistId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlaylistId(e.target.value)}
                disabled={isExporting || loading}
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
              />
            </div>
            
            <Input
              placeholder="URL Prefix (Optional)"
              value={prefix}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrefix(e.target.value)}
              disabled={isExporting || loading}
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg transition-all bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold flex items-center justify-center gap-2"
            disabled={isExporting || loading}
          >
            <ListVideo className="h-5 w-5" />
            {loading ? 'Loading...' : 'Load Playlist'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 