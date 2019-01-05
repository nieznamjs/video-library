import { YtSnippet } from './yt-snippet.interface';
import { YtStatistics } from './yt-statistics.interface';

export interface YtVideo {
  snippet: YtSnippet;
  statistics: YtStatistics;
  id: string;
}
