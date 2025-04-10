import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { useConverterStore } from '../hooks/useConverterStore';
import { LinkIcon, PlusCircle, Type } from 'lucide-react';

export function AddLinkForm() {
  const { addVideoUrl, prefix, setPrefix, isExporting } = useConverterStore();
  const [url, setUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the URL isn't empty
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    
    try {
      // Try to add the URL
      const result = await addVideoUrl(url, customName || undefined);
      
      if (result) {
        toast.success('Link added successfully');
        // Reset the fields
        setUrl('');
        setCustomName('');
      } else {
        toast.error('Invalid URL or video not found. Please check and try again.');
      }
    } catch (error) {
      console.error('Error adding URL:', error);
      toast.error('An error occurred while adding the URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full shadow-lg border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="text-center text-xl font-bold">Single Links</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                disabled={isExporting || loading}
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>
            
            <div className="relative">
              <Type className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Custom Name (Optional)"
                value={customName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomName(e.target.value)}
                disabled={isExporting || loading}
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>
            
            <Input
              placeholder="URL Prefix (Optional)"
              value={prefix}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrefix(e.target.value)}
              disabled={isExporting || loading}
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg transition-all bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2"
            disabled={isExporting || loading}
          >
            <PlusCircle className="h-5 w-5" />
            {loading ? 'Adding...' : 'Add Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 