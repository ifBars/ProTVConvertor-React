import { create } from 'zustand';
import { youtubeService, type YouTubeVideo } from '../services/youtubeService';

export interface VideoItem extends YouTubeVideo {
  customName?: string;
}

interface ConverterStore {
  // State
  urls: VideoItem[];
  prefix: string;
  fileName: string;
  isExporting: boolean;
  thumbnailsDownloaded: number;
  removeInvalidLinks: boolean;
  downloadThumbnails: boolean;
  useCustomNames: boolean;
  darkMode: boolean;
  apiKeyStatus: 'valid' | 'invalid' | 'checking';
  
  // Actions
  addVideoUrl: (url: string, customName?: string) => Promise<boolean>;
  loadPlaylist: (playlistIdOrUrl: string) => Promise<number>;
  removeUrl: (index: number) => void;
  clearUrls: () => void;
  setPrefix: (prefix: string) => void;
  setFileName: (fileName: string) => void;
  setRemoveInvalidLinks: (value: boolean) => void;
  setDownloadThumbnails: (value: boolean) => void;
  setUseCustomNames: (value: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  updateCustomName: (index: number, name: string) => void;
  exportToFile: () => Promise<string | null>;
  validateApiKey: (apiKey?: string) => Promise<boolean>;
  setUrls: (urls: VideoItem[]) => void;
}

export const useConverterStore = create<ConverterStore>((set, get) => ({
  darkMode: false,
  setDarkMode: (darkMode: boolean) => set({ darkMode }),
  urls: [],
  setUrls: (urls: VideoItem[]) => set({ urls }),
  prefix: '',
  fileName: 'urls',
  isExporting: false,
  thumbnailsDownloaded: 0,
  removeInvalidLinks: false,
  downloadThumbnails: false,
  useCustomNames: false,
  apiKeyStatus: 'checking',
  addVideoUrl: async (url: string, customName?: string): Promise<boolean> => {
    if (get().isExporting) return false;

    // Check if it's a valid YouTube URL
    if (youtubeService.isValidUrl(url)) {
      const videoInfo = await youtubeService.getVideoInfo(url);
      if (!videoInfo) return false;

      // Add to the list
      set({ urls: [...get().urls, {
        ...videoInfo,
        customName: customName || videoInfo.title
      }] });
      return true;
    } else if (youtubeService.isValidUrl(url)) {
      // For non-YouTube URLs, just add them with a generic title
      set({ urls: [...get().urls, {
        id: `manual-${Date.now()}`,
        title: customName || `Video ${get().urls.length + 1}`,
        url,
        thumbnailUrl: '',
        customName
      }] });
      return true;
    }

    return false;
  },
  loadPlaylist: async (playlistIdOrUrl: string): Promise<number> => {
    if (get().isExporting) return 0;

    const playlistVideos = await youtubeService.getPlaylistVideos(playlistIdOrUrl);
    if (!playlistVideos.length) return 0;

    // If using custom names, we won't automatically add them
    if (get().useCustomNames) {
      // Return the playlist videos for the UI to handle custom naming
      return playlistVideos.length;
    } else {
      // Add all videos with their default names
      set({ urls: [
        ...get().urls, 
        ...playlistVideos.map(video => ({
          ...video,
          customName: video.title
        }))
      ] });
      
      // Return how many videos were added
      return playlistVideos.length;
    }
  },
  removeUrl: (index: number) => {
    if (get().isExporting) return;
    set({ urls: get().urls.filter((_, i: number) => i !== index) });
  },
  clearUrls: () => {
    if (get().isExporting) return;
    set({ urls: [] });
  },
  updateCustomName: (index: number, name: string) => {
    if (get().isExporting) return;
    set({ urls: get().urls.map((item: VideoItem, i: number) => 
      i === index ? { ...item, customName: name } : item
    ) });
  },
  validateApiKey: async (apiKey?: string): Promise<boolean> => {
    set({ apiKeyStatus: 'checking' });
    
    if (apiKey) {
      youtubeService.setApiKey(apiKey);
    }
    
    const isValid = await youtubeService.checkApiKey();
    set({ apiKeyStatus: isValid ? 'valid' : 'invalid' });
    return isValid;
  },
  exportToFile: async (): Promise<string | null> => {
    if (get().isExporting || get().urls.length === 0) return null;
    
    set({ isExporting: true, thumbnailsDownloaded: 0 });
    
    try {
      // Generate the file content
      const content = get().urls.map((url: VideoItem) => {
        const prefixedUrl = get().prefix ? `${get().prefix}${url.url}` : url.url;
        return `${url.customName || url.title}@${prefixedUrl}`;
      }).join('\n');
      
      // Create a blob and download it
      const blob = new Blob([content], { type: 'text/plain' });
      const fileUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${get().fileName}.txt`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(fileUrl);
      
      // Handle thumbnail downloads if enabled
      if (get().downloadThumbnails) {
        for (const [, video] of get().urls.entries()) {
          if (video.thumbnailUrl) {
            const thumbnail = await youtubeService.downloadThumbnail(video);
            if (thumbnail) {
              const url = URL.createObjectURL(thumbnail);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${video.customName || video.title}.jpg`;
              link.click();
              URL.revokeObjectURL(url);
              
              set({ thumbnailsDownloaded: get().thumbnailsDownloaded + 1 });
            }
          }
        }
      }
      
      set({ isExporting: false });
      return get().fileName;
    } catch (error) {
      console.error('Error exporting file:', error);
      set({ isExporting: false });
      return null;
    }
  },
  setPrefix: (prefix: string) => set({ prefix }),
  setFileName: (fileName: string) => set({ fileName }),
  setRemoveInvalidLinks: (value: boolean) => set({ removeInvalidLinks: value }),
  setDownloadThumbnails: (value: boolean) => set({ downloadThumbnails: value }),
  setUseCustomNames: (value: boolean) => set({ useCustomNames: value })
})); 