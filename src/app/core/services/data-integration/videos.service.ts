import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { YtDataService } from './yt-data.service';
import { VimeoDataService } from './vimeo-data.service';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from './videos-store.service';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from '../../config/videos-type.config';
import { YtVideo } from '../../../shared/interfaces/youtube/yt-video.interface';
import { VimeoVideo } from '../../../shared/interfaces/vimeo/vimeo-video.interface';
import { HelperService } from '../utils/helper.service';
import { SORT_DESCENDING } from '../../../shared/constans/sort-values';
import { DEFAULT_VIDEOS_DATA } from '../../config/default-request.config';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  public sortType = SORT_DESCENDING;
  public showOnlyFavourites = false;
  public videos$ = new BehaviorSubject<ShownVideo[]>([]);
  public isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private ytDataService: YtDataService,
    private vimeoDataService: VimeoDataService,
    private videosStoreService: VideosStoreService,
    private helperService: HelperService,
  ) {}

  public getVideosData(): void {
    let savedVideos: SavedVideoData[] = this.videosStoreService.getSavedVideos();
    if (savedVideos.length === 0) {
      savedVideos = DEFAULT_VIDEOS_DATA;
    }
    const ytIds = [];
    const vimeoIds = [];

    this.isLoading$.next(true);

    if (this.showOnlyFavourites) {
      savedVideos = savedVideos.filter(video => video.isFavourite);
    }

    savedVideos.forEach((video: SavedVideoData) => {
      if (video.type === YT_VIDEO_TYPE) {
        ytIds.push(video.id);
      } else {
        vimeoIds.push(video.id);
      }
    });

    const ytObservable = this.ytDataService.getVideoByIds(ytIds);
    const vimeoObservable = this.vimeoDataService.getVideoByIds(vimeoIds)
      .pipe(
        catchError(() => {
          return of({});
        })
      );

    forkJoin([ytObservable, vimeoObservable])
      .subscribe((responses: any) => {
        let videosToShow: ShownVideo[] = [];
        const [ytResponse, vimeoResponse] = responses;

        ytResponse.items.forEach((ytVideo: YtVideo) => {
          const videoDataFromStorage = savedVideos.find(savedVideo => savedVideo.id === ytVideo.id);

          videosToShow.push({
            id: ytVideo.id,
            title: ytVideo.snippet.title,
            likes: ytVideo.statistics.likeCount,
            views: ytVideo.statistics.viewCount,
            thumbnailUrl: ytVideo.snippet.thumbnails.default.url,
            addedToLibraryAt: videoDataFromStorage.addedToLibraryAt,
            isFavourite: videoDataFromStorage.isFavourite,
            type: YT_VIDEO_TYPE,
            isDefault: videoDataFromStorage.isDefault,
          });
        });

        if (vimeoResponse.data) {
          vimeoResponse.data.forEach((vimeoVideo: VimeoVideo) => {
            const id = this.helperService.extractId(vimeoVideo.link);
            const videoDataFromStorage = savedVideos.find(savedVideo => savedVideo.id === id);

            videosToShow.push({
              id: id,
              title: vimeoVideo.name,
              likes: vimeoVideo.metadata.connections.likes.total.toString(),
              thumbnailUrl: vimeoVideo.pictures.sizes[2].link,
              addedToLibraryAt: videoDataFromStorage.addedToLibraryAt,
              isFavourite: videoDataFromStorage.isFavourite,
              type: VIMEO_VIDEO_TYPE,
              isDefault: videoDataFromStorage.isDefault,
            });
          });
        }

        if (this.sortType === SORT_DESCENDING) {
          videosToShow = this.sortVideosDescending(videosToShow);
        } else {
          videosToShow = this.sortVideosAscending(videosToShow);
        }

        this.videos$.next(videosToShow);
        this.isLoading$.next(false);
      });
  }

  public sortVideosAscending(videos: ShownVideo[]): ShownVideo[] {
    return videos.sort((a, b) => {
      if (a.addedToLibraryAt > b.addedToLibraryAt) {
        return 1;
      } else if (a.addedToLibraryAt < b.addedToLibraryAt) {
        return -1;
      }
      return 0;
    });
  }

  public sortVideosDescending(videos: ShownVideo[]): ShownVideo[] {
    return videos.sort((a, b) => {
      if (a.addedToLibraryAt < b.addedToLibraryAt) {
        return 1;
      } else if (a.addedToLibraryAt > b.addedToLibraryAt) {
        return -1;
      }
      return 0;
    });
  }
}
