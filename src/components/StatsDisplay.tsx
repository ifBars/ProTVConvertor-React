import { Card, CardContent } from '../components/ui/card';
import { useConverterStore } from '../hooks/useConverterStore';

export function StatsDisplay() {
  const { 
    urls, 
    thumbnailsDownloaded, 
    apiKeyStatus 
  } = useConverterStore();

  return (
    <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/30 rounded-xl">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total URLs</span>
            <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">{urls.length}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/30 rounded-xl">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Exported Thumbnails</span>
            <span className="text-3xl font-extrabold text-purple-700 dark:text-purple-300">{thumbnailsDownloaded}</span>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30 rounded-xl">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">API Key Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                apiKeyStatus === 'valid' 
                  ? 'bg-green-500 animate-pulse' 
                  : apiKeyStatus === 'invalid' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500'
              }`}></div>
              <span className={`text-xl font-bold ${
                apiKeyStatus === 'valid' 
                  ? 'text-green-600 dark:text-green-400' 
                  : apiKeyStatus === 'invalid' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {apiKeyStatus === 'valid' 
                  ? 'Valid' 
                  : apiKeyStatus === 'invalid' 
                    ? 'Invalid' 
                    : 'Checking...'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 