import { Injectable } from '@angular/core';

import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { LOCAL_STORAGE_VIDEOS_KEY } from '../../config/videos-storage.config';
import { StorageService } from '../utils/storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosStoreService {

  public savedVideos$ = new BehaviorSubject<SavedVideoData[]>(this.getSavedVideos());

  constructor(
    private storageService: StorageService,
  ) { }

  public getSavedVideos(): SavedVideoData[] {
    return this.storageService.get(LOCAL_STORAGE_VIDEOS_KEY) || [];
  }

  public saveNewVideo(newVideo: SavedVideoData): void {
    const savedVideos = this.getSavedVideos();
    savedVideos.push(newVideo);

    this.storageService.set(LOCAL_STORAGE_VIDEOS_KEY, savedVideos);
    this.savedVideos$.next(this.getSavedVideos());
  }
}
