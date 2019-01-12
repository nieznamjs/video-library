import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material';
import { VideoModalComponent } from '../../../shared/components/video-modal/video-modal.component';
import { ChooseVideoModalComponent } from '../../../features/library/choose-video-modal/choose-video-modal.component';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

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

  public openModalToChooseVideo(videos: VideoNotSaved[]): void {
    this.dialog.open(ChooseVideoModalComponent, {
      data: {
        videos: videos,
      },
    });
  }
}
