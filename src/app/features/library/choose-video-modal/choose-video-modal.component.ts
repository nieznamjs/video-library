import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ChooseVideoModalData } from '../../../shared/interfaces/choose-video-modal-data.interface';
import { VideoNotSaved } from '../../../shared/interfaces/video-not-saved.interface';
import { SavedVideoData } from '../../../shared/interfaces/saved-video-data.interface';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';

@Component({
  selector: 'app-choose-video-modal',
  templateUrl: './choose-video-modal.component.html',
  styleUrls: ['./choose-video-modal.component.scss'],
})
export class ChooseVideoModalComponent {

  constructor(
    private videosStoreService: VideosStoreService,
    private dialog: MatDialogRef<ChooseVideoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChooseVideoModalData,
  ) { }

  public chooseVideo(video: VideoNotSaved): void {
    const chosenVideo: SavedVideoData = {
      id: video.id,
      type: video.type,
      isFavourite: false,
      addedToLibraryAt: new Date(),
    };

    this.videosStoreService.saveNewVideo(chosenVideo);
    this.dialog.close();
  }
}
