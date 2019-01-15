import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { YtDataService } from './yt-data.service';
import { VimeoDataService } from './vimeo-data.service';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from './videos-store.service';
import { YT_VIDEO_TYPE } from '../../../shared/constans/videos-types';
import { SORT_ASCENDING, SORT_DESCENDING } from '../../../shared/constans/sort-values';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';
import { SnackbarService } from '../utils/snackbar.service';
import { ModalService } from '../utils/modal.service';
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
    private modalService: ModalService,
  ) {}

  private getVideos(savedVideosData: SavedVideoData[]): Observable<ShownVideo[]> {
    const ytIds = [];
    const vimeoIds = [];
    let videosToShow: ShownVideo[] = [];

    this.isLoading$.next(true);

    savedVideosData.forEach((video: SavedVideoData) => {
      if (video.type === YT_VIDEO_TYPE) {
        ytIds.push(video.id);
      } else {
        vimeoIds.push(video.id);
      }
    });

    const ytObservable = this.ytDataService.getVideoByIds(ytIds);
    const vimeoObservable = this.vimeoDataService.getVideoByIds(vimeoIds)
      .pipe(
        catchError((err) => {
          // TODO handle it
          console.log(err);
          return of({});
        })
      );

    return forkJoin([ytObservable, vimeoObservable])
      .pipe(
        map((videos: any) => {
          const [ytVideos, vimeoVideos] = videos;

          videosToShow = videosToShow.concat(ytVideos, vimeoVideos);
          videosToShow = videosToShow.map((video: ShownVideo) => {
            const videoDataFromLocalStorage = savedVideosData.find(videoData => videoData.id === video.id);

            video.addedToLibraryAt = videoDataFromLocalStorage.addedToLibraryAt;
            video.isFavourite = videoDataFromLocalStorage.isFavourite;

            return video;
          });

          return videosToShow;
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
        } else if (videosArray.length > 1) {
          this.modalService.openModalToChooseVideo(videosArray);
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
        this.videos$.next(this.videos);
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
    this.videos$.next(this.videos);
  }

  public removeVideoFromLibrary(id: string): void {
    const filteredVideos = this.videos.filter(video => video.id !== id);

    this.videosStoreService.removeFromLibrary(id);
    this.videos = filteredVideos;
    this.videos$.next(this.videos);
  }

  public addVideoToFavourites(id: string): void {
    const mappedVideos = this.videos.map((video: ShownVideo) => {
      if (video.id === id) {
        video.isFavourite = true;
      }
      return video;
    });

    this.videosStoreService.addVideoToFavourites(id);
    this.videos = mappedVideos;
    this.videos$.next(this.videos);
  }

  public removeVideoFromFavourites(id: string): void {
    const videosArrayCopy = [...this.videos];
    const videoToRemoveFromFavourites = videosArrayCopy.find(video => video.id === id);

    videoToRemoveFromFavourites.isFavourite = false;

    this.videosStoreService.removeVideoFromFavourites(id);
    this.videos = videosArrayCopy;
    this.videos$.next(this.videos);
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
          this.videos$.next(this.videos);
          this.snackbarService.openSuccessSnackbar(DEMO_VIDEOS_ADDED_MESSAGE);
        });
    }
  }

  public clearLibrary(): void {
    this.videosStoreService.clearLibrary();
    this.videos = [];
    this.videos$.next(this.videos);
  }

  // public getVideosToShow(): void {
  //   const savedVideosData: SavedVideoData[] = this.videosStoreService.getSavedVideos();
  //
  //   if (savedVideosData.length < this.videos.length) {
  //     const savedIds = savedVideosData.map(video => video.id);
  //
  //     this.videos = this.videos.filter((video: ShownVideo) => savedIds.includes(video.id));
  //   } else if (savedVideosData.length > this.videos.length) {
  //     this.getVideosData();
  //   }
  //
  //   let videos = [...this.videos];
  //
  //   videos = videos.map((video: ShownVideo) => {
  //     const videoDataFromLocalStorage = savedVideosData.find(videoData => videoData.id === video.id);
  //
  //     if (videoDataFromLocalStorage) {
  //       video.addedToLibraryAt = videoDataFromLocalStorage.addedToLibraryAt;
  //       video.isFavourite = videoDataFromLocalStorage.isFavourite;
  //
  //       return video;
  //     }
  //   });
  //
  //   videos = this.sortVideos(videos);
  //
  //   if (this.showOnlyFavourites) {
  //     videos = videos.filter(video => video.isFavourite);
  //   }
  //
  //   this.videos$.next(videos);
  // }
  //
  // public getVideosData(): void {
  //   const savedVideosData: SavedVideoData[] = this.videosStoreService.getSavedVideos();
  //   const ytIds = [];
  //   const vimeoIds = [];
  //   let videosToShow: ShownVideo[] = [];
  //
  //   this.isLoading$.next(true);
  //
  //   savedVideosData.forEach((video: SavedVideoData) => {
  //     if (video.type === YT_VIDEO_TYPE) {
  //       ytIds.push(video.id);
  //     } else {
  //       vimeoIds.push(video.id);
  //     }
  //   });
  //
  //   const ytObservable = this.ytDataService.getVideoByIds(ytIds);
  //   const vimeoObservable = this.vimeoDataService.getVideoByIds(vimeoIds)
  //     .pipe(
  //       catchError(() => {
  //         return of({});
  //       })
  //     );
  //
  //   forkJoin([ytObservable, vimeoObservable])
  //     .subscribe((videos: any) => {
  //       const [ytVideos, vimeoVideos] = videos;
  //
  //       videosToShow = videosToShow.concat(ytVideos, vimeoVideos);
  //       videosToShow = videosToShow.map((video: ShownVideo) => {
  //         const videoDataFromLocalStorage = savedVideosData.find(videoData => videoData.id === video.id);
  //
  //         video.addedToLibraryAt = videoDataFromLocalStorage.addedToLibraryAt;
  //         video.isFavourite = videoDataFromLocalStorage.isFavourite;
  //
  //         return video;
  //       });
  //
  //       this.videos = videosToShow;
  //       this.isLoading$.next(false);
  //       this.getVideosToShow();
  //     });
  // }

  public sortVideos(): void {
    const copyOfArray = [...this.videos];

    if (this.sortType === SORT_ASCENDING) {
      copyOfArray.sort((a, b) => {
        if (a.addedToLibraryAt > b.addedToLibraryAt) {
          return 1;
        } else if (a.addedToLibraryAt < b.addedToLibraryAt) {
          return -1;
        }
        return 0;
      });
    } else {
      copyOfArray.sort((a, b) => {
        if (a.addedToLibraryAt < b.addedToLibraryAt) {
          return 1;
        } else if (a.addedToLibraryAt > b.addedToLibraryAt) {
          return -1;
        }
        return 0;
      });
    }

    this.videos = copyOfArray;
    this.videos$.next(this.videos);
  }
}
