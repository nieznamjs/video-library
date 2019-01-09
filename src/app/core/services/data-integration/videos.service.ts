import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { YtDataService } from './yt-data.service';
import { VimeoDataService } from './vimeo-data.service';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from './videos-store.service';
import { YT_VIDEO_TYPE } from '../../../shared/constans/videos-types';
import { SORT_DESCENDING } from '../../../shared/constans/sort-values';

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
  ) {}

  public getVideosData(): void {
    let savedVideos: SavedVideoData[] = this.videosStoreService.getSavedVideos();
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
      .subscribe((videos: any) => {
        let videosToShow: ShownVideo[] = [];
        const [ytVideos, vimeoVideos] = videos;

        videosToShow = videosToShow.concat(ytVideos, vimeoVideos);
        videosToShow = videosToShow.map((video: ShownVideo) => {
          const videoDataFromLocalStorage = savedVideos.find(videoData => videoData.id === video.id);

          video.addedToLibraryAt = videoDataFromLocalStorage.addedToLibraryAt;
          video.isFavourite = videoDataFromLocalStorage.isFavourite;

          return video;
        });

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
