import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import { ModalVideoData } from '../../interfaces/modal-video-data.interface';
import { VIMEO_VIDEO_TYPE, YT_VIDEO_TYPE } from '../../constans/videos-types';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
  providers: [
    { provide: YT_VIDEO_TYPE, useValue: YT_VIDEO_TYPE },
    { provide: VIMEO_VIDEO_TYPE, useValue: VIMEO_VIDEO_TYPE },
  ],
})
export class VideoModalComponent {

  public readonly YT_URL = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.data.video.id}`);
  public readonly VIMEO_URL = this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${this.data.video.id}`);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalVideoData,
    @Inject(YT_VIDEO_TYPE) public ytVideoType: string,
    @Inject(VIMEO_VIDEO_TYPE) public vimeoVideoType: string,
    private sanitizer: DomSanitizer,
  ) { }
}
