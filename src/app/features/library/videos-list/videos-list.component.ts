import { Component } from '@angular/core';
import { VideosStoreService } from '../../../core/services/data-integration/videos-store.service';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss']
})
export class VideosListComponent {

  public savedVideosData$ = this.videosStoreService.savedVideosData$;

  constructor(
    private videosStoreService: VideosStoreService,
  ) { }
}
