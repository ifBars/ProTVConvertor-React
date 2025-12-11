import axios from 'axios';

export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// Default API key - in a production environment, this would be stored securely
const DEFAULT_API_KEY = 'AIzaSyAcgvFEG2hJSRLhqpa8ocMTmxq4Og7Fcnw';

class YouTubeService {
  private apiKey: string;

  constructor(apiKey = DEFAULT_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Set a new API key
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Check if the API key is valid by making a test request
   */
  async checkApiKey(): Promise<boolean> {
    try {
      // Test with a known video ID
      const testVideoId = 'dQw4w9WgXcQ';
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${testVideoId}&key=${this.apiKey}&part=snippet`
      );
      return response.data?.items?.length > 0;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }

  /**
   * Extract video ID from a YouTube URL
   */
  extractVideoId(url: string): string | null {
    // Regular expression to extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  /**
   * Extract playlist ID from a YouTube URL
   */
  extractPlaylistId(url: string): string | null {
    // Check if it's already a playlist ID (not a URL)
    if (/^PL[a-zA-Z0-9_-]{16,}$/.test(url)) {
      return url;
    }

    // Extract playlist ID from URL
    const regExp = /^.*(youtu.be\/|list=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] ? match[2] : null;
  }

  /**
   * Check if a URL is a valid YouTube URL
   */
  isValidYoutubeUrl(url: string): boolean {
    return !!this.extractVideoId(url);
  }

  /**
   * Check if a URL is a valid HTTP/HTTPS URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
      return false;
    }
  }

  /**
   * Get video information from a YouTube URL
   */
  async getVideoInfo(url: string): Promise<YouTubeVideo | null> {
    try {
      const videoId = this.extractVideoId(url);
      if (!videoId) return null;

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${this.apiKey}&part=snippet`
      );

      if (response.data?.items?.length === 0) {
        return null; // Video not found or deleted
      }

      const video = response.data.items[0];
      const snippet = video.snippet;

      return {
        id: videoId,
        title: snippet.title || 'Untitled Video',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: snippet.thumbnails?.default?.url || '',
      };
    } catch (error) {
      console.error('Error fetching video info:', error);
      return null;
    }
  }

  /**
   * Get all videos from a YouTube playlist
   */
  async getPlaylistVideos(playlistIdOrUrl: string): Promise<YouTubeVideo[]> {
    try {
      const playlistId = this.extractPlaylistId(playlistIdOrUrl);
      if (!playlistId) return [];

      const videos: YouTubeVideo[] = [];
      let nextPageToken: string | undefined;

      do {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${this.apiKey}&part=snippet&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
        );

        if (!response.data?.items?.length) break;

        // Process this page of results
        for (const item of response.data.items) {
          const videoId = item.snippet.resourceId.videoId;
          const videoTitle = item.snippet.title;
          const thumbnailUrl = item.snippet.thumbnails?.default?.url || '';

          // Skip deleted or private videos
          if (videoTitle === 'Deleted video' || videoTitle === 'Private video') {
            continue;
          }

          videos.push({
            id: videoId,
            title: videoTitle || 'Untitled Video',
            url: `https://www.youtube.com/watch?v=${videoId}`,
            thumbnailUrl,
          });
        }

        // Update the token for the next page
        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);

      return videos;
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      return [];
    }
  }

  /**
   * Download a thumbnail image
   */
  async downloadThumbnail(video: YouTubeVideo): Promise<Blob | null> {
    try {
      if (!video.thumbnailUrl) return null;
      const response = await axios.get(video.thumbnailUrl, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error downloading thumbnail:', error);
      return null;
    }
  }
}

// Export the service as a singleton
export const youtubeService = new YouTubeService(); 