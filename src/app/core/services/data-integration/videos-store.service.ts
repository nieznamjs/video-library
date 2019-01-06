import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { LOCAL_STORAGE_VIDEOS_KEY } from '../../config/videos-storage.config';
import { StorageService } from '../utils/storage.service';
import { SnackbarService } from '../utils/snackbar.service';

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
    const savedVideos = this.getSavedVideos();
    const videoToSetAsFavourite = savedVideos.find(savedVideo => savedVideo.id === id);

    videoToSetAsFavourite.isFavourite = true;
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
}
