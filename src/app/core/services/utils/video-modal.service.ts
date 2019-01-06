import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';
import { VideoModalComponent } from '../../../shared/components/video-modal/video-modal.component';

@Injectable({
  providedIn: 'root'
})
export class VideoModalService {

  constructor(
    private dialog: MatDialog,
  ) { }

  public openDialogWithVideo(id: string, type: string): void {
    this.dialog.open(VideoModalComponent, {
      data: {
        id: id,
        type: type,
      },
    });
  }
}
