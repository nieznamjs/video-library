import { Component, Input, OnInit } from '@angular/core';

import { ShownVideo } from '../../../shared/interfaces/shown-video.interface';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent implements OnInit {

  @Input() video: ShownVideo;

  constructor(private videosStoreService: VideosStoreService) { }

  ngOnInit() {
  }

  public addToFavourites(id: string): void {
    this.videosStoreService.addVideoToFavourites(id);
  }

  public removeFromFavourites(id: string): void {
    this.videosStoreService.removeVideoFromFavourites(id);
  }
}
