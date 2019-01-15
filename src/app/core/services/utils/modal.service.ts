import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';
import { VideoModalComponent } from '../../../shared/components/video-modal/video-modal.component';
import { ChooseVideoModalComponent } from '../../../features/library/choose-video-modal/choose-video-modal.component';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';
import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private dialog: MatDialog,
  ) { }

  public openDialogWithVideo(video: ShownVideo): void {
    this.dialog.open(VideoModalComponent, {
      data: {
        video: video
      },
    });
  }

  public openModalToChooseVideo(videos: VideoNotSaved[]): void {
    this.dialog.open(ChooseVideoModalComponent, {
      data: {
        videos: videos,
      },
    });
  }
}
