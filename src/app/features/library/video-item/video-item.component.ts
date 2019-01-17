import { Component, Input } from '@angular/core';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { ModalService } from '../../../core/services/utils/modal.service';
import { ViewModeService } from '../../../core/services/utils/view-mode.service';
import { VideosService } from '../../../core/services/data-integration/videos.service';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent {

  @Input() public video: ShownVideo;
  public viewMode$ = this.viewModeService.viewMode$;

  constructor(
    private videosService: VideosService,
    private modalService: ModalService,
    private viewModeService: ViewModeService,
  ) { }

  public openModalWithVideo(): void {
    this.modalService.openDialogWithVideo(this.video);
  }

  public addToFavourites(id: string): void {
    this.videosService.addVideoToFavourites(id);
  }

  public removeFromFavourites(id: string): void {
    this.videosService.removeVideoFromFavourites(id);
  }

  public removeFromLibrary(id: string): void {
    this.videosService.removeVideoFromLibrary(id);
  }
}
