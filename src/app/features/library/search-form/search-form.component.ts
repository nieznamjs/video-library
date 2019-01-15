import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { HelperService } from '../../../core/services/utils/helper.service';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from '../../../shared/constans/videos-types';
import { YtDataService } from '../../../core/services/data-integration/yt-data.service';
import { VimeoDataService } from '../../../core/services/data-integration/vimeo-data.service';
import { VideosService } from '../../../core/services/data-integration/videos.service';

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

  constructor(
    private fb: FormBuilder,
    private helperService: HelperService,
    private ytDataService: YtDataService,
    private vimeoDataService: VimeoDataService,
    private videosService: VideosService,
    @Inject(YT_VIDEO_TYPE) public ytVideoType: string,
    @Inject(VIMEO_VIDEO_TYPE) public vimeoVideoType: string,
  ) {}

  public getDemoVideos(): void {
    this.videosService.getDemoVideos();
  }

  public onSubmit(): void {
    const id = this.helperService.extractId(this.searchField);

    if (id.trim() === '') {
      return;
    }

    this.videosService.findVideoById(id);

    this.clearInput();
  }

  private clearInput(): void {
    this.searchField = '';
  }
}
