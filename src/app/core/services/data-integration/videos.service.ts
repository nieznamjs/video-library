import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { YtDataService } from './yt-data.service';
import { VimeoDataService } from './vimeo-data.service';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from './videos-store.service';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from '../../config/videos-type.config';
import { YtVideosResponse } from '../../../shared/interfaces/youtube/yt-videos-response.interface';
import { YtVideo } from '../../../shared/interfaces/youtube/yt-video.interface';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  public videos$ = new BehaviorSubject<ShownVideo[]>([]);

  constructor(
    private ytDataService: YtDataService,
    private vimeoDataService: VimeoDataService,
    private videosStoreService: VideosStoreService,
  ) {}

  public getVideosData(): void {
    const savedVideos: SavedVideoData[] = this.videosStoreService.getSavedVideos();
    const videosToShow: ShownVideo[] = [];
    const ytIds = [];
    const vimeoIds = [];

    savedVideos.forEach((video: SavedVideoData) => {
      if (video.type === YT_VIDEO_TYPE) {
        ytIds.push(video.id);
      } else {
        vimeoIds.push(video.id);
      }
    });

    this.ytDataService.getVideoByIds(ytIds)
      .subscribe((response: YtVideosResponse) => {
        response.items.forEach((ytVideo: YtVideo) => {
          const videoDataFromStorage = savedVideos.find(savedVideo => savedVideo.id === ytVideo.id);

          videosToShow.push({
            id: ytVideo.id,
            title: ytVideo.snippet.title,
            likes: ytVideo.statistics.likeCount,
            views: ytVideo.statistics.viewCount,
            thumbnailUrl: ytVideo.snippet.thumbnails.default.url,
            addedToLibraryAt: videoDataFromStorage.addedToLibraryAt,
            isFavourite: videoDataFromStorage.isFavourite,
            type: YT_VIDEO_TYPE
          });
        });
      });
    // this.vimeoDataService.getVideoByIds(vimeoIds);

    this.videos$.next(videosToShow);
  }
}
