import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { HelperService } from '../../../core/services/utils/helper.service';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from '../../../shared/constans/videos-types';
import { YtDataService } from '../../../core/services/data-integration/yt-data.service';
import { VimeoDataService } from '../../../core/services/data-integration/vimeo-data.service';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';
import { SnackbarService } from '../../../core/services/utils/snackbar.service';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  providers: [
    { provide: YT_VIDEO_TYPE, useValue: YT_VIDEO_TYPE },
    { provide: VIMEO_VIDEO_TYPE, useValue: VIMEO_VIDEO_TYPE },
  ],
})
export class SearchFormComponent {

  public searchField;
  private readonly VIDEO_NOT_FOUND_MESSAGE = 'Video not found';

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private ytDataService: YtDataService,
    private vimeoDataService: VimeoDataService,
    private videosStoreService: VideosStoreService,
    private snackbarService: SnackbarService,
    @Inject(YT_VIDEO_TYPE) public ytVideoType: string,
    @Inject(VIMEO_VIDEO_TYPE) public vimeoVideoType: string,
  ) {}

  public getDemoVideos(): void {
    this.videosStoreService.getDemoVideos();
  }

  public onSubmit(): void {
    const id = this.helperService.extractId(this.searchField);
    let foundVideo: SavedVideoData;
    const ytObservable = this.ytDataService.getVideoByIds([id]);
    const vimeoObservable = this.vimeoDataService.getVideoByIds([id]);

    if (id.trim() === '') {
      return;
    }

    forkJoin(ytObservable, vimeoObservable)
      .subscribe((videosArrays: VideoNotSaved[][]) => {
        const videos = videosArrays.filter((videos: VideoNotSaved[]) => videos.length !== 0)[0];

        if (!videos) {
          this.snackbarService.openErrorSnackbar(this.VIDEO_NOT_FOUND_MESSAGE);
        } else if (videos.length > 1) {
          console.log('Znaleziono dwa filmy, wybierz który chcesz'); // TODO do it later
        } else {
          foundVideo = {
            id: videos[0].id,
            type: videos[0].type,
            addedToLibraryAt: new Date(),
            isFavourite: false,
          };

          this.videosStoreService.saveNewVideo(foundVideo);
        }
      });

    this.clearInput();
  }

  private clearInput(): void {
    this.searchField = '';
  }
}
