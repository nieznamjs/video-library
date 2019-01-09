import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { LOCAL_STORAGE_VIDEOS_KEY } from '../../../shared/constans/local-storage-keys';
import { StorageService } from '../utils/storage.service';
import { SnackbarService } from '../utils/snackbar.service';
import { DEFAULT_VIDEOS_DATA } from '../../../shared/constans/demo-videos';

@Injectable({
  providedIn: 'root'
})
export class VideosStoreService {

  public savedVideos$ = new BehaviorSubject<SavedVideoData[]>(this.getSavedVideos());
  private readonly VIDEO_ADDED_MESSAGE = 'Video has been saved';
  private readonly VIDEO_IS_ALREADY_SAVED_MESSAGE = 'Video is already in library';

  constructor(
    private storageService: StorageService,
    private snackbarService: SnackbarService,
  ) { }

  private saveToLocalStorage(videos: SavedVideoData[]) {
    this.storageService.set(LOCAL_STORAGE_VIDEOS_KEY, videos);
    this.savedVideos$.next(this.getSavedVideos());
  }

  public getDemoVideos(): void {
    this.saveToLocalStorage(DEFAULT_VIDEOS_DATA);
  }

  public getSavedVideos(): SavedVideoData[] {
    return this.storageService.get(LOCAL_STORAGE_VIDEOS_KEY) || [];
  }

  public saveNewVideo(newVideo: SavedVideoData): void {
    const savedVideos = this.getSavedVideos();

    if (savedVideos.find(savedVideo => savedVideo.id === newVideo.id)) {
      this.snackbarService.openErrorSnackbar(this.VIDEO_IS_ALREADY_SAVED_MESSAGE);
    } else {
      savedVideos.push(newVideo);

      this.saveToLocalStorage(savedVideos);
      this.snackbarService.openSuccessSnackbar(this.VIDEO_ADDED_MESSAGE);
    }
  }

  public addVideoToFavourites(id: string): void {
    const savedVideos = this.getSavedVideos().map((savedVideo: SavedVideoData) => {
      if (savedVideo.id === id) {
        savedVideo.isFavourite = true;
      }
      return savedVideo;
    });

    this.saveToLocalStorage(savedVideos);
  }

  public removeVideoFromFavourites(id: string): void {
    const savedVideos = this.getSavedVideos();
    const videoToRemoveFromFavourites = savedVideos.find(savedVideo => savedVideo.id === id);

    videoToRemoveFromFavourites.isFavourite = false;
    this.saveToLocalStorage(savedVideos);
  }

  public removeFromLibrary(id: string): void {
    const savedVideos = this.getSavedVideos();
    const filteredVideos = savedVideos.filter(video => video.id !== id);

    this.saveToLocalStorage(filteredVideos);
  }

  public clearLibrary(): void {
    this.storageService.clear(LOCAL_STORAGE_VIDEOS_KEY);
    this.savedVideos$.next(this.getSavedVideos());
  }
}
