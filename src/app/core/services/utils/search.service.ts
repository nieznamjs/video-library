import { Injectable } from '@angular/core';

import { YtDataService } from '../data-integration/yt-data.service';
import { YT_VIDEO_TYPE } from '../../config/videos-type.config';
import { YtVideosResponse } from '../../../shared/interfaces/youtube/yt-videos-response.interface';
import { VideosStoreService } from '../data-integration/videos-store.service';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private ytDataService: YtDataService,
    private videosStoreService: VideosStoreService,
  ) { }

  public getVideoById(id: string, type: string): SavedVideoData | null {
    let foundVideo: SavedVideoData;

    if (type === YT_VIDEO_TYPE) {
      this.ytDataService.getVideoByIds([id])
        .subscribe((response: YtVideosResponse) => {
          console.log(response);
          foundVideo = {
            id: response.items[0].id,
            type: YT_VIDEO_TYPE,
            isFavourite: false,
            addedToLibraryAt: new Date(),
          };
        });
    }

    // poczekaj na response i zwróc
    return foundVideo || null;
  }

  public getVideosByIds(ids: string[], type: string): SavedVideoData[] | null {
    let foundVideos: SavedVideoData[] | null;

    if (type === YT_VIDEO_TYPE) {
      this.ytDataService.getVideoByIds(ids)
        .subscribe((response: YtVideosResponse) => {

        });
    }

    return foundVideos;
  }
}
