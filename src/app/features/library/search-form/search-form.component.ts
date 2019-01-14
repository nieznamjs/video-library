import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { HelperService } from '../../../core/services/utils/helper.service';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from '../../../shared/constans/videos-types';
import { YtDataService } from '../../../core/services/data-integration/yt-data.service';
import { VimeoDataService } from '../../../core/services/data-integration/vimeo-data.service';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';
import { SnackbarService } from '../../../core/services/utils/snackbar.service';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';
import { VideosService } from '../../../core/services/data-integration/videos.service';
import { ModalService } from '../../../core/services/utils/modal.service';

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

  public searchField = '';
  private readonly VIDEO_NOT_FOUND_MESSAGE = 'Video not found';

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private ytDataService: YtDataService,
    private vimeoDataService: VimeoDataService,
    private videosStoreService: VideosStoreService,
    private videosService: VideosService,
    private snackbarService: SnackbarService,
    private modalService: ModalService,
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
      .pipe(
        map((videosArrays: VideoNotSaved[][]) => {
          return videosArrays.filter(videos => videos.length !== 0)[0];
        })
      )
      .subscribe((videosArray: VideoNotSaved[]) => {
        if (!videosArray) {
          this.snackbarService.openErrorSnackbar(this.VIDEO_NOT_FOUND_MESSAGE);
        } else if (videosArray.length > 1) {
          this.modalService.openModalToChooseVideo(videosArray);
        } else {
          foundVideo = {
            id: videosArray[0].id,
            type: videosArray[0].type,
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
