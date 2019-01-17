import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';
import { VideoModalComponent } from '../../../shared/components/video-modal/video-modal.component';
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
}
