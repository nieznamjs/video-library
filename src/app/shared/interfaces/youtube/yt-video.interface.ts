import { YtThumbnail } from './yt-thumbnail.interface';

export interface YtVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: Date;
    thumbnails: {
      default: YtThumbnail;
      high: YtThumbnail;
      medium: YtThumbnail;
      title: string;
    };
  };
  statistics: {
    likeCount: string;
    viewCount: string;
  };
}
