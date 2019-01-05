import { YtThumbnailsList } from './yt-thumbnails-list.interface';

export interface YtSnippet {
  description: string;
  publishedAt: Date;
  thumbnails: YtThumbnailsList;
  title: string;
}
