import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import _ from 'lodash';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { YtDataService } from './yt-data.service';
import { VimeoDataService } from './vimeo-data.service';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from './videos-store.service';
import { YT_VIDEO_TYPE } from '../../../shared/constans/videos-types';
import { SORT_DESCENDING } from '../../../shared/constans/sort-values';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';
import { SnackbarService } from '../utils/snackbar.service';
import { DEMO_VIDEOS_ADDED_MESSAGE, VIDEO_NOT_FOUND_MESSAGE } from '../../../shared/constans/snackbar-messages';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private videos: ShownVideo[] = [];
  public sortType = SORT_DESCENDING;
  public showOnlyFavourites = false;
  public videos$ = new BehaviorSubject<ShownVideo[]>([]);
  public isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private ytDataService: YtDataService,
    private vimeoDataService: VimeoDataService,
    private videosStoreService: VideosStoreService,
    private snackbarService: SnackbarService,
  ) {}

  private getVideos(savedVideosData: SavedVideoData[]): Observable<ShownVideo[]> {
    const ytIds = [];
    const vimeoIds = [];
    let foundVideos: ShownVideo[] = [];

    this.isLoading$.next(true);

    savedVideosData.forEach((video: SavedVideoData) => {
      if (video.type === YT_VIDEO_TYPE) {
        ytIds.push(video.id);
      } else {
        vimeoIds.push(video.id);
      }
    });

    const ytObservable = this.ytDataService.getVideoByIds(ytIds);
    const vimeoObservable = this.vimeoDataService.getVideoByIds(vimeoIds);

    return forkJoin([ytObservable, vimeoObservable])
      .pipe(
        map((videos: any) => {
          const [ytVideos, vimeoVideos] = videos;

          foundVideos = foundVideos.concat(ytVideos, vimeoVideos);
          foundVideos = foundVideos.map((video: ShownVideo) => {
            const videoDataFromLocalStorage = savedVideosData.find(videoData => videoData.id === video.id);

            video.addedToLibraryAt = videoDataFromLocalStorage.addedToLibraryAt;
            video.isFavourite = videoDataFromLocalStorage.isFavourite;

            return video;
          });

          return foundVideos;
        })
      );
  }

  public findVideoById(id: string): void {
    const ytObservable = this.ytDataService.getVideoByIds([id]);
    const vimeoObservable = this.vimeoDataService.getVideoByIds([id]);
    let foundVideo: ShownVideo;

    forkJoin(ytObservable, vimeoObservable)
      .pipe(
        map((videosArrays: VideoNotSaved[][]) => {
          return videosArrays.filter(videos => videos.length !== 0)[0];
        })
      )
      .subscribe((videosArray: VideoNotSaved[]) => {
        if (!videosArray) {
          this.snackbarService.openErrorSnackbar(VIDEO_NOT_FOUND_MESSAGE);
        } else {
          foundVideo = {
            id: videosArray[0].id,
            type: videosArray[0].type,
            title: videosArray[0].title,
            likes: videosArray[0].likes,
            views: videosArray[0].views,
            thumbnailUrl: videosArray[0].thumbnailUrl,
            addedToLibraryAt: new Date(),
            isFavourite: false,
          };

          this.saveNewVideo(foundVideo);
        }
      });
  }

  public getAllVideos(): void {
    const savedVideosData: SavedVideoData[] = this.videosStoreService.getSavedVideos();

    this.getVideos(savedVideosData)
      .subscribe((videos: ShownVideo[]) => {
        this.isLoading$.next(false);
        this.videos = videos;
        this.sortVideos();
      });
  }

  public saveNewVideo(newVideo: ShownVideo): void {
    this.videosStoreService.saveNewVideo({
      id: newVideo.id,
      type: newVideo.type,
      isFavourite: newVideo.isFavourite,
      addedToLibraryAt: newVideo.addedToLibraryAt,
    });
    this.videos.push(newVideo);
    this.sortVideos();
  }

  public removeVideoFromLibrary(id: string): void {
    const filteredVideos = this.videos.filter(video => video.id !== id);

    this.videosStoreService.removeFromLibrary(id);
    this.videos = filteredVideos;
    this.videos$.next(this.videos);
  }

  public addVideoToFavourites(id: string): void {
    const videosCopy = this.videos.map((video: ShownVideo) => {
      if (video.id === id) {
        video.isFavourite = true;
      }
      return video;
    });

    this.videosStoreService.addVideoToFavourites(id);
    this.videos = videosCopy;
    this.checkIfOnlyFavourites();
  }

  public removeVideoFromFavourites(id: string): void {
    const videosCopy = [...this.videos];
    const videoToRemoveFromFavourites = videosCopy.find(video => video.id === id);

    videoToRemoveFromFavourites.isFavourite = false;

    this.videosStoreService.removeVideoFromFavourites(id);
    this.videos = videosCopy;
    this.checkIfOnlyFavourites();
  }

  public getDemoVideos(): void {
    const demoVideos = this.videosStoreService.getDemoVideos();

    if (demoVideos) {
      const newVideos = demoVideos.filter((demoVideo: SavedVideoData) => {
        return this.videos.every((video: ShownVideo) => demoVideo.id !== video.id);
      });

      newVideos.forEach((video: SavedVideoData) => {
        this.videosStoreService.saveNewVideo(video);
      });

      this.getVideos(newVideos)
        .subscribe((videos: ShownVideo[]) => {
          this.isLoading$.next(false);
          this.videos.push(...videos);
          this.sortVideos();
          this.snackbarService.openSuccessSnackbar(DEMO_VIDEOS_ADDED_MESSAGE);
        });
    }
  }

  public sortVideos(): void {
    const videosCopy = [...this.videos];

    const sortedVideos = _.sortBy(videosCopy, 'addedToLibraryAt');

    if (this.sortType === SORT_DESCENDING) {
      sortedVideos.reverse();
    }

    this.videos = sortedVideos;
    this.checkIfOnlyFavourites();
  }

  public checkIfOnlyFavourites(): void {
    if (this.showOnlyFavourites) {
      const filteredVideos = this.videos.filter((video: ShownVideo) => video.isFavourite);
      this.videos$.next(filteredVideos);
    } else {
      this.videos$.next(this.videos);
    }
  }

  public clearLibrary(): void {
    this.videosStoreService.clearLibrary();
    this.videos = [];
    this.videos$.next(this.videos);
  }
}
