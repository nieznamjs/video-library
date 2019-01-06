import { Component, Input } from '@angular/core';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';
import { VideoModalService } from '../../../core/services/utils/video-modal.service';
import { ViewModeService } from '../../../core/services/utils/view-mode.service';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent {

  @Input() public video: ShownVideo;
  public viewMode$ = this.viewModeService.viewMode$;

  constructor(
    private videosStoreService: VideosStoreService,
    private videoModalService: VideoModalService,
    private viewModeService: ViewModeService,
  ) { }

  public openModalWithVideo(id: string, type: string): void {
    this.videoModalService.openDialogWithVideo(id, type);
  }

  public addToFavourites(id: string): void {
    this.videosStoreService.addVideoToFavourites(id);
  }

  public removeFromFavourites(id: string): void {
    this.videosStoreService.removeVideoFromFavourites(id);
  }

  public removeFromLibrary(id: string): void {
    this.videosStoreService.removeFromLibrary(id);
  }
}
