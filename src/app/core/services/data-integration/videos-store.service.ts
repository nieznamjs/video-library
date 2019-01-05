import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { StorageService } from '../utils/storage.service';
import { LOCAL_STORAGE_VIDEOS_KEY } from '../../config/videos-storage.config';

@Injectable({
  providedIn: 'root'
})
export class VideosStoreService {

  public savedVideosData$ = new BehaviorSubject<SavedVideoData[]>(this.getSavedVideosData());

  constructor(
    private storageService: StorageService,
  ) { }

  public getSavedVideosData(): SavedVideoData[] {
    return this.storageService.get(LOCAL_STORAGE_VIDEOS_KEY) || [];
  }

  public saveNewVideo(video: SavedVideoData): void {
    console.log(video)
  }
}
