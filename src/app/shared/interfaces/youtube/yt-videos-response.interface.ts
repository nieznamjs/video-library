import { YtVideo } from './yt-video.interface';

export interface YtVideosResponse {
  items: YtVideo[];
  statistics: {
    likeCount: string;
    viewCount: string;
  };
  id: string;
}
