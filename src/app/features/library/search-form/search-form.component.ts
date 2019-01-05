import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../core/services/utils/helper.service';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from '../../../core/config/videos-type.config';
import { YtDataService } from '../../../core/services/data-integration/yt-data.service';
import { VimeoDataService } from '../../../core/services/data-integration/vimeo-data.service';
import { YtVideosResponse } from '../../../shared/interfaces/youtube/yt-videos-response.interface';
import { VimeoResponse } from '../../../shared/interfaces/vimeo/vimeo-response.interface';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  providers: [
    { provide: YT_VIDEO_TYPE, useValue: 'xd' },
    { provide: VIMEO_VIDEO_TYPE, useValue: VIMEO_VIDEO_TYPE },
  ]
})
export class SearchFormComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private ytDataService: YtDataService,
    private vimeoDataService: VimeoDataService,
    private videosStoreService: VideosStoreService,
    @Inject(YT_VIDEO_TYPE) public ytVideoType: string,
    @Inject(VIMEO_VIDEO_TYPE) public vimeoVideoType: string,
  ) {}

  public ngOnInit(): void {
    this.form = this.createForm();
  }

  public onSubmit(): void {
    const id = this.helperService.extractId(this.form.value.id);
    const type = this.form.value.type;
    let foundVideo: SavedVideoData;

    if (id.trim() === '') {
      return;
    }

    if (type === YT_VIDEO_TYPE) {
      this.ytDataService.getVideoByIds([id])
        .subscribe((response: YtVideosResponse) => {
          const video = response.items[0];

          foundVideo = {
            type: YT_VIDEO_TYPE,
            id: video.id,
            addedToLibraryAt: new Date(),
            isFavourite: false,
          };

          this.videosStoreService.saveNewVideo(foundVideo);
        });
    } else {
      this.vimeoDataService.getVideoByIds([id])
        .subscribe((response: VimeoResponse) => {
          const video = response.data[0];

          foundVideo = {
            type: YT_VIDEO_TYPE,
            id: this.helperService.extractId(video.link),
            addedToLibraryAt: new Date(),
            isFavourite: false,
          };

          this.videosStoreService.saveNewVideo(foundVideo);
        });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: ['', Validators.required],
      type: [YT_VIDEO_TYPE],
    });
  }
}
